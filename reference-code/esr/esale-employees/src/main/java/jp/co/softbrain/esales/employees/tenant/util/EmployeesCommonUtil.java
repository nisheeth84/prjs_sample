package jp.co.softbrain.esales.employees.tenant.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDataType;
import jp.co.softbrain.esales.employees.service.dto.GetProductTradingsRequest;
import jp.co.softbrain.esales.employees.service.dto.activities.GetActivitiesRequest;
import jp.co.softbrain.esales.employees.service.dto.businesscards.GetBusinessCardsRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.customers.GetCustomersRequest;
import jp.co.softbrain.esales.employees.service.dto.products.GetProductsRequest;
import jp.co.softbrain.esales.employees.service.dto.tasks.GetTasksInLocalNavigationsDTO;
import jp.co.softbrain.esales.employees.service.dto.tasks.GetTasksRequest;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeesRequest;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.GetIdsBySearchConditionsOut;
import jp.co.softbrain.esales.utils.dto.SearchItem;

public class EmployeesCommonUtil {
    private static final Logger log = LoggerFactory.getLogger(EmployeesCommonUtil.class);

    private EmployeesCommonUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Get Ids Relation From Activities
     *
     * @param listConditions - list search conditions
     * @param restOperationUtils
     * @return - list id from activities
     */
    public static List<Long> getIdsRelationFromActivities(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        // create request
        GetActivitiesRequest activitiesRequest = new GetActivitiesRequest();
        activitiesRequest.setListBusinessCardId(new ArrayList<>());
        activitiesRequest.setListCustomerId(new ArrayList<>());
        activitiesRequest.setListProductTradingId(new ArrayList<>());
        activitiesRequest.setSearchLocal("");
        activitiesRequest.setFilterConditions(new ArrayList<>());
        activitiesRequest.setSelectedTargetType(ConstantsEmployees.NUMBER_ZERO);
        activitiesRequest.setSelectedTargetId(ConstantsEmployees.LONG_VALUE_0L);
        activitiesRequest.setOrderBy(new ArrayList<>());
        activitiesRequest.setOffset(ConstantsEmployees.NUMBER_ZERO);
        activitiesRequest.setLimit(ConstantsEmployees.DEFAULT_INTEGER_LIMIT_VALUE);
        activitiesRequest.setHasTimeline(false);
        activitiesRequest.setIsUpdateListView(false);

        activitiesRequest.setSearchConditions(listConditions);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.ACTIVITIES,
                ConstantsEmployees.API_GET_IDS_OF_GET_ACTIVITIES, HttpMethod.POST, activitiesRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();

    }

