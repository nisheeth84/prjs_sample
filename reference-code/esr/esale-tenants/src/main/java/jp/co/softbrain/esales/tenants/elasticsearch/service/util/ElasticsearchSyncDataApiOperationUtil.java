package jp.co.softbrain.esales.tenants.elasticsearch.service.util;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeDataSyncElasticsearchResponse;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeGetDataSyncElasticsearchRequest;
import jp.co.softbrain.esales.elasticsearch.dto.products.ProductDataSyncElasticSearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.products.ProductDataSyncElasticsearchResponse;
import jp.co.softbrain.esales.elasticsearch.dto.products.ProductGetDataSyncElasticsearchRequest;
import jp.co.softbrain.esales.elasticsearch.dto.sales.ProductTradingDataSyncElasticsearchResponse;
import jp.co.softbrain.esales.elasticsearch.dto.sales.ProductTradingGetDataSyncElasticsearchRequest;
import jp.co.softbrain.esales.elasticsearch.dto.sales.ProductTradingsElasticSearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.schedules.CalendarDataSyncElasticSearchDTO;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.elasticsearch.service.dto.schedules.ScheduleDataSyncElasticSearchResponse;
import jp.co.softbrain.esales.tenants.elasticsearch.service.dto.schedules.ScheduleGetDataSyncElasticsearchRequest;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * RestOperationUtil
 *
 * @author tongminhcuong
 */
@Component
public class ElasticsearchSyncDataApiOperationUtil {
    private final Logger log = LoggerFactory.getLogger(ElasticsearchSyncDataApiOperationUtil.class);

    private static final String API_NAME_GET_DATA_ELASTICSEARCH_SCHEDULE = "get-data-elasticsearch";

    private static final String API_NAME_GET_DATA_ELASTICSEARCH_PRODUCT = "get-data-elasticsearch";

    private static final String API_NAME_GET_DATA_ELASTICSEARCH_EMPLOYEE = "get-data-elasticsearch";

    private static final String API_NAME_GET_DATA_ELASTICSEARCH_SALES = "get-data-elasticsearch";

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * Call API getDataSyncElasticSearch for Calendar
     *
     * @param calendarIdDataSyncList calendarIdDataSyncList
     * @param tenantName tenantName
     * @return list of CalendarDataSyncElasticSearchDTO
     */
    public List<CalendarDataSyncElasticSearchDTO> callGetSyncDataSchedule(List<Long> calendarIdDataSyncList,
            String tenantName) {
        if (calendarIdDataSyncList.isEmpty()) {
            return Collections.emptyList();
        }

        ScheduleGetDataSyncElasticsearchRequest request = new ScheduleGetDataSyncElasticsearchRequest();
        request.setCalendarIds(calendarIdDataSyncList);
        request.setLanguageCode(ConstantsTenants.DEFAULT_LANG);

        try {
            ScheduleDataSyncElasticSearchResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.SCHEDULES,
                    API_NAME_GET_DATA_ELASTICSEARCH_SCHEDULE,
                    HttpMethod.POST,
                    request,
                    ScheduleDataSyncElasticSearchResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    tenantName);

            log.debug("\n\n\n\n============\n\tSCHEDULE DATA SYNC RES : {}\n================", response);
            return response.getCalendars();
        } catch (CustomRestException | IllegalStateException e) {
            log.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Call API getDataSyncElasticSearch for Products
     *
     * @param productIdDataSyncList productIdDataSyncList
     * @param tenantName tenantName
     * @return list of ProductDataSyncElasticSearchDTO
     */
    public List<ProductDataSyncElasticSearchDTO> callGetSyncDataProduct(List<Long> productIdDataSyncList,
            String tenantName) {
        if (productIdDataSyncList.isEmpty()) {
            return Collections.emptyList();
        }

        ProductGetDataSyncElasticsearchRequest request = new ProductGetDataSyncElasticsearchRequest();
        request.setProductIds(productIdDataSyncList);

        try {
            ProductDataSyncElasticsearchResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.PRODUCTS,
                    API_NAME_GET_DATA_ELASTICSEARCH_PRODUCT,
                    HttpMethod.POST,
                    request,
                    ProductDataSyncElasticsearchResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    tenantName);

            log.debug("\n\n\n\n============\n\tPRODUCT DATA SYNC RES : {}\n================", response);
            return response.getProducts();
        } catch (CustomRestException | IllegalStateException e) {
            log.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Call API getDataSyncElasticSearch for Employees
     *
     * @param employeeIdDataSyncList employeeIdDataSyncList
     * @param tenantName tenantName
     * @return list of ProductDataSyncElasticSearchDTO
     */
    public List<EmployeeElasticsearchDTO> callGetSyncDataEmployee(List<Long> employeeIdDataSyncList,
            String tenantName) {
        if (employeeIdDataSyncList.isEmpty()) {
            return Collections.emptyList();
        }


        EmployeeGetDataSyncElasticsearchRequest request = new EmployeeGetDataSyncElasticsearchRequest();
        request.setEmployeeIds(employeeIdDataSyncList);

        try {
            EmployeeDataSyncElasticsearchResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.EMPLOYEES,
                    API_NAME_GET_DATA_ELASTICSEARCH_EMPLOYEE,
                    HttpMethod.POST,
                    request,
                    EmployeeDataSyncElasticsearchResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    tenantName);

            log.debug("\n\n\n\n============\n\tEMPLOYEE DATA SYNC RES : {}\n================", response);
            return response.getEmployees();
        } catch (CustomRestException | IllegalStateException e) {
            log.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Call API getDataSyncElasticSearch for Sales
     *
     * @param productTradingIdDataSyncList productTradingIdDataSyncList
     * @param tenantName tenantName
     * @return list of ProductDataSyncElasticSearchDTO
     */
    public List<ProductTradingsElasticSearchDTO> callGetSyncDataProductTrading(List<Long> productTradingIdDataSyncList,
                                                                               String tenantName) {
        if (productTradingIdDataSyncList.isEmpty()) {
            return Collections.emptyList();
        }


        ProductTradingGetDataSyncElasticsearchRequest request = new ProductTradingGetDataSyncElasticsearchRequest();
        request.setProductTradingIds(productTradingIdDataSyncList);

        try {
            ProductTradingDataSyncElasticsearchResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.SALES,
                    API_NAME_GET_DATA_ELASTICSEARCH_SALES,
                    HttpMethod.POST,
                    request,
                    ProductTradingDataSyncElasticsearchResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    tenantName);

            log.debug("\n\n\n\n============\n\tPRODUCT TRADING DATA SYNC RES : {}\n================", response);
            return response.getProductTradings();
        } catch (CustomRestException | IllegalStateException e) {
            log.error(e.getMessage(), e);
            return Collections.emptyList();
        }
    }

}
