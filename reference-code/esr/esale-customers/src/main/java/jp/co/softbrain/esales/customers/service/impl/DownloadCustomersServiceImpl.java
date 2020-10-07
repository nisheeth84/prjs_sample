package jp.co.softbrain.esales.customers.service.impl;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.CaseFormat;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.ExtensionBelong;
import jp.co.softbrain.esales.config.Constants.FileExtension;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.repository.EmployeesRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.DownLoadCustomersService;
import jp.co.softbrain.esales.customers.service.dto.CustomerDataTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsInfoCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.PersonsInChargeDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetRelationDataOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetRelationDataRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetRelationDataSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeNameDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentsOutSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupsRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupsSubType1DTO;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DownloadCustomersRequest;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * Implement {@link DownLoadCustomersService}
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DownloadCustomersServiceImpl implements DownLoadCustomersService {
    private final Logger log = LoggerFactory.getLogger(DownloadCustomersServiceImpl.class);

    private static final String METHOD_GET_PREFFIX = "get";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersService customersService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private CustomersCommonService customersCommonService;

    @Autowired
    private EmployeesRepository employeesRepository;

    private Gson gson = new Gson();

    /**
     * @see jp.co.softbrain.esales.customers.service.DownLoadCustomersService#downloadCustomers(jp.co.softbrain.esales.customers.web.rest.vm.request.DownloadCustomersRequest)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public String downloadCustomers(DownloadCustomersRequest request) {
        // 1. validate parameter
        validateDownloadCustomers(request.getCustomerIds());

        // get session ifo
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();

        // 2 get user's field information
        FieldInfoPersonalsInputDTO infoPersonalRequest = new FieldInfoPersonalsInputDTO();
        infoPersonalRequest.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        infoPersonalRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        infoPersonalRequest.setExtensionBelong(ExtensionBelong.SHOW_IN_LIST.getValue());
        infoPersonalRequest.setSelectedTargetType(request.getSelectedTargetType());
        infoPersonalRequest.setSelectedTargetId(request.getSelectedTargetId());

        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_FIELDS_INFO_PERSONALS, HttpMethod.POST, infoPersonalRequest,
                CommonFieldInfoResponse.class, token, tenantName);
        if (fieldInfoResponse == null || CollectionUtils.isEmpty(fieldInfoResponse.getFieldInfoPersonals())) {
            return null;
        }
        final List<FieldInfoPersonalsOutDTO> fieldsInfoList = fieldInfoResponse.getFieldInfoPersonals().stream()
                .sorted(Comparator.comparingInt(FieldInfoPersonalsOutDTO::getFieldOrder)).collect(Collectors.toList());

        // 3. get data
        List<GetCustomersByIdsInfoCustomerDTO> listDataCustomers = customersService
                .getCustomersByIds(request.getCustomerIds()).stream()
                .sorted(Comparator.comparing(cus -> request.getCustomerIds().indexOf(cus.getCustomerId())))
                .collect(Collectors.toList());

        // save data
        List<String> responseCSV = new ArrayList<>();
        List<String> headerCSV = new ArrayList<>();
        List<String> bodyCSV = new ArrayList<>();

        Map<Integer, List<Long>> fieldBelongMap = new HashMap<>();
        Map<Integer, List<Long>> customerRelationIdsMap = new HashMap<>();

        // Create CSV header
        fieldsInfoList.stream().filter(f -> !ConstantsCustomers.COLUMN_NAME_BUSINESS_SUB_ID.equals(f.getFieldName()))
                .forEach(fieldInfo -> {
                    getRelationIdsByFieldAndCustomerData(fieldInfo, listDataCustomers, customerRelationIdsMap);

                    Integer fieldBelong = fieldInfo.getFieldBelong();
                    if (!fieldBelongMap.containsKey(fieldBelong)) {
                        fieldBelongMap.put(fieldBelong, new ArrayList<>());
                    }
                    fieldBelongMap.get(fieldBelong).add(fieldInfo.getFieldId());

                    TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<Map<String, Object>>() {};
                    Map<String, Object> fieldLabel;
                    try {
                        fieldLabel = objectMapper.readValue(fieldInfo.getFieldLabel(), mapTypeRef);
                        headerCSV.add(fieldLabel.get(languageCode).toString());
                    } catch (Exception ex) {
                        headerCSV.add(ConstantsCustomers.EMPTY_STRING);
                    }
                });
        responseCSV.add(String.join(ConstantsCustomers.COMMA_SYMBOY, headerCSV));

        // get relation data
        final Map<Integer, GetRelationDataOutDTO> responseRelationMap = getRelationDataOutMap(fieldBelongMap,
                customerRelationIdsMap);

        // create CSV body data
        listDataCustomers.stream().forEach(customer -> {
            bodyCSV.clear();
            fieldsInfoList.stream()
                    .filter(f -> !ConstantsCustomers.COLUMN_NAME_BUSINESS_SUB_ID.equals(f.getFieldName()))
                    .forEach(field -> {
                        String data;
                        data = createDataCustomerByField(customer, field, responseRelationMap);
                        data = (data.startsWith(ConstantsCustomers.OPEN_SQUARE_BRACKET)
                                && data.endsWith(ConstantsCustomers.CLOSE_SQUARE_BRACKET))
                                        ? data.substring(1, data.length() - 1)
                                        : data;
                        bodyCSV.add(ConstantsCustomers.ENCLOSURE
                                + data.replace(ConstantsCustomers.ENCLOSURE,
                                        ConstantsCustomers.ENCLOSURE + ConstantsCustomers.ENCLOSURE)
                                + ConstantsCustomers.ENCLOSURE);
                    });
            responseCSV.add(String.join(ConstantsCustomers.COMMA_SYMBOY, bodyCSV));
        });

        // call common service - copyFileToS3
        return customersCommonService.copyFileToS3(ConstantsCustomers.FILE_NAME_DOWNLOAD_CUSTOMERS, FileExtension.CSV,
                String.join(ConstantsCustomers.NEW_LINE_CHAR, responseCSV));
    }

    /**
     * Create column data for CSV string each row by field
     * 
     * @param customer
     * @param field
     * @param responseRelationMap
     * @param userId
     * @return
     */
    private String createDataCustomerByField(GetCustomersByIdsInfoCustomerDTO customer, FieldInfoPersonalsOutDTO field,
            Map<Integer, GetRelationDataOutDTO> responseRelationMap) {
        String fieldName = field.getFieldName();

        String jsonData = customer.getCustomerData().stream().filter(kv -> kv.getKey().equals(fieldName)).findAny()
                .map(CustomerDataTypeDTO::getValue).orElse("");
        // check if field is extension field
        if (isExtensionField(fieldName)) {
            return getDataFromExtensionField(jsonData, field, responseRelationMap);
        }
        String data = "";
        switch (fieldName) {
        case ConstantsCustomers.COLUMN_ACTION_NEXT:
            if (CollectionUtils.isEmpty(customer.getNextActions())) {
                data = ConstantsCustomers.EMPTY_STRING;
                break;
            }
            data = customer.getNextActions().get(0).getTaskName();
            break;
        case ConstantsCustomers.COLUMN_SCHEDULE_NEXT:
            if (CollectionUtils.isEmpty(customer.getNextSchedules())) {
                data = ConstantsCustomers.EMPTY_STRING;
                break;
            }
            data = customer.getNextSchedules().get(0).getSchedulesName();
            break;
        case ConstantsCustomers.FIELD_BUSINESS_MAIN_ID:
            data = StringUtil.getFullName(customer.getBusinessMainName(), customer.getBusinessSubName());
            break;
        case ConstantsCustomers.COLUMN_CREATED_DATE:
            data = String.valueOf(customer.getCreatedDate());
            break;
        case ConstantsCustomers.COLUMN_UPDATED_DATE:
            data = String.valueOf(customer.getUpdatedDate());
            break;
        case ConstantsCustomers.COLUMN_CREATED_USER:
            data = customer.getCreatedUserName();
            break;
        case ConstantsCustomers.COLUMN_UPDATED_USER:
            data = customer.getUpdatedUserName();
            break;
        case ConstantsCustomers.COLUMN_CUSTOMER_ADDRESS:
            data = StringUtil.getFullName(customer.getZipCode(), customer.getAddress());
            data = StringUtil.getFullName(data, customer.getBuilding());
            break;
        case ConstantsCustomers.COLUMN_CUSTOMER_ALIAS_NAME:
            data = customer.getCustomerAliasName();
            break;
        case ConstantsCustomers.COLUMN_CUSTOMER_LOGO:
            data = customer.getCustomerLogo().getPhotoFileName();
            break;
        case ConstantsCustomers.COLUMN_CUSTOMER_PARENT:
            if (CollectionUtils.isEmpty(customer.getPathTreeName()) || customer.getPathTreeName().size() == 1) {
                data = ConstantsCustomers.EMPTY_STRING;
                break;
            }
            data = customer.getPathTreeName().get(1);
            break;
        case ConstantsCustomers.COLUMN_PERSON_IN_CHARGE:
            data = getPersonInchargeName(customer.getPersonInCharge());
            break;
        case ConstantsCustomers.FIELD_BUSINESS_SUB_ID:
            break;
        default:
            data = getDataByFieldDefault(customer, field);
            break;
        }
        return data == null ? ConstantsCustomers.EMPTY_STRING : data;
    }

    /**
     * get data by default field
     * 
     * @param field
     * @param customer
     * @return data
     */
    private String getDataByFieldDefault(GetCustomersByIdsInfoCustomerDTO customer, FieldInfoPersonalsOutDTO field) {
        String methodName = METHOD_GET_PREFFIX
                .concat(CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, field.getFieldName()));
        try {
            Method method = GetCustomersByIdsInfoCustomerDTO.class.getMethod(methodName);
            Object object = method.invoke(customer);
            if (object instanceof List<?>) {
                return (((List<?>) object).isEmpty()) ? ConstantsCustomers.EMPTY_STRING
                        : objectMapper.writeValueAsString(object);
            }
            return method.invoke(customer).toString();
        } catch (Exception e) {
            return ConstantsCustomers.EMPTY_STRING;
        }
    }

    /**
     * @param personInCharge
     * @return
     */
    private String getPersonInchargeName(PersonsInChargeDTO personInCharge) {
        if (personInCharge == null) {
            return ConstantsCustomers.EMPTY_STRING;
        }
        if (personInCharge.getEmployeeId() != null && personInCharge.getEmployeeId() > 0) {
            return personInCharge.getEmployeeName();
        }
        if (personInCharge.getEmployeeId() != null && personInCharge.getEmployeeId() > 0) {
            return personInCharge.getEmployeeName();
        }
        return personInCharge.getEmployeeName();
    }

    /**
     * @param jsonData
     * @param field
     * @param responseRelationMap
     * @return
     */
    private String getDataFromExtensionField(String jsonData, FieldInfoPersonalsOutDTO field,
            Map<Integer, GetRelationDataOutDTO> responseRelationMap) {
        int fieldType = field.getFieldType();
        switch (fieldType) {
        case ConstantsCustomers.FIELD_TYPE_ENUM_CALCULATION:
            if (StringUtils.isBlank(jsonData)) {
                return String.valueOf(ConstantsCustomers.NUMBER_ZERO);
            }
            return jsonData;
        case ConstantsCustomers.FIELD_TYPE_ENUM_SELECT_ORGANIZATION:
            if (jsonData == null || jsonData.length() <= 2) {
                return ConstantsCustomers.EMPTY_STRING;
            }
            return getSelectOrganization(jsonData);
        case ConstantsCustomers.FIELD_TYPE_ENUM_RELATION:
            return getRelationDataDownloadCSV(jsonData, responseRelationMap.get(field.getFieldBelong()),
                    field.getFieldId());
        default:
            return jsonData == null ? ConstantsCustomers.EMPTY_STRING : jsonData;
        }
    }

    /**
     * Get Relation data
     * 
     * @param jsonData
     * @param getRelationDataOutDTO
     * @param fieldId
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getRelationDataDownloadCSV(Object jsonData, GetRelationDataOutDTO getRelationDataOutDTO,
            Long fieldId) {
        String response = ConstantsCustomers.EMPTY_STRING;
        if (getRelationDataOutDTO == null || jsonData == null) {
            return response;
        }
        List<Long> relationIds = ((List<Long>) jsonData);
        List<String> dataRelationStringList = new ArrayList<>();
        List<GetRelationDataSubType1DTO> relationData = getRelationDataOutDTO.getRelationData();
        relationData.forEach(data -> {
            if (relationIds.contains(data.getRecordId())) {
                data.getDataInfos().forEach(dataInfo -> {
                    if (dataInfo.getFieldId().equals(fieldId)) {
                        dataRelationStringList.add(dataInfo.getValue());
                    }
                });
            }
        });
        if (!CollectionUtils.isEmpty(dataRelationStringList)) {
            response = dataRelationStringList.toString();
        }
        return response;
    }

    /**
     * @param jsonData
     * @return
     */
    private String getSelectOrganization(String jsonData) {
        List<Long> employeeIds = new ArrayList<>();
        List<Long> departmentIds = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();

        List<Map<String, Long>> listMapOrganization = null;
        TypeReference<List<Map<String, Long>>> typeRef = new TypeReference<List<Map<String, Long>>>() {};
        try {
            listMapOrganization = objectMapper.readValue(jsonData, typeRef);
        } catch (Exception e) {
            return ConstantsCustomers.STRING_ARRAY_EMPTY;
        }
        for (Map<String, Long> map : listMapOrganization) {
            employeeIds.add(map.get("employee_id"));
            departmentIds.add(map.get("department_id"));
            groupIds.add(map.get("group_id"));
        }

        employeeIds.removeIf(id -> id == null || id == 0L);
        departmentIds.removeIf(id -> id == null || id == 0L);
        groupIds.removeIf(id -> id == null || id == 0L);

        List<KeyValue> keyValueList = new ArrayList<>();
        // get list employees
        if (!employeeIds.isEmpty()) {
            List<String> listEmployees = employeesRepository.getEmployeeNameByEmployeeIds(employeeIds).stream()
                    .map(EmployeeNameDTO::getEmployeeName).collect(Collectors.toList());
            KeyValue empKV = new KeyValue();
            empKV.setKey("employees");
            empKV.setValue(listEmployees.toString());
            keyValueList.add(empKV);
        }

        // get list department
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        if (!departmentIds.isEmpty()) {
            GetDepartmentRequest departmentsRequest = new GetDepartmentRequest();
            departmentsRequest.setDepartmentIds(departmentIds);
            departmentsRequest.setGetEmployeesFlg(false);
            KeyValue depKV = new KeyValue();
            depKV.setKey("departments");
            try {
                GetDepartmentsOutDTO departmentsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                        ConstantsCustomers.API_GET_DEPARTMENTS, HttpMethod.POST, departmentsRequest,
                        GetDepartmentsOutDTO.class, token, tenantName);
                depKV.setValue(departmentsResponse.getDepartments().stream()
                        .map(GetDepartmentsOutSubType1DTO::getDepartmentName).collect(Collectors.toList()).toString());
            } catch (Exception e) {
                depKV.setValue(ConstantsCustomers.STRING_ARRAY_EMPTY);
            }
            keyValueList.add(depKV);
        }

        if (!groupIds.isEmpty()) {
            GetGroupsRequest groupsRequest = new GetGroupsRequest();
            groupsRequest.setGroupIds(groupIds);
            groupsRequest.setGetEmployeesFlg(false);
            KeyValue groupKV = new KeyValue();
            groupKV.setKey("groups");
            try {
                GetGroupsOutDTO groupsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                        ConstantsCustomers.API_GET_GROUPS, HttpMethod.POST, groupsRequest, GetGroupsOutDTO.class, token,
                        tenantName);
                groupKV.setValue(groupsResponse.getGroups().stream().map(GetGroupsSubType1DTO::getGroupName)
                        .collect(Collectors.toList()).toString());
            } catch (Exception e) {
                groupKV.setValue(ConstantsCustomers.STRING_ARRAY_EMPTY);
            }
            keyValueList.add(groupKV);
        }
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        return gson.toJson(jsonBuilder.convertKeyValueList(keyValueList));
    }

    /**
     * Get map relation data by response
     *
     * @param fieldBelongMap fieldBelongMap
     * @param empRelationIdsMap empRelationIdsMap
     * @return map relation
     */
    private Map<Integer, GetRelationDataOutDTO> getRelationDataOutMap(Map<Integer, List<Long>> fieldBelongMap,
            Map<Integer, List<Long>> empRelationIdsMap) {
        Map<Integer, GetRelationDataOutDTO> relationMap = new HashMap<>();
        String token = SecurityUtils.getTokenValue().orElse(null);
        fieldBelongMap.forEach((k, v) -> {
            // Call api getRelationData
            GetRelationDataRequest relationRequest = new GetRelationDataRequest();
            relationRequest.setFieldBelong(k);
            relationRequest.setFieldIds(v);
            relationRequest.setListIds(empRelationIdsMap.get(k));
            try {
                GetRelationDataOutDTO responseRelation = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                        "get-relation-data", HttpMethod.POST, relationRequest, GetRelationDataOutDTO.class, token,
                        jwtTokenUtil.getTenantIdFromToken());
                relationMap.put(k, responseRelation);
            } catch (Exception e) {
                log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, "get-relation-data",
                        e.getLocalizedMessage()));
            }
        });
        return relationMap;
    }

    /**
     * getRelationIdsByFieldAndEmpData
     * 
     * @param fieldInfo
     * @param listDataCustomers
     * @param customerRelationIdsMap
     */
    @SuppressWarnings("unchecked")
    private Map<Integer, List<Long>> getRelationIdsByFieldAndCustomerData(FieldInfoPersonalsOutDTO fieldInfo,
            List<GetCustomersByIdsInfoCustomerDTO> listDataCustomers, Map<Integer, List<Long>> customerRelationIdsMap) {
        Integer fieldBelong = fieldInfo.getFieldBelong();
        String fieldName = fieldInfo.getFieldName();
        List<Long> empRelationIds = new ArrayList<>();
        listDataCustomers.forEach(customer -> {
            if (isExtensionField(fieldName) && StringUtils.isNotBlank(customer.getCustomerDataString())) {
                TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<Map<String, Object>>() {};
                Map<String, Object> employeeData;
                try {
                    employeeData = objectMapper.readValue(customer.getCustomerDataString(), mapTypeRef);
                } catch (IOException e) {
                    throw new CustomException(ConstantsCustomers.PARSE_JSON_FAIL, e);
                }
                Entry<String, Object> jsonData = employeeData.entrySet().stream()
                        .filter(entry -> entry.getKey().equals(fieldName)).findFirst().orElse(null);
                if (jsonData != null
                        && Integer.valueOf(FieldTypeEnum.RELATION.getCode()).equals(fieldInfo.getFieldType())) {
                    empRelationIds.addAll(((List<Long>) jsonData.getValue()));
                }
            }
        });
        if (customerRelationIdsMap.get(fieldBelong) != null) {
            customerRelationIdsMap.get(fieldBelong).add(fieldInfo.getFieldId());
        } else {
            customerRelationIdsMap.put(fieldBelong, empRelationIds);
        }
        return customerRelationIdsMap;

    }

    /**
     * Check if String sequence contains at least a number
     *
     * @param sequence - string to check
     * @return boolean
     */
    private boolean isExtensionField(String sequence) {
        Pattern pattern = Pattern.compile(ConstantsCustomers.IS_NUMBER_PATTERN);
        return pattern.matcher(sequence).find();
    }

    /**
     * Validate parameter for API downloadCustomers
     *
     * @param customerIds - parameter of API
     */
    private void validateDownloadCustomers(List<Long> customerIds) {
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // Common validate
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        customerIds.forEach(id -> fixedParams.put(ConstantsCustomers.CUSTOMER_ID + customerIds.indexOf(id), id));
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        List<Map<String, Object>> errors = new ArrayList<>();
        errors.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken()));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

    }

}