    /**
     * Get Ids Relation From BusinessCards
     *
     * @param listConditions - list search conditions
     * @return - list id from BusinessCards
     */
    public static List<Long> getIdsRelationFromBusinessCards(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        // create request
        GetBusinessCardsRequest businessCardsRequest = new GetBusinessCardsRequest();
        businessCardsRequest.setSelectedTargetType(ConstantsEmployees.NUMBER_ZERO);
        businessCardsRequest.setSelectedTargetId(ConstantsEmployees.LONG_VALUE_0L);
        businessCardsRequest.setSearchConditions(listConditions);
        businessCardsRequest.setOrderBy(new ArrayList<>());
        businessCardsRequest.setOffset(ConstantsEmployees.LONG_VALUE_0L);
        businessCardsRequest.setLimit(ConstantsEmployees.DEFAULT_LIMIT_VALUE);
        businessCardsRequest.setSearchLocal("");
        businessCardsRequest.setFilterConditions(new ArrayList<>());
        businessCardsRequest.setIsFirstLoad(false);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.BUSINESSCARDS,
                ConstantsEmployees.API_GET_IDS_OF_GET_BUSINESS_CARDS, HttpMethod.POST, businessCardsRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get Ids Relation From Customers
     *
     * @param listConditions - list search conditions
     * @return - list id from Customers
     */
    public static List<Long> getIdsRelationFromCustomers(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        GetCustomersRequest customersRequest = new GetCustomersRequest();
        customersRequest.setSearchConditions(listConditions);
        customersRequest.setFilterConditions(new ArrayList<>());
        customersRequest.setLocalSearchKeyword("");
        customersRequest.setSelectedTargetType(ConstantsEmployees.NUMBER_ZERO);
        customersRequest.setSelectedTargetId(ConstantsEmployees.LONG_VALUE_0L);
        customersRequest.setOrderBy(new ArrayList<>());
        customersRequest.setOffset(ConstantsEmployees.NUMBER_ZERO);
        customersRequest.setLimit(ConstantsEmployees.DEFAULT_INTEGER_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.CUSTOMERS,
                ConstantsEmployees.API_GET_IDS_OF_GET_CUSTOMERS, HttpMethod.POST, customersRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get Ids Relation From Employees
     *
     * @param listConditions - list search conditions
     * @return - list id from Employees
     */
    public static List<Long> getIdsRelationFromEmployees(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        // create request
        GetEmployeesRequest employeesRequest = new GetEmployeesRequest();
        employeesRequest.setSearchConditions(listConditions);
        employeesRequest.setFilterConditions(new ArrayList<>());
        employeesRequest.setLocalSearchKeyword("");
        employeesRequest.setSelectedTargetType(ConstantsEmployees.NUMBER_ZERO);
        employeesRequest.setSelectedTargetId(ConstantsEmployees.LONG_VALUE_0L);
        employeesRequest.setOrderBy(new ArrayList<>());
        employeesRequest.setOffset(ConstantsEmployees.LONG_VALUE_0L);
        employeesRequest.setLimit(ConstantsEmployees.DEFAULT_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES,
                ConstantsEmployees.API_GET_IDS_OF_GET_EMPLOYEES, HttpMethod.POST, employeesRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get Ids Relation From Procducts
     *
     * @param listConditions - list search conditions
     * @return - list id from Products
     */
    public static List<Long> getIdsRelationFromProducts(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        GetProductsRequest productsRequest = new GetProductsRequest();
        productsRequest.setSearchConditions(listConditions);
        productsRequest.setFilterConditions(new ArrayList<>());
        productsRequest.setSearchLocal("");
        productsRequest.setIsOnlyData(true);
        productsRequest.setIsUpdateListInfo(false);

        productsRequest.setOrderBy(new ArrayList<>());
        productsRequest.setOffset(ConstantsEmployees.LONG_VALUE_0L);
        productsRequest.setLimit(ConstantsEmployees.DEFAULT_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.PRODUCTS,
                ConstantsEmployees.API_GET_IDS_OF_GET_PRODUCTS, HttpMethod.POST, productsRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get Ids Relation From Tasks
     *
     * @param listConditions - list search conditions
     * @return - list id from Tasks
     */
    public static List<Long> getIdsRelationFromTasks(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        GetTasksRequest tasksRequest = new GetTasksRequest();
        tasksRequest.setStatusTaskIds(List.of(1, 2, 3));
        tasksRequest.setSearchLocal("");
        tasksRequest.setLocalNavigationConditons(new GetTasksInLocalNavigationsDTO());
        tasksRequest.setSearchConditions(listConditions);
        tasksRequest.setOrderBy(new ArrayList<>());
        tasksRequest.setFilterConditions(new ArrayList<>());
        tasksRequest.setOffset(ConstantsEmployees.LONG_VALUE_0L);
        tasksRequest.setLimit(ConstantsEmployees.DEFAULT_LIMIT_VALUE);
        tasksRequest.setFilterByUserLoginFlg(0);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.SCHEDULES,
                ConstantsEmployees.API_GET_IDS_OF_GET_TASKS, HttpMethod.POST, tasksRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get Ids Relation From Products trading
     *
     * @param listConditions - list search conditions
     * @return - list id from Products trading
     */
    public static List<Long> getIdsRelationFromSales(List<SearchItem> listConditions,
            RestOperationUtils restOperationUtils) {
        GetProductTradingsRequest productTradingsRequest = new GetProductTradingsRequest();
        productTradingsRequest.setFilterConditions(new ArrayList<>());
        productTradingsRequest.setIsOnlyData(false);
        productTradingsRequest.setOffset(ConstantsEmployees.NUMBER_ZERO);
        productTradingsRequest.setLimit(ConstantsEmployees.DEFAULT_INTEGER_LIMIT_VALUE);
        productTradingsRequest.setOrders(new ArrayList<>());
        productTradingsRequest.setSearchConditions(listConditions);
        productTradingsRequest.setProductIdFilters(new ArrayList<>());

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(Constants.PathEnum.SALES,
                ConstantsEmployees.API_GET_IDS_OF_GET_PRODUCTS_TRADINGS, HttpMethod.POST, productTradingsRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * check field type is elastic search search type
     * 
     * @param fType
     * @return
     */
    public static boolean isElasticSearchSearchType(Integer fType) {
        String fieldType = String.valueOf(fType);
        return FieldTypeEnum.FULLTEXT.getCode().equals(fieldType) || FieldTypeEnum.TEXT.getCode().equals(fieldType)
                || FieldTypeEnum.TEXTAREA.getCode().equals(fieldType) || FieldTypeEnum.FILE.getCode().equals(fieldType)
                || FieldTypeEnum.PHONE.getCode().equals(fieldType) || FieldTypeEnum.EMAIL.getCode().equals(fieldType)
                || FieldTypeEnum.LINK.getCode().equals(fieldType) || FieldTypeEnum.ADDRESS.getCode().equals(fieldType)
                || FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(fieldType);
    }

    /**
     * Log and throw tms IO exception
     * 
     * @param e
     *        exception
     */
    public static void logAndThrowTmsIOException(IOException e) {
        log.error(e.getLocalizedMessage());
        throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                CommonUtils.putError(ConstantsEmployees.EMPLOYEE_CAPTION, Constants.TMS.TMS_IO_EXCEPTION));
    }

    /**
     * buildEmployeeDataFromStringJson
     * 
     * @param listFieldInfo
     * @param employeeDataString - String json represent dynamic data as string
     * @param applicationProperties
     * @return list dynamic data
     */
    public static List<EmployeeDataType> buildEmployeeDataFromStringJson(List<CustomFieldsInfoOutDTO> listFieldInfo,
            String employeeDataString, ApplicationProperties applicationProperties) {
        if (StringUtils.isBlank(employeeDataString) || CollectionUtils.isEmpty(listFieldInfo)) {
            return new ArrayList<>();
        }

        Map<String, Object> mapDynamicData = null;

        TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true);
        objectMapper.configure(JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN, true);
        objectMapper.setNodeFactory(JsonNodeFactory.withExactBigDecimals(true));

        // parse data
        try {
            mapDynamicData = objectMapper.readValue(employeeDataString, typeRef);
        } catch (Exception e) {
            throw new CustomException(
                    String.format(ConstantsEmployees.PARSE_JSON_FAILED_FORMAT, e.getLocalizedMessage()), e);
        }
        if (CollectionUtils.isEmpty(mapDynamicData)) {
            return new ArrayList<>();
        }

        List<EmployeeDataType> listDynamicData = new ArrayList<>();
        // customize data
        mapDynamicData.entrySet().forEach(dataNode -> {
            CustomFieldsInfoOutDTO fieldInfo = listFieldInfo.stream()
                    .filter(field -> field.getFieldName().equals(dataNode.getKey())).findAny().orElse(null);
            Object value = dataNode.getValue();
            if (value == null || fieldInfo == null) {
                return;
            }

            // set value for data node
            EmployeeDataType dataField = new EmployeeDataType();
            dataField.setFieldType(String.valueOf(fieldInfo.getFieldType()));
            dataField.setKey(dataNode.getKey());
            dataField.setValue(
                    buildValueForDynamicDataNode(objectMapper, fieldInfo.getFieldType(), value, applicationProperties));

            listDynamicData.add(dataField);
        });
        return listDynamicData;
    }

    /**
     * @param objectMapper
     * @param fieldType
     * @param value
     * @param applicationProperties
     * @return
     */
    private static String buildValueForDynamicDataNode(ObjectMapper objectMapper, Integer fieldType, Object value,
            ApplicationProperties applicationProperties) {
        if (value instanceof String && StringUtils.isBlank(StringUtil.safeCastToString(value))) {
            return ConstantsEmployees.EMPTY;
        }
        // for field file
        if (FieldTypeEnum.FILE.getCode().equals(String.valueOf(fieldType))) {
            return buildValueForDynamicFileField(objectMapper, value, applicationProperties);
        }

        Gson gson = new Gson();
        if (value instanceof Map || value instanceof List) {
            try {
                return objectMapper.writeValueAsString(value);
            } catch (JsonProcessingException e) {
                return gson.toJson(value);
            }
        }
            return String.valueOf(value);
    }

    /**
     * @param value
     * @param applicationProperties
     * @return
     */
    @SuppressWarnings("unchecked")
    private static String buildValueForDynamicFileField(ObjectMapper objectMapper, Object value,
            ApplicationProperties applicationProperties) {
        TypeReference<List<Map<String, Object>>> typeRefListMap = new TypeReference<List<Map<String, Object>>>() {};
        List<Map<String, String>> fileDataList;
        if (value instanceof String) {
            try {
                fileDataList = objectMapper.readValue(String.valueOf(value), typeRefListMap);
            } catch (IOException e) {
                throw new CustomException(
                        String.format(ConstantsEmployees.PARSE_JSON_FAILED_FORMAT, e.getLocalizedMessage()), e);
            }
        } else {
            fileDataList = (List<Map<String, String>>) value;
        }

        for (Map<String, String> dataFile : fileDataList) {
            if (!StringUtils.isBlank(dataFile.get(ConstantsEmployees.FILE_PATH_ATTR))) {
                String filePath = dataFile.get(ConstantsEmployees.FILE_PATH_ATTR);
                String fileUrl = S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        filePath, applicationProperties.getExpiredSeconds());
                dataFile.put(ConstantsEmployees.FILE_URL_ATTR, fileUrl);
            }
        }

        try {
            return objectMapper.writeValueAsString(fileDataList);
        } catch (Exception e) {
            throw new CustomException(
                    String.format(ConstantsEmployees.PARSE_JSON_FAILED_FORMAT, e.getLocalizedMessage()), e);
        }
    }

}
