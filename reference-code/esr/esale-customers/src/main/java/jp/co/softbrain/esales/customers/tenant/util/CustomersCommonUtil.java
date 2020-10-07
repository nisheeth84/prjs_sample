package jp.co.softbrain.esales.customers.tenant.util;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.google.common.base.CaseFormat;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ApplicationProperties;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.dto.CustomerDataTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.activities.DeleteActivityByCustomersRequest;
import jp.co.softbrain.esales.customers.service.dto.activities.DeleteActivityByCustomersResponse;
import jp.co.softbrain.esales.customers.service.dto.activities.GetActivitiesRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.DeleteBusinessCardsInDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.DeleteBusinessCardsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.DeleteBusinessCardsRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardContactsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardContactsRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardContactsResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesRequest;
import jp.co.softbrain.esales.customers.service.dto.products.GetProductsRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.DeleteProductTradingByCustomersRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingsRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteSchedulesRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteSchedulesResponse;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteTaskCustomerRelationRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTasksInLocalNavigationsDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTasksRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.ListTaskIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.timelines.DeleteTimelinesForm;
import jp.co.softbrain.esales.customers.service.dto.timelines.ObjectIdsDeletesDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersRequest;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.DynamicDataDTO;
import jp.co.softbrain.esales.utils.dto.GetIdsBySearchConditionsOut;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import jp.co.softbrain.esales.utils.dto.commons.ValidateResponse;

/**
 * Class execute common activities
 */
public class CustomersCommonUtil {
    private static Logger log = LoggerFactory.getLogger(CustomersCommonUtil.class);

    private static final String METHOD_GET_PREFFIX = "get";
    private static final String METHOD_SET_PREFFIX = "set";
    private static final String PULLDOWN = "1";
    private static final String RADIO = "4";
    private static final String NUMBER = "5";
    private static final String ERRORS = "errors";

    @Autowired
    private static ApplicationProperties applicationProperties;

    private CustomersCommonUtil() {
    }

