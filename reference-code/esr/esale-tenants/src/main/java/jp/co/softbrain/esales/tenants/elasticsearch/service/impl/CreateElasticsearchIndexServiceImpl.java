package jp.co.softbrain.esales.tenants.elasticsearch.service.impl;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.elasticsearch.CalendarIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.EmployeeIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.ProductIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.ProductTradingIndexElasticSearch;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.products.ProductDataSyncElasticSearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.sales.ProductTradingsElasticSearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.schedules.CalendarDataSyncElasticSearchDTO;
import jp.co.softbrain.esales.tenants.elasticsearch.service.CreateElasticsearchIndexService;
import jp.co.softbrain.esales.tenants.elasticsearch.service.util.ElasticsearchSyncDataApiOperationUtil;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.GetAllCalendarIdResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.GetAllEmployeeIdResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.GetAllProductIdResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.GetAllProductTradingIdResponse;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implement class for business logic of batch create elasticsearch index
 *
 * @author trinhtienmanh
 */
@Service
public class CreateElasticsearchIndexServiceImpl implements CreateElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(CreateElasticsearchIndexServiceImpl.class);

    /**
     * Constant for logging
     */
    private static final String NUMBER_DATA_SYNC_SUCCESS = "Number of data sync Success";
    private static final String NUMBER_DATA_SYNC_FAIL = "Number of data sync Failed";
    private static final String LIST_DATA_SYNC_FAIL = "List of failed id";
    private static final String COMMA = ":";
    private static final String SPACE = " ";
    private static final String NEW_LINE = "\n";
    private static final String CURLY_BRACKETS = "{}";

    /**
     * Map representative for micro service name
     */
    private static final String GET_ALL_DATA_ID = "getAllDataId";
    private static final String CALL_API_MSG_FAILED = "Call API %s of %s failed.";

    private static final String API_NAME_GET_ALL_CALENDAR_ID = "get-all-calendar-id";
    private static final String API_NAME_GET_ALL_PRODUCT_ID = "get-all-product-id";
    private static final String API_NAME_GET_ALL_EMPLOYEE_ID = "get-all-employee-id";
    private static final String API_NAME_GET_ALL_PRODUCT_TRADING_ID = "get-all-product-trading-id";

    @Autowired
    private EmployeeIndexElasticsearch employeeIndexElasticsearch;

    @Autowired
    private CalendarIndexElasticsearch calendarIndexElasticsearch;

    @Autowired
    private ProductIndexElasticsearch productIndexElasticsearch;

    @Autowired
    private ProductTradingIndexElasticSearch productTradingIndexElasticSearch;

    @Autowired
    private ElasticsearchSyncDataApiOperationUtil elasticsearchSyncDataApiOperationUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * @see CreateElasticsearchIndexService#callServiceAsync(String, Long)
     */
    @Override
    public void callServiceAsync(String tenantName, Long extensionBelong) {
        // Indexing Elasticsearch
        IndexingElasticsearchResult indexESResult = indexingElasticsearch(extensionBelong.intValue(), tenantName);

        // write log
        int numberDataSyncSuccess = indexESResult.getSyncSuccessDataIds().size();
        long numberDataImpossibleSync = indexESResult.getSyncFailedDataIds().size();

        writeLog(numberDataSyncSuccess, numberDataImpossibleSync, indexESResult.getSyncFailedDataIds());

        if (numberDataImpossibleSync > 0) {
            throw new IllegalStateException("Reindexing elasticsearch failed.");
        }

    }

    /**
     * Execute indexing for all of document in specified micro service
     *
     * @param extensionBelong The value is representative specified micro
     *        service
     * @param tenantName The name of tenant
     * @return Result included: list of data_change_id success and list of
     *         data_change_id failed
     */
    private IndexingElasticsearchResult indexingElasticsearch(Integer extensionBelong,
            String tenantName) {

        if (extensionBelong.compareTo(FieldBelongEnum.TASK.getCode()) == 0) {
            return indexingElasticsearchForSchedulesService(tenantName);
        }
        if (extensionBelong.compareTo(FieldBelongEnum.PRODUCT.getCode()) == 0) {
            return indexingElasticsearchForProductsService(tenantName);
        }
        if (extensionBelong.compareTo(FieldBelongEnum.EMPLOYEE.getCode()) == 0) {
            return indexingElasticsearchForEmployeesService(tenantName);
        }
        if (extensionBelong.compareTo(FieldBelongEnum.TRADING_PRODUCT.getCode()) == 0) {
            return indexingElasticsearchForProductTradingService(tenantName);
        }

        // default
        log.error("Unknown extension_belong: {}", extensionBelong);
        return new IndexingElasticsearchResult(Collections.emptyList(), Collections.emptyList());
    }

    /**
     * Execute indexing for all of document in "schedules" service
     *
     * @param tenantName The name of tenant
     * @return Result included: list of data_change_id success and list of
     *         data_change_id failed
     */
    private IndexingElasticsearchResult indexingElasticsearchForSchedulesService(String tenantName) {

        // build list of schedule_id will be use to get data sync
        List<Long> calendarIdDataSyncList = null;
        try {
            calendarIdDataSyncList = callApiGetAllCalendarId(tenantName);
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_ALL_DATA_ID, "Schedule");
            log.error(msg);
            throw new IllegalStateException(msg);
        }

        if (calendarIdDataSyncList == null || calendarIdDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), Collections.emptyList());
        }

        // call API getDataSyncElasticSearch
        List<CalendarDataSyncElasticSearchDTO> calendarDataSyncList = elasticsearchSyncDataApiOperationUtil
                .callGetSyncDataSchedule(calendarIdDataSyncList, tenantName);

        if (calendarDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), calendarIdDataSyncList);
        }

        List<Long> calendarIdList = calendarDataSyncList.stream()
                .map(CalendarDataSyncElasticSearchDTO::getCalendarId).collect(Collectors.toList());

        // put index elasticsearch
        try {
            calendarIndexElasticsearch.putIndexElasticsearch(tenantName, calendarDataSyncList);
        } catch (Exception e) {
            log.error("Calendar indexing elasticsearch failed.");
            return new IndexingElasticsearchResult(Collections.emptyList(), calendarIdList);
        }

        return new IndexingElasticsearchResult(calendarIdList, Collections.emptyList());
    }

    /**
     * Call API get-all-calendar-id
     *
     * @param tenantName Name of tenants
     * @return List calendar_id
     */
    public List<Long> callApiGetAllCalendarId(String tenantName) {

        GetAllCalendarIdResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.SCHEDULES,
                API_NAME_GET_ALL_CALENDAR_ID,
                HttpMethod.POST,
                null,
                GetAllCalendarIdResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        return response.getCalendarId();
    }

    /**
     * Execute indexing for all of document in "products" service
     *
     * @param tenantName The name of tenant
     * @return Result included: list of data_change_id success and list of
     *         data_change_id failed
     */
    private IndexingElasticsearchResult indexingElasticsearchForProductsService(String tenantName) {

        // build list of product will be use to get data sync
        List<Long> productIdDataSyncList = null;
        try {
            productIdDataSyncList = callApiGetAllProductId(tenantName);
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_ALL_DATA_ID, "Product");
            log.error(msg);
            throw new IllegalStateException(msg);
        }
        if (productIdDataSyncList == null || productIdDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), Collections.emptyList());
        }

        // call API getDataSyncElasticSearch
        List<ProductDataSyncElasticSearchDTO> productDataSyncList = elasticsearchSyncDataApiOperationUtil
                .callGetSyncDataProduct(productIdDataSyncList, tenantName);

        if (productDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), productIdDataSyncList);
        }

        List<Long> productIdList = productDataSyncList.stream()
                .map(ProductDataSyncElasticSearchDTO::getProductId).collect(Collectors.toList());

        // put index elasticsearch
        try {
            productIndexElasticsearch.putIndexElasticsearch(tenantName, productDataSyncList);
        } catch (Exception e) {
            log.error("Product indexing elasticsearch failed.");
            return new IndexingElasticsearchResult(Collections.emptyList(), productIdList);
        }

        return new IndexingElasticsearchResult(productIdList, Collections.emptyList());
    }

    /**
     * Call API get-all-product-id
     *
     * @param tenantName Name of tenants
     * @return List product id
     */
    public List<Long> callApiGetAllProductId(String tenantName) {

        GetAllProductIdResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.PRODUCTS,
                API_NAME_GET_ALL_PRODUCT_ID,
                HttpMethod.POST,
                null,
                GetAllProductIdResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        return response.getProductId();
    }

    /**
     * Execute indexing for all of document in "employees" service
     *
     * @param tenantName The name of tenant
     * @return Result included: list of data_change_id success and list of
     *         data_change_id failed
     */
    private IndexingElasticsearchResult indexingElasticsearchForEmployeesService(String tenantName) {

        // build list of employee_id will be use to get data sync
        List<Long> employeeIdDataSyncList = null;
        try {
            employeeIdDataSyncList = callApiGetAllEmployeeId(tenantName);
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_ALL_DATA_ID, "Employee");
            log.error(msg);
            throw new IllegalStateException(msg);
        }
        if (employeeIdDataSyncList == null || employeeIdDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), Collections.emptyList());
        }

        // call API getDataSyncElasticSearch
        List<EmployeeElasticsearchDTO> employeeDataSyncList = elasticsearchSyncDataApiOperationUtil
                .callGetSyncDataEmployee(employeeIdDataSyncList, tenantName);

        if (employeeDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), employeeIdDataSyncList);
        }

        List<Long> employeeIdList = employeeDataSyncList.stream()
                .map(EmployeeElasticsearchDTO::getEmployeeId).collect(Collectors.toList());

        // put index elasticsearch
        try {
            employeeIndexElasticsearch.putIndexElasticsearch(tenantName, employeeDataSyncList);
        } catch (Exception e) {
            log.error("Employee indexing elasticsearch failed.");
            return new IndexingElasticsearchResult(Collections.emptyList(), employeeIdList);
        }

        return new IndexingElasticsearchResult(employeeIdList, Collections.emptyList());
    }

    /**
     * Call API get-all-employee-id
     *
     * @param tenantName Name of tenants
     * @return List employee id
     */
    public List<Long> callApiGetAllEmployeeId(String tenantName) {

        GetAllEmployeeIdResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES,
                API_NAME_GET_ALL_EMPLOYEE_ID,
                HttpMethod.POST,
                null,
                GetAllEmployeeIdResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        return response.getEmployeeIds();
    }

    /**
     * Execute indexing for all of document in "sales" service
     *
     * @param tenantName The name of tenant
     * @return Result included: list of data_change_id success and list of
     *         data_change_id failed
     */
    private IndexingElasticsearchResult indexingElasticsearchForProductTradingService(String tenantName) {

        // build list of employee_id will be use to get data sync
        List<Long> productTradingIdDataSyncList = null;
        try {
            productTradingIdDataSyncList = callApiGetAllProductTradingId(tenantName);
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_ALL_DATA_ID, "Product trading");
            log.error(msg);
            throw new IllegalStateException(msg);
        }
        if (productTradingIdDataSyncList == null || productTradingIdDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), Collections.emptyList());
        }

        // call API getDataSyncElasticSearch
        List<ProductTradingsElasticSearchDTO> productTradingDataSyncList = elasticsearchSyncDataApiOperationUtil
                .callGetSyncDataProductTrading(productTradingIdDataSyncList, tenantName);

        if (productTradingDataSyncList.isEmpty()) {
            return new IndexingElasticsearchResult(Collections.emptyList(), productTradingIdDataSyncList);
        }

        List<Long> productTradingIdList = productTradingDataSyncList.stream()
                .map(ProductTradingsElasticSearchDTO::getProductTradingId).collect(Collectors.toList());

        // put index elasticsearch
        try {
            productTradingIndexElasticSearch.putIndexElasticsearch(tenantName, productTradingDataSyncList);
        } catch (Exception e) {
            log.error("Employee indexing elasticsearch failed.");
            return new IndexingElasticsearchResult(Collections.emptyList(), productTradingIdList);
        }

        return new IndexingElasticsearchResult(productTradingIdList, Collections.emptyList());
    }

    /**
     * Call API get-all-employee-id
     *
     * @param tenantName Name of tenants
     * @return List employee id
     */
    public List<Long> callApiGetAllProductTradingId(String tenantName) {

        GetAllProductTradingIdResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.SALES,
                API_NAME_GET_ALL_PRODUCT_TRADING_ID,
                HttpMethod.POST,
                null,
                GetAllProductTradingIdResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);
        return response.getProductTradingIds();
    }

    /**
     * write Log
     *
     * @param numberDataSyncSuccess number data sync success
     * @param numberDataImpossibleSync number data impossible sync
     * @param failedIndexingList list info of indexing fail
     */
    private void writeLog(Integer numberDataSyncSuccess, long numberDataImpossibleSync, List<Long> failedIndexingList) {

        String logContent = "\n----------------------------------------------------------\n"
                + NUMBER_DATA_SYNC_SUCCESS + COMMA + SPACE + CURLY_BRACKETS
                + NEW_LINE
                + NUMBER_DATA_SYNC_FAIL + COMMA + SPACE + CURLY_BRACKETS
                + NEW_LINE
                + LIST_DATA_SYNC_FAIL + COMMA + NEW_LINE
                + CURLY_BRACKETS
                + "\n----------------------------------------------------------\n";
        log.info(logContent, numberDataSyncSuccess, numberDataImpossibleSync, failedIndexingList);
    }

    @lombok.Value
    private static class IndexingElasticsearchResult {

        List<Long> syncSuccessDataIds;

        List<Long> syncFailedDataIds;
    }
}