    /**
     * Get content change between two object
     * 
     * @param oldObj - object
     * @param newObj - the or ther
     * @param serializeNulls - flag is serialize null properties
     * @return - json object
     */
    public static JsonObject getContentChanges(Object oldObj, Object newObj, boolean serializeNulls) {
        Gson gson;
        if (serializeNulls) {
            gson = new GsonBuilder().serializeNulls().create();
        } else {
            gson = new Gson();
        }
        JsonObject result = new JsonObject();
        JsonObject oldJsonObj = new JsonParser().parse(gson.toJson(oldObj)).getAsJsonObject();
        JsonObject newJsonObj = new JsonParser().parse(gson.toJson(newObj)).getAsJsonObject();
        oldJsonObj.keySet().stream().forEach(key -> {
            if (oldJsonObj.get(key).equals(newJsonObj.get(key)) || key.equals("updatedDate")
                    || key.equals("updatedUser")) {
                return;
            }
            if (key.equals("customerData")) {
                getContentChangeDynamicData(result, gson, oldJsonObj.get(key), newJsonObj.get(key));
            } else if (key.equals("url")) {
                getContentChangeURLCustomer(result, gson, oldJsonObj.get(key), newJsonObj.get(key));
            } else {
                JsonObject subJson = new JsonObject();
                subJson.add("old", oldJsonObj.get(key));
                subJson.add("new", newJsonObj.get(key));
                result.add(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, key), subJson);
            }
        });
        return result;
    }

    /**
     * Get content change url
     * 
     * @param result - result to save content change
     * @param gson - object use to parse string json
     * @param oldJson - old object
     * @param newJson - new changed object
     */
    @SuppressWarnings("unchecked")
    private static void getContentChangeURLCustomer(JsonObject result, Gson gson, JsonElement oldJson,
            JsonElement newJson) {
        JsonObject subJson = new JsonObject();
        if (oldJson.isJsonNull() || newJson.isJsonNull()) {
            subJson.add("old", oldJson);
            subJson.add("new", newJson);
            result.add("url", subJson);
            return;
        }
        try {
            Map<String, Object> oldDataMap = gson.fromJson(gson.fromJson(oldJson, String.class), Map.class);
            Map<String, Object> newDataMap = gson.fromJson(gson.fromJson(newJson, String.class), Map.class);
            newDataMap.entrySet().stream().forEach(item -> {
                if (!oldDataMap.get(item.getKey()).equals(item.getValue())) {
                    subJson.add("old", oldJson);
                    subJson.add("new", newJson);
                    result.add("url", subJson);
                    return;
                }
            });
        } catch (Exception e) {
            log.debug("Parse json fail");
        }
    }

    /**
     * getContentChangeDynamicData
     * 
     * @param result - result to save content change
     * @param gson - object use to parse string json
     * @param oldJson - old object
     * @param newJson - new changed object
     */
    private static void getContentChangeDynamicData(JsonObject result, Gson gson, JsonElement oldJson,
            JsonElement newJson) {
        JsonObject subJson = new JsonObject();
        if (oldJson.isJsonNull() && newJson.isJsonNull()) {
            return;
        }
        if (oldJson.isJsonNull() || newJson.isJsonNull()) {
            subJson.add("old", oldJson);
            subJson.add("new", newJson);
            result.add(ConstantsCustomers.COLUMN_NAME_CUSTOMER_DATA, subJson);
            return;
        }
        try {
            String oldValue = gson.fromJson(oldJson, String.class);
            String newValue = gson.fromJson(newJson, String.class);

            TypeReference<Map<String, Object>> mapType = new TypeReference<Map<String, Object>>() {};
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> oldDataMap = objectMapper.readValue(oldValue, mapType);
            Map<String, Object> newDataMap = objectMapper.readValue(newValue, mapType);
            newDataMap.entrySet().stream().forEach(e -> {
                JsonObject dynamicFieldJson = new JsonObject();
                if (!e.getValue().equals(oldDataMap.get(e.getKey()))) {
                    if (e.getValue() instanceof List || e.getValue() instanceof Map) {
                        dynamicFieldJson.addProperty("old", gson.toJson(oldDataMap.get(e.getKey())));
                        dynamicFieldJson.addProperty("new", gson.toJson(e.getValue()));
                    } else {
                        dynamicFieldJson.addProperty("old", String.valueOf(oldDataMap.get(e.getKey())));
                        dynamicFieldJson.addProperty("new", String.valueOf(e.getValue()));
                    }

                    subJson.add(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, e.getKey()), dynamicFieldJson);
                }
            });
            if (!subJson.isJsonNull() && !(new JsonObject()).equals(subJson)) {
                result.add("customer_data", subJson);
            }
        } catch (Exception e) {
            log.debug("Parse json fail");
        }
    }

    /**
     * Call API validate common
     * 
     * @param validateJson - json string to validate
     * @param restOperationUtils - to call API
     * @param token - token value
     * @param tenantName - tenant from sesion
     * @return list errors
     */
    public static List<Map<String, Object>> validateCommon(String validateJson, RestOperationUtils restOperationUtils,
            String token, String tenantName) {
        if (StringUtil.isEmpty(validateJson)) {
            return Collections.emptyList();
        }
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        // Validate commons
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_VALIDATE_COMMON, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                tenantName);
        if (Constants.RESPONSE_FAILED == response.getStatus()) {
            return response.getErrors();
        }
        return Collections.emptyList();
    }

    /**
     * get id list from elastic search result by column_name
     * 
     * @param columnIndex
     *        index of column on elasticSearch
     * @param dataElasticSearchResponse
     * @return list id result
     */
    public static List<Long> getIdsFromElasticSearchResponse(String columnIndex,
            SelectDetailElasticSearchResponse dataElasticSearchResponse) {
        List<Long> elasticSearchIds = new ArrayList<>();
        if (dataElasticSearchResponse != null && !dataElasticSearchResponse.getDataElasticSearch().isEmpty()) {
            dataElasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                if (item.getKey().equals(columnIndex) && StringUtils.isNotBlank(item.getValue())) {
                    elasticSearchIds.add(Double.valueOf(item.getValue()).longValue());
                }
            }));
        }
        return elasticSearchIds;
    }

    /**
     * Convert customerData string to list object
     * 
     * @param objectMapper
     *        - object mapper
     * @param strCustomerData
     *        - string customerData
     * @param mapData
     *        - map data
     * @param fieldsList
     *        - list customFiledInfo
     * @return list object customer data
     * @throws IOException
     */
    public static List<DynamicDataDTO> convertCustomerDataFromString(ObjectMapper objectMapper, String strCustomerData,
            Map<String, Object> mapData, List<CustomFieldsInfoOutDTO> fieldsList) throws IOException {
        final Logger log = LoggerFactory.getLogger(CustomersCommonUtil.class);
        List<DynamicDataDTO> customerDataList = new ArrayList<>();
        if (mapData == null && StringUtils.isNotBlank(strCustomerData)) {
            TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
            mapData = objectMapper.readValue(strCustomerData, typeRef);
        }
        if (mapData == null) {
            return customerDataList;
        }
        Map<String, CustomFieldsInfoOutDTO> mapFields = new HashMap<>();
        if (fieldsList != null && !fieldsList.isEmpty()) {
            for (CustomFieldsInfoOutDTO fields : fieldsList) {
                mapFields.put(fields.getFieldName(), fields);
            }
        }
        mapData.forEach((customerDataKey, customerDataValue) -> {
            DynamicDataDTO dataField = new DynamicDataDTO();
            dataField.setKey(customerDataKey);
            if (customerDataValue != null) {
                if (customerDataValue instanceof Map || customerDataValue instanceof List) {
                    try {
                        dataField.setValue(objectMapper.writeValueAsString(customerDataValue));
                    } catch (JsonProcessingException e) {
                        log.error(e.getLocalizedMessage());
                    }
                } else {
                    dataField.setValue(String.valueOf(customerDataValue));
                }
            }
            CustomFieldsInfoOutDTO fields = mapFields.get(customerDataKey);
            if (fields != null) {
                dataField.setFieldType((fields.getFieldType()));
            }
            customerDataList.add(dataField);
        });

        return customerDataList;
    }

    /**
     * Build JSON data for customer_data field
     * 
     * @param listNewDataJson
     *        - list customerDataType contains new data
     */
    public static String updateCustomerDataJson(List<CustomerDataTypeDTO> newDynamicDataList,
            String dynamicJsonString) {
        if (CollectionUtils.isEmpty(newDynamicDataList)) {
            return dynamicJsonString;
        }
        newDynamicDataList.removeIf(node -> node == null || StringUtils.isBlank(node.getKey())
                || StringUtils.isBlank(node.getValue()) || ConstantsCustomers.STRING_ARRAY_EMPTY.equals(node.getValue())
                || StringUtils.isBlank(node.getFieldType()));

        // update data
        Map<String, Object> customerData;
        TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
        ObjectMapper objectMapper = new ObjectMapper();
        Gson gson = new Gson();
        try {
            customerData = objectMapper.readValue(dynamicJsonString, typeRef);
        } catch (Exception e) {
            customerData = new HashMap<>();
        }
        for (CustomerDataTypeDTO data : newDynamicDataList) {
            if (StringUtils.isBlank(data.getFieldType())) {
                continue;
            }
            Object nodeValue;
            String fieldType = String.valueOf(data.getFieldType());
            switch (fieldType) {
            case PULLDOWN:
            case RADIO:
                nodeValue = Long.valueOf(data.getValue());
                break;
            case NUMBER:
                nodeValue = Double.valueOf(data.getValue());
                break;
            default:
                nodeValue = data.getValue();
                break;
            }
            if (customerData.containsKey(data.getKey())) {
                customerData.replace(data.getKey(), nodeValue);
            } else {
                customerData.put(data.getKey(), nodeValue);
            }
        }
        return gson.toJson(customerData);
    }

    /**
     * Set value for fields of target if source not null
     *
     * @param source
     *        - object contains input data
     * @param target
     *        - object to save data
     * @param fieldsExcludes
     *        - list field to exclude
     */
    public static <E, T> T mappingDataForObject(E source, T target, List<String> fieldsExcludes, boolean isCheckNull) {
        if (source == null || target == null) {
            return target;
        }
        if (fieldsExcludes == null) {
            fieldsExcludes = new ArrayList<>();
        }
        final List<String> finalFieldsExcludes = fieldsExcludes;
        Arrays.asList(source.getClass().getDeclaredFields()).stream().forEach(field -> {
            if (finalFieldsExcludes.contains(field.getName())) {
                return;
            }
            String methodGet = METHOD_GET_PREFFIX
                    .concat(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL, field.getName()));
            String methodSet = METHOD_SET_PREFFIX
                    .concat(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL, field.getName()));
            try {
                Method inputMethod = source.getClass().getMethod(methodGet);
                Method outMethod = target.getClass().getMethod(methodSet, inputMethod.getReturnType());
                if (!isCheckNull) {
                    outMethod.invoke(target, inputMethod.getReturnType().cast(inputMethod.invoke(source)));
                    return;
                }
                if (inputMethod.invoke(source) != null) {
                    outMethod.invoke(target, inputMethod.getReturnType().cast(inputMethod.invoke(source)));
                }
            } catch (Exception e) {
                return;
            }
        });
        return target;
    }

    /**
     * parse string Json CustomerData to list dynamic data
     * 
     * @param customerDataString - string json
     * @param fielInfoList - list fields
     * @return - list dynamic data
     */
    public static List<CustomerDataTypeDTO> parseJsonCustomerData(String customerDataString,
            List<CustomFieldsInfoOutDTO> fieldInfoList) {
        List<CustomerDataTypeDTO> customerData = new ArrayList<>();

        TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<Map<String, Object>>() {};
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true);
        objectMapper.configure(JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN, true);
        objectMapper.setNodeFactory(JsonNodeFactory.withExactBigDecimals(true));
        Map<String, Object> mapData = null;
        try {
            mapData = objectMapper.readValue(customerDataString, mapTypeRef);
        } catch (Exception e) {
            log.warn("Parse Json Fail, cause by: {}", e.getLocalizedMessage());
            return customerData;
        }
        mapData.entrySet().stream().forEach(entry -> {
            CustomerDataTypeDTO data = new CustomerDataTypeDTO();
            data.setKey(entry.getKey());
            Object value = entry.getValue();
            if (value instanceof Map || value instanceof List) {
                try {
                    data.setValue(objectMapper.writeValueAsString(entry.getValue()));
                } catch (Exception e) {
                    data.setValue(entry.getValue() == null ? "" : String.valueOf(entry.getValue()));
                }
            } else {
                data.setValue(String.valueOf(value));
            }
            if (CollectionUtils.isEmpty(fieldInfoList)) {
                customerData.add(data);
                return;
            }
            fieldInfoList.stream().filter(field -> entry.getKey().equals(field.getFieldName())).findFirst()
                    .ifPresent(field -> data.setFieldType(StringUtil.toString(field.getFieldType())));
            if (!FieldTypeEnum.FILE.getCode().equals(data.getFieldType())) {
                customerData.add(data);
                return;
            }
            try {
                TypeReference<List<Map<String, String>>> listMapTypeRef = new TypeReference<List<Map<String, String>>>() {};
                List<Map<String, String>> listMapValue = objectMapper.readValue(data.getValue(), listMapTypeRef);
                for (Map<String, String> mapValue : listMapValue) {
                    String fileUrl = mapValue.get(ConstantsCustomers.FILE_PATH_ATTR);
                    mapValue.put(ConstantsCustomers.FILE_URL_ATTR,
                            S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(), fileUrl,
                                    applicationProperties.getExpiredSeconds()));
                }
                data.setValue(objectMapper.writeValueAsString(listMapValue));
            } catch (Exception e) {
                customerData.add(data);
                log.warn(e.getLocalizedMessage());
            }
            customerData.add(data);
        });
        return customerData;
    }

    /**
     * Get content change between two object as JSON
     * 
     * @param oldDTO - object 1
     * @param newDTO - other object
     * @return - json generate
     */
    @SuppressWarnings("unchecked")
    public static JSONObject getContentChange(Object oldDTO, Object newDTO) {
        ObjectMapper oMapper = new ObjectMapper();
        Map<String, Object> oldDTOJsonObject = oMapper.convertValue(oldDTO, Map.class);
        Map<String, Object> newDTOJsonObject = oMapper.convertValue(newDTO, Map.class);
        JSONObject result = new JSONObject();
        oldDTOJsonObject.forEach((key, value) -> {
            if (!String.valueOf(oldDTOJsonObject.get(key)).equals(String.valueOf(newDTOJsonObject.get(key)))
                    && !"createdDate".equals(key) && !"updatedDate".equals(key)) {
                try {
                    insertContenChange(result, key, oldDTOJsonObject.get(key), newDTOJsonObject.get(key));
                } catch (Exception e) {
                    log.debug(e.getMessage());
                }
            }
        });
        return result;
    }

    /**
     * Insert data to JSON object
     * 
     * @param result
     * @param key
     * @param oldData
     * @param newData
     */
    private static void insertContenChange(JSONObject result, String key, Object oldData, Object newData) {
        try {
            if (key.equals("customerData") && oldData != null && newData != null) {
                String oldProductData = oldData.toString().replace("\": \"", "\":\"").replace("\", \"", "\",\"");
                String newProductData = newData.toString().replace("\": \"", "\":\"").replace("\", \"", "\",\"");
                if (!oldProductData.equals(newProductData)) {
                    JSONObject jsonObjectData = new JSONObject();
                    jsonObjectData.put("old", oldData);
                    jsonObjectData.put("new", newData);
                    result.put(key, jsonObjectData);
                }
            } else if (oldData != newData) {
                JSONObject jsonObjectSub = new JSONObject();
                jsonObjectSub.put("old", oldData == null ? "null" : oldData);
                jsonObjectSub.put("new", newData == null ? "null" : newData);
                result.put(key, jsonObjectSub);
            }
        } catch (Exception e) {
            log.debug(e.getMessage());
        }
    }

    /**
     * check field type is elastic search search type
     * 
     * @param fType
     * @return
     */
    public static boolean isElasticSearchSearchType(Integer fType) {
        String fieldType = String.valueOf(fType);
        return (FieldTypeEnum.FULLTEXT.getCode().equals(fieldType) || FieldTypeEnum.TEXT.getCode().equals(fieldType)
                || FieldTypeEnum.TEXTAREA.getCode().equals(fieldType) || FieldTypeEnum.FILE.getCode().equals(fieldType)
                || FieldTypeEnum.PHONE.getCode().equals(fieldType) || FieldTypeEnum.EMAIL.getCode().equals(fieldType)
                || FieldTypeEnum.LINK.getCode().equals(fieldType) || FieldTypeEnum.ADDRESS.getCode().equals(fieldType)
                || FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(fieldType)
                || FieldTypeEnum.RELATION.getCode().equals(fieldType));
    }

    /**
     * Detete business card by customer
     * 
     * @param customerId - id customer
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteBusinessCardByCustomers(Long customerId, RestOperationUtils restOperationUtils,
            String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (customerId == null) {
            return listError;
        }

        // get business card by customer
        GetBusinessCardContactsRequest businessCardReq = new GetBusinessCardContactsRequest();
        businessCardReq.setCustomerId(customerId);
        businessCardReq.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        businessCardReq.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);

        GetBusinessCardContactsResponse businessCardRes = null;
        try {
            businessCardRes = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                    ConstantsCustomers.API_GET_BUSINESS_CARD_CONTACTS, HttpMethod.POST, businessCardReq,
                    GetBusinessCardContactsResponse.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }
        if (businessCardRes == null || CollectionUtils.isEmpty(businessCardRes.getContacts())) {
            return listError;
        }
        List<Long> businessIds = businessCardRes.getContacts().stream()
                .map(GetBusinessCardContactsOutDTO::getBusinessCardId).collect(Collectors.toList());

        // delete business by customers
        DeleteBusinessCardsRequest deleteBusinessReq = new DeleteBusinessCardsRequest();
        deleteBusinessReq.setProcessMode(1);

        DeleteBusinessCardsInDTO deleteBusinessIn = new DeleteBusinessCardsInDTO();
        deleteBusinessIn.setCustomerId(customerId);
        deleteBusinessIn.setBusinessCardIds(businessIds);
        deleteBusinessIn.setBusinessCardNames(new ArrayList<>());
        deleteBusinessReq.setBusinessCards(Arrays.asList(deleteBusinessIn));

        try {
            restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS, ConstantsCustomers.API_DELETE_BUSINESS_CARDS,
                    HttpMethod.POST, deleteBusinessReq, DeleteBusinessCardsOutDTO.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }
        return listError;
    }

    /**
     * Detete schedules card by customer
     * 
     * @param customerIds - id customers
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteSchedulesByCustomers(List<Long> customerIds, RestOperationUtils restOperationUtils,
            String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (CollectionUtils.isEmpty(customerIds)) {
            return listError;
        }

        DeleteSchedulesRequest deleteScheduleReq = new DeleteSchedulesRequest();
        deleteScheduleReq.setCustomerIds(customerIds);
        try {
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES, ConstantsCustomers.API_DELETE_SCHEDULES,
                    HttpMethod.POST, deleteScheduleReq, DeleteSchedulesResponse.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }

        return listError;
    }

    /**
     * Detete activities card by customer
     * 
     * @param customerIds - id customers
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteActivitiesByCustomers(List<Long> customerIds,
            RestOperationUtils restOperationUtils, String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (CollectionUtils.isEmpty(customerIds)) {
            return listError;
        }

        DeleteActivityByCustomersRequest deleteActivitiesReq = new DeleteActivityByCustomersRequest();
        deleteActivitiesReq.setCustomerIds(customerIds);
        try {
            restOperationUtils.executeCallApi(PathEnum.ACTIVITIES, ConstantsCustomers.API_DELETE_ACTIVITY_BY_CUSTOMERS,
                    HttpMethod.POST, deleteActivitiesReq, DeleteActivityByCustomersResponse.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }

        return listError;
    }

    /**
     * Detete task card by customer
     * 
     * @param customerIds - id customers
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteTaskByCustomers(List<Long> customerIds, RestOperationUtils restOperationUtils,
            String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (CollectionUtils.isEmpty(customerIds)) {
            return listError;
        }

        DeleteTaskCustomerRelationRequest deleteTaskReq = new DeleteTaskCustomerRelationRequest();
        deleteTaskReq.setCustomerIds(customerIds);

        try {
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES, ConstantsCustomers.API_DELETE_TASK_CUSTOMER_RELATION,
                    HttpMethod.POST, deleteTaskReq, ListTaskIdOutDTO.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }

        return listError;
    }

    /**
     * Detete timeline card by customer
     * 
     * @param customerIds - id customers
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteTimelineByCustomers(List<Long> customerIds, RestOperationUtils restOperationUtils,
            String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (CollectionUtils.isEmpty(customerIds)) {
            return listError;
        }
        DeleteTimelinesForm deleteTimelineReq = new DeleteTimelinesForm();
        deleteTimelineReq.setServiceType(1);// customer
        deleteTimelineReq.setObjectIds(customerIds);

        try {
            restOperationUtils.executeCallApi(PathEnum.TIMELINES, ConstantsCustomers.API_DELETE_TIMELINES,
                    HttpMethod.POST, deleteTimelineReq, ObjectIdsDeletesDTO.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }

        return listError;
    }

    /**
     * Detete product trading card by customer
     * 
     * @param customerIds - id customers
     * @param restOperationUtils - restOperationUtils
     * @param token - token value
     * @param tenantName - tenantName
     * @return list error
     */
    public static List<String> deleteProductTradingsByCustomers(List<Long> customerIds,
            RestOperationUtils restOperationUtils, String token, String tenantName) {
        List<String> listError = new ArrayList<>();
        if (CollectionUtils.isEmpty(customerIds)) {
            return listError;
        }

        DeleteProductTradingByCustomersRequest deleteProductTradingReq = new DeleteProductTradingByCustomersRequest();
        deleteProductTradingReq.setCustomerIds(customerIds);

        try {
            restOperationUtils.executeCallApi(PathEnum.SALES,
                    ConstantsCustomers.API_DELETE_PRODUCT_TRADING_BY_CUSTOMERS, HttpMethod.POST,
                    deleteProductTradingReq, ObjectIdsDeletesDTO.class, token, tenantName);
        } catch (CustomRestException restExeption) {
            listError.addAll(handleError(restExeption));
            return listError;
        }

        return listError;
    }

    /**
     * Handle error to get error code
     * 
     * @param restExeption - exception contains error code
     * @return - list error code
     */
    @SuppressWarnings("unchecked")
    public static List<String> handleError(CustomRestException restExeption) {
        List<String> errorCodes = new ArrayList<>();
        Map<String, Object> mapAttibute = restExeption.getExtensions();
        if (CollectionUtils.isEmpty(mapAttibute) || mapAttibute.get(ERRORS) == null) {
            return errorCodes;
        }
        try {
            List<Object> listErrorRow = (List<Object>) mapAttibute.get(ERRORS);

            for (Object errorRow : listErrorRow) {
                Map<String, Object> mapErrorAttibute = (Map<String, Object>) errorRow;
                errorCodes.add(mapErrorAttibute.get(Constants.ERROR_CODE).toString());
            }
        } catch (Exception e) {
            log.debug("Error occur");
        }
        return errorCodes;
    }

    /**
     * Check if field type is multi value type
     * 
     * @param fieldType
     * @return result check
     */
    public static boolean isMultiValueType(Integer fieldType) {
        String stringFType = fieldType.toString();
        return FieldTypeEnum.RADIO.getCode().equals(stringFType) || FieldTypeEnum.PULLDOWN.getCode().equals(stringFType)
                || FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(stringFType)
                || FieldTypeEnum.CHECKBOX.getCode().equals(stringFType);
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
        activitiesRequest.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        activitiesRequest.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        activitiesRequest.setOrderBy(new ArrayList<>());
        activitiesRequest.setOffset(ConstantsCustomers.NUMBER_ZERO);
        activitiesRequest.setLimit(ConstantsCustomers.DEFAULT_INTEGER_LIMIT_VALUE);
        activitiesRequest.setHasTimeline(false);
        activitiesRequest.setIsUpdateListView(false);

        activitiesRequest.setSearchConditions(listConditions);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.ACTIVITIES,
                ConstantsCustomers.API_GET_IDS_OF_GET_ACTIVITIES, HttpMethod.POST, activitiesRequest,
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
        businessCardsRequest.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        businessCardsRequest.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        businessCardsRequest.setSearchConditions(listConditions);
        businessCardsRequest.setOrderBy(new ArrayList<>());
        businessCardsRequest.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        businessCardsRequest.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);
        businessCardsRequest.setSearchLocal("");
        businessCardsRequest.setFilterConditions(new ArrayList<>());
        businessCardsRequest.setIsFirstLoad(false);


        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                ConstantsCustomers.API_GET_IDS_OF_GET_BUSINESS_CARDS, HttpMethod.POST, businessCardsRequest,
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
        customersRequest.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        customersRequest.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        customersRequest.setOrderBy(new ArrayList<>());
        customersRequest.setOffset(ConstantsCustomers.NUMBER_ZERO);
        customersRequest.setLimit(ConstantsCustomers.DEFAULT_INTEGER_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.CUSTOMERS,
                ConstantsCustomers.API_GET_IDS_OF_GET_CUSTOMERS, HttpMethod.POST, customersRequest,
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
        employeesRequest.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        employeesRequest.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        employeesRequest.setOrderBy(new ArrayList<>());
        employeesRequest.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        employeesRequest.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_IDS_OF_GET_EMPLOYEES, HttpMethod.POST, employeesRequest,
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
        productsRequest.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        productsRequest.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.PRODUCTS,
                ConstantsCustomers.API_GET_IDS_OF_GET_PRODUCTS, HttpMethod.POST, productsRequest,
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
        tasksRequest.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        tasksRequest.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);
        tasksRequest.setFilterByUserLoginFlg(0);

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                ConstantsCustomers.API_GET_IDS_OF_GET_TASKS, HttpMethod.POST, tasksRequest,
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
        productTradingsRequest.setOffset(ConstantsCustomers.NUMBER_ZERO);
        productTradingsRequest.setLimit(ConstantsCustomers.DEFAULT_INTEGER_LIMIT_VALUE);
        productTradingsRequest.setOrders(new ArrayList<>());
        productTradingsRequest.setSearchConditions(listConditions);
        productTradingsRequest.setProductIdFilters(new ArrayList<>());

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = TenantContextHolder.getTenant();

        // call API
        GetIdsBySearchConditionsOut apiResposne = restOperationUtils.executeCallApi(PathEnum.SALES,
                ConstantsCustomers.API_GET_IDS_OF_GET_PRODUCTS_TRADINGS, HttpMethod.POST, productTradingsRequest,
                GetIdsBySearchConditionsOut.class, token, tenantName);

        if (apiResposne == null || CollectionUtils.isEmpty(apiResposne.getListIds())) {
            return new ArrayList<>();
        }
        return apiResposne.getListIds();
    }

    /**
     * Get ids from es response
     * 
     * @param employeeGroupIdField
     *            employeeGroupIdField
     * @param dataElasticSearchResponse
     *            data response
     * @return group ids
     */
    public static List<Long> getGroupIdsFromESResponse(SelectDetailElasticSearchResponse dataElasticSearchResponse) {

        List<String> listGroupIdString = new ArrayList<>();

        List<Long> groupIds = new ArrayList<>();
        if (dataElasticSearchResponse != null && !dataElasticSearchResponse.getDataElasticSearch().isEmpty()) {
            dataElasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                if (item.getKey().equals(ConstantsCustomers.EMPLOYEE_GROUP_ID_FIELD)
                        && StringUtils.isNotBlank(item.getValue())) {
                    listGroupIdString.add(item.getValue());
                }
            }));
        }
        listGroupIdString.removeIf(StringUtils::isBlank);
        if (!listGroupIdString.isEmpty()) {
            String strGroupIds = String.join(ConstantsCustomers.COMMA_SYMBOY, listGroupIdString);
            groupIds = Arrays.asList(strGroupIds.split(ConstantsCustomers.COMMA_SYMBOY))
                    .stream()
                    .map(id -> Long.valueOf(id.trim())).collect(Collectors.toList());
        }

        return groupIds;
    }

}
