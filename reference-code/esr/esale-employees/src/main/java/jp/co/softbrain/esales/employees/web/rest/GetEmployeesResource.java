package jp.co.softbrain.esales.employees.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.Query;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.FieldInfo;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeeElasticsearchInDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.UpdateListViewSettingRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.dto.schedule.FilterWorkingDaysInDTO;
import jp.co.softbrain.esales.employees.service.dto.schedule.FilterWorkingDaysOutDTO;
import jp.co.softbrain.esales.employees.service.mapper.CommonsInfoMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeesRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeResponse;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.GetIdsBySearchConditionsOut;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * EmployeesQuery class process GraphQL query for get employees
 *
 * @see com.coxautodev.graphql.tools.GraphQLQueryResolver
 */
@RestController
@RequestMapping("/api")
public class GetEmployeesResource {
    private final Logger log = LoggerFactory.getLogger(GetEmployeesResource.class);

    private static final String OFFSET_FIELD = "offset";
    private static final String LIMIT_FIELD = "limit";

    private static final String PREFIX_KEYWORD = ".keyword";
    private static final String VALIDATE_MEHOTD = "validate";

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private EmployeesGroupsService emGroupsService;

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * get employee list
     * 
     * @param searchConditions
     * @param filterConditions
     * @param localSearchKeyword
     * @param selectedTargetType
     * @param selectedTargetId
     * @param isUpdateListView
     * @param orderBy
     * @param offset
     * @param limit
     * @return
     */
    @PostMapping(path = "/get-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeResponse> getEmployees(@RequestBody GetEmployeesRequest requestAPI) {
        // prepare parameter for API
        refactorParameter(requestAPI);

        // 1. Validate prameter
        validateParameterGetEmployees(requestAPI);

        List<SearchItem> searchConditions = requestAPI.getSearchConditions();
        List<SearchItem> filterConditions = requestAPI.getFilterConditions();
        String localSearchKeyword = requestAPI.getLocalSearchKeyword();
        Integer selectedTargetType = requestAPI.getSelectedTargetType();
        Long selectedTargetId = requestAPI.getSelectedTargetId();
        Boolean isUpdateListView = requestAPI.getIsUpdateListView();
        List<OrderValue> orderBy = requestAPI.getOrderBy();
        Long offset = requestAPI.getOffset();
        Long limit = requestAPI.getLimit();

        log.debug("Get employees by searchConditions '{}'", searchConditions);
        log.debug("Get employees by filterConditions '{}'", filterConditions);

        // 3. Call API updateListViewSetting
        if (Boolean.TRUE.equals(isUpdateListView)) {
            callAPIUpdateListViewSetting(filterConditions, orderBy, selectedTargetType, selectedTargetId);
        }

        GetEmployeeResponse responseAPI = new GetEmployeeResponse();

        // update param list search/filter condition
        updateParamListCondition(searchConditions);
        updateParamListCondition(filterConditions);

        SearchConditionsDTO searchConditionsDTO = new SearchConditionsDTO();
        searchConditionsDTO.setOffset(offset);
        searchConditionsDTO.setLimit(limit);

        // 4. Call API getDataElasticSearch
        // get data search from elastic search
        getDataSearchFromElasticSearch(searchConditions, filterConditions, localSearchKeyword, searchConditionsDTO);

        List<KeyValue> filterTypes = new ArrayList<>();
        KeyValue filterType = getFilerTypeForSearch(selectedTargetType, selectedTargetId, responseAPI);
        filterTypes.add(filterType);
        searchConditionsDTO.setFilterType(filterTypes);

        // build orderBy
        List<KeyValue> keyValues = new ArrayList<>();
        if (orderBy != null) {
            orderBy.forEach(order -> {
                KeyValue keyValue = new KeyValue();
                keyValue.setKey(order.getKey());
                keyValue.setValue(order.getValue());
                keyValues.add(keyValue);
            });
        }

        searchConditionsDTO.setOrderBy(keyValues);

        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();

        List<CalculatorFormularDTO> calculatorFormular = employeesCommonService
                .getCalculatorFormular(FieldBelongEnum.EMPLOYEE.getCode());
        searchConditionsDTO.setCalculatorFormular(calculatorFormular);

        Map<String, String> formularMap = getFomularMap(searchConditionsDTO.getCalculatorFormular());
        searchConditionsDTO.setOptionMap(getOptionMap(searchConditionsDTO, languageCode, formularMap));

        Long total = employeesService.getTotalEmployees(searchConditionsDTO, languageCode);
        responseAPI.setTotalRecords(total);

        if (total > 0) {
            responseAPI.setEmployees(employeesService.getEmployees(searchConditionsDTO, false, languageCode));
        }

        // 5. Get department choice from local navigation
        if (ConstantsEmployees.SELECT_TARGET_TYPE.DEPARTMENT.getCode().equals(selectedTargetType)
                && selectedTargetId != null && selectedTargetId > 0) {
            DepartmentManagerDTO department = employeesCommonService.getDepartment(selectedTargetId);
            responseAPI.setDepartment(department);
        }

        return ResponseEntity.ok(responseAPI);
    }

    /**
     * @param selectedTargetType
     * @param selectedTargetId
     * @param responseAPI
     * @return
     */
    private KeyValue getFilerTypeForSearch(Integer selectedTargetType, Long selectedTargetId,
            GetEmployeeResponse responseAPI) {
        KeyValue filterType = new KeyValue();
        // the employee has quit his job
        if (ConstantsEmployees.SELECT_TARGET_TYPE.QUIT_JOB.getCode().equals(selectedTargetType)) {
            filterType.setKey(ConstantsEmployees.EMPLOYEE_STATUS_FIELD);
            filterType.setValue(String.valueOf(ConstantsEmployees.SELECT_TARGET_TYPE.QUIT_JOB.getCode()));
        }
        // select the department
        else if (selectedTargetId != null
                && ConstantsEmployees.SELECT_TARGET_TYPE.DEPARTMENT.getCode().equals(selectedTargetType)) {
            filterType.setKey(ConstantsEmployees.DEPARTMENT_ID_FIELD);
            filterType.setValue(String.valueOf(selectedTargetId));
        }
        // select the group or group shared
        else if (selectedTargetId != null
                && ConstantsEmployees.SELECT_TARGET_TYPE.GROUP.getCode().equals(selectedTargetType)
                || ConstantsEmployees.SELECT_TARGET_TYPE.GROUP_SHARED.getCode().equals(selectedTargetType)) {
            // 6. Get lastUpdatedDate
            responseAPI.setLastUpdatedDate(emGroupsService.getLastUpdatedDateByGroupId(selectedTargetId));
            filterType.setKey(ConstantsEmployees.GROUP_ID_FIELD);
            filterType.setValue(String.valueOf(selectedTargetId));
        }
        return filterType;
    }

    /**
     * @param requestAPI
     * @param searchConditionsDTO
     */
    private void getDataSearchFromElasticSearch(List<SearchItem> searchConditions, List<SearchItem> filterConditions,
            String localSearchKeyWord, SearchConditionsDTO searchConditionsDTO) {
        if (searchConditions == null) {
            searchConditions = new ArrayList<>();
        }
        if (filterConditions == null) {
            filterConditions = new ArrayList<>();
        }
        // request for elastic search
        SelectEmployeeElasticsearchInDTO elasticSearchRequest = new SelectEmployeeElasticsearchInDTO();
        elasticSearchRequest.setSearchConditions(searchConditions);
        elasticSearchRequest.setFilterConditions(filterConditions);
        elasticSearchRequest.setLocalSearchKeyword(localSearchKeyWord);
        elasticSearchRequest.setColumnId(ConstantsEmployees.EMPLOYEE_ID);

        SelectDetailElasticSearchResponse selectDetailElasticSearchResponse = null;
        try {
            selectDetailElasticSearchResponse = employeesCommonService.getEmployeesElasticsearch(elasticSearchRequest);
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED,
                            ConstantsEmployees.API_GET_DETAIL_ELASTIC_SEARCH, e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.API_GET_DETAIL_ELASTIC_SEARCH,
                            Constants.CONNECT_FAILED_CODE));
        }
        if (selectDetailElasticSearchResponse == null
                || CollectionUtils.isEmpty(selectDetailElasticSearchResponse.getDataElasticSearch())) {
            searchConditionsDTO.setElasticResultIds(new ArrayList<>());
            return;
        }

        // get list ID from elastic search
        List<Long> employeeIds = new ArrayList<>();
        selectDetailElasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
            if (item.getKey().equals(ConstantsEmployees.EMPLOYEE_ID)) {
                employeeIds.add(Double.valueOf(item.getValue()).longValue());
            }
        }));
        searchConditionsDTO.setElasticResultIds(employeeIds);

        // calculate working day
        try {
            // Calculated by the number of working days in list conditions
            calculatedWorkingDays(filterConditions);
            calculatedWorkingDays(searchConditions);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        List<SearchItem> newSearchConditions = searchConditions.stream()
                .filter(condition -> !isSearchedCondition(condition)).collect(Collectors.toList());
        // get departmentId, groupId
        newSearchConditions.addAll(selectDetailElasticSearchResponse.getOrganizationSearchConditions());
        newSearchConditions.addAll(selectDetailElasticSearchResponse.getRelationSearchConditions());
        searchConditionsDTO.setSearchConditions(newSearchConditions);

        List<SearchItem> newFilterConditions = filterConditions.stream()
                .filter(condition -> !isSearchedCondition(condition)).collect(Collectors.toList());
        // get departmentId, groupId
        newFilterConditions.addAll(selectDetailElasticSearchResponse.getOrganizationFilterConditions());
        newFilterConditions.addAll(selectDetailElasticSearchResponse.getRelationFilterConditions());
        searchConditionsDTO.setFilterConditions(newFilterConditions);

        // search null select organization
        for (SearchItem searchItem : searchConditions) {
            if (!FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(String.valueOf(searchItem.getFieldType()))) {
                continue;
            }
            if (StringUtils.isBlank(searchItem.getFieldValue())) {
                searchConditionsDTO.getSearchConditions().add(searchItem);
            } else if (selectDetailElasticSearchResponse.getOrganizationSearchConditions().isEmpty()
                    && selectDetailElasticSearchResponse.getOrganizationFilterConditions().isEmpty()) {
                searchConditionsDTO.setElasticResultIds(new ArrayList<Long>());
            }
        }
        // search null select organization
        for (SearchItem searchItem : filterConditions) {
            if (!FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(String.valueOf(searchItem.getFieldType()))) {
                continue;
            }
            if (StringUtils.isBlank(searchItem.getFieldValue())) {
                searchConditionsDTO.getFilterConditions().add(searchItem);
            } else if (selectDetailElasticSearchResponse.getOrganizationSearchConditions().isEmpty()
                    && selectDetailElasticSearchResponse.getOrganizationFilterConditions().isEmpty()) {
                searchConditionsDTO.setElasticResultIds(new ArrayList<Long>());
            }
        }
    }

    /**
     * updateParamListCondition
     * 
     * @param searchConditions
     */
    private void updateParamListCondition(List<SearchItem> listConditions) {
        if(listConditions == null || listConditions.isEmpty()) {
            return;
        }
        listConditions.removeIf(item -> item.getFieldType() == null || StringUtils.isBlank(item.getFieldName()));

        listConditions.forEach(item -> {
            updateForeachConditionItem(item);

            if (CommonUtils.isRangeType(item.getFieldType()) && StringUtils.isNotBlank(item.getFieldValue())
                    && !ConstantsEmployees.STRING_ARRAY_EMPTY.equals(item.getFieldValue())) {
                buildValueForRangeField(item);
            }
            if (CommonUtils.isTextType(item.getFieldType())
                    && !ConstantsEmployees.TRUE_VALUE.equalsIgnoreCase(item.getIsDefault())) {
                item.setFieldName(item.getFieldName().replace(ConstantsEmployees.DOT_KEYWORD, ""));
            }
        });
    }

    /**
     * buildValueForRangeField
     * 
     * @param item - item with field type range
     */
    private void buildValueForRangeField(SearchItem item) {
        Map<String, Object> dateMap = null;
        try {
            TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {};
            dateMap = objectMapper.readValue(item.getFieldValue(), mapTypeRef);
            item.setFieldValue(objectMapper.writeValueAsString(dateMap));
        } catch (IOException e) {
            LoggerFactory.getLogger(CommonsInfoMapper.class).warn(e.getLocalizedMessage());
        }
        if (dateMap == null) {
            try {
                TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {};
                List<Map<String, Object>> dateList = objectMapper.readValue(item.getFieldValue(), listTypeRef);
                if (dateList != null) {
                    dateMap = dateList.get(0);
                }
                item.setFieldValue(objectMapper.writeValueAsString(dateMap));
            } catch (IOException e) {
                LoggerFactory.getLogger(CommonsInfoMapper.class).warn(e.getLocalizedMessage());
            }
        }
    }

    /**
     * updateForeachConditionItem
     * 
     * @param item
     */
    private void updateForeachConditionItem(SearchItem cond) {
        boolean isNonValue = StringUtils.isEmpty(cond.getFieldValue())
                || ConstantsEmployees.STRING_ARRAY_EMPTY.equals(cond.getFieldValue());
        String fieldName = cond.getFieldName().replace(ConstantsEmployees.DOT_KEYWORD, "");
        switch (fieldName) {
        // for normal text field
        case ConstantsEmployees.EMPLOYEE_FULL_NAME_FIELD:
        case ConstantsEmployees.EMPLOYEE_FULL_NAME_KANA_FIELD:
        case ConstantsEmployees.EMPLOYEE_NAME_FIELD:
        case ConstantsEmployees.EMPLOYEE_NAME_KANA_FIELD:
        case ConstantsEmployees.EMPLOYEE_SURNAME_FIELD:
        case ConstantsEmployees.EMPLOYEE_SURNAME_KANA_FIELD:
            cond.setFieldName(String.format(ConstantsEmployees.KEYWORD_TYPE, fieldName));
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            cond.setIsDefault(ConstantsEmployees.TRUE_VALUE);
            break;
        case ConstantsEmployees.SpecialItem.EMPLOYEE_MANAGERS:
        case ConstantsEmployees.SpecialItem.EMPLOYEE_SUBORDINATES:
            cond.setFieldName(ConstantsEmployees.SpecialItem.getSpecialColumn(fieldName));
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            cond.setIsDefault(ConstantsEmployees.TRUE_VALUE);
            cond.setIsNested(false);
            break;
        case ConstantsEmployees.SpecialItem.EMPLOYEE_POSITIONS:
            cond.setFieldName(fieldName);
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
            if (isNonValue) {
                cond.setFieldName(ConstantsEmployees.SpecialItem.getSpecialColumn(fieldName));
                cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
                cond.setFieldValue("");
                cond.setIsDefault(ConstantsEmployees.TRUE_VALUE);
                break;
            }
            break;
        case ConstantsEmployees.SpecialItem.EMPLOYEE_DEPARTMENTS:
            cond.setFieldName(fieldName);
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
            if (isNonValue) {
                cond.setFieldType(Integer.parseInt(FieldTypeEnum.OTHER.getCode()));
                cond.setFieldValue("");
                break;
            }
            break;
        case ConstantsEmployees.SpecialItem.IS_ADMIN:
        case ConstantsEmployees.SpecialItem.EMPLOYEE_PACKAGES:
            cond.setFieldName(fieldName);
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
            break;
        default:
            break;
        }
    }

    /**
     * get option map
     * 
     * @param searchConditionsDTO
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getOptionMap(SearchConditionsDTO searchConditionsDTO, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        orderByOptionMap
                .putAll(getCalculationOptionMap(searchConditionsDTO.getSearchConditions(), languageCode, formularMap));
        orderByOptionMap
                .putAll(getCalculationOptionMap(searchConditionsDTO.getFilterConditions(), languageCode, formularMap));
        orderByOptionMap
                .putAll(getOrderCalculationOptionMap(searchConditionsDTO.getOrderBy(), languageCode, formularMap));
        return orderByOptionMap;
    }

    /**
     * get fomular map
     * 
     * @param searchConditions
     * @return
     */
    private Map<String, String> getFomularMap(List<CalculatorFormularDTO> calculatorFormularList) {
        Map<String, String> formularMap = new HashMap<>();
        if (calculatorFormularList != null) {
            calculatorFormularList.forEach(field -> formularMap.put(field.getFieldName(), field.getConfigValue()));
        }
        return formularMap;
    }

    /**
     * get calculation option map
     * 
     * @param selectItemList
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getCalculationOptionMap(List<SearchItem> selectItemList, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        if (selectItemList == null) {
            return orderByOptionMap;
        }
        for (SearchItem searchItem : selectItemList) {
            String fieldName = searchItem.getFieldName()
                    .substring(searchItem.getFieldName().replace(PREFIX_KEYWORD, "").indexOf(Constants.PERIOD) + 1);
            if (!fieldName.contains("relation_")) {
                OrderByOption orderByOption = new OrderByOption();
                orderByOption.setLanguageCode(languageCode);
                orderByOption.setFormular(formularMap.get(fieldName));
                orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setColumnPK(
                        "emp." + Constants.Elasticsearch.getColumnPrimary(FieldBelong.EMPLOYEE.getValue()));
                orderByOptionMap.put(fieldName, orderByOption);
            }
        }
        return orderByOptionMap;
    }

    /**
     * get calculation option map
     * 
     * @param orderByList
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getOrderCalculationOptionMap(List<KeyValue> orderByList, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        if (orderByList == null) {
            return orderByOptionMap;
        }
        
        FieldInfo relationData = null;
        for (KeyValue order : orderByList) {
            String fieldName = order.getKey()
                    .substring(order.getKey().replace(PREFIX_KEYWORD, "").indexOf(Constants.PERIOD) + 1);
            OrderByOption orderByOption = new OrderByOption();
            orderByOption.setLanguageCode(languageCode);
            orderByOption.setFormular(formularMap.get(fieldName));
            if (fieldName.contains("relation_")) {
                if (relationData == null) {
                    List<FieldInfo> relationList = employeesService.getRealationData(fieldName);
                    if (relationList != null && !relationList.isEmpty()) {
                        relationData = relationList.get(0);
                    }
                }
                if (relationData != null) {
                    orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(relationData.getFieldBelong()));
                    orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(relationData.getFieldBelong()));
                    orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(relationData.getFieldBelong()));
                    orderByOption.setColumnPK(Constants.Elasticsearch.getColumnPrimary(relationData.getFieldBelong()));
                }
            }
            else {
                orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(FieldBelong.EMPLOYEE.getValue()));
                orderByOption.setColumnPK(
                        "emp." + Constants.Elasticsearch.getColumnPrimary(FieldBelong.EMPLOYEE.getValue()));
            }
            orderByOptionMap.put(fieldName, orderByOption);
        }
        return orderByOptionMap;
    }

    /**
     * condition is searched
     * 
     * @param condition
     * @return
     */
    private boolean isSearchedCondition(SearchItem condition) {
        return StringUtils.isNotBlank(condition.getFieldName()) && (CommonUtils.isTextType(condition.getFieldType())
                || FieldTypeEnum.ADDRESS.getCode().equals(String.valueOf(condition.getFieldType()))
                || FieldTypeEnum.LINK.getCode().equals(String.valueOf(condition.getFieldType()))
                || FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(String.valueOf(condition.getFieldType()))
                || FieldTypeEnum.OTHER.getCode().equals(String.valueOf(condition.getFieldType())));
    }

    /**
     * Calculated by the number of working days
     * 
     * @param filterConditions
     * @return
     */
    private List<SearchItem> calculatedWorkingDays(List<SearchItem> filterConditions) {
        if (filterConditions == null) {
            return new ArrayList<>();
        }
        filterConditions.forEach(filter -> {
            if (!FieldTypeEnum.DATE.getCode().equals(filter.getFieldType().toString())
                    && !FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                    || StringUtils.isBlank(filter.getFieldValue())) {
                return;
            }
            Map<String, Object> dateMap = null;
            try {
                TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {};
                dateMap = objectMapper.readValue(filter.getFieldValue(), mapTypeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            if (dateMap == null) {
                try {
                    TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {};
                    List<Map<String, Object>> dateList = objectMapper.readValue(filter.getFieldValue(), listTypeRef);
                    if (dateList != null && !dateList.isEmpty()) {
                        dateMap = dateList.get(0);
                    }
                    else {
                        return;
                    }
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
            }

            String fromKey = Query.SEARCH_FIELDS.FROM.toString().toLowerCase();
            String toKey = Query.SEARCH_FIELDS.TO.toString().toLowerCase();
            String filterModeDateKey = ConstantsEmployees.FILTER_MODE_DATE;

            Object fromValue = dateMap.get(fromKey);
            Object toValue = dateMap.get(toKey);
            Object filterModeDateValue = dateMap.get(filterModeDateKey);

            FilterWorkingDaysInDTO request = new FilterWorkingDaysInDTO();
            if (filterModeDateValue != null && StringUtils.isNotBlank(filterModeDateValue.toString())) {
                request.setFilterModeDate(String.valueOf(filterModeDateValue));
            }
            else {
                return;
            }

            if (fromValue != null && StringUtils.isNotBlank((String) fromValue)) {
                request.setCountFrom(String.valueOf(fromValue));
            }

            if (toValue != null && StringUtils.isNotBlank((String) toValue)) {
                request.setCountTo(String.valueOf(toValue));
            }

            FilterWorkingDaysOutDTO filterWorkingDayResponse;
            try {
                // Calculated by the number of working days
                String token = SecurityUtils.getTokenValue().orElse(null);
                filterWorkingDayResponse = restOperationUtils.executeCallApi(Constants.PathEnum.SCHEDULES,
                        "get-filter-working-days", HttpMethod.POST, request, FilterWorkingDaysOutDTO.class, token,
                        jwtTokenUtil.getTenantIdFromToken());
            } catch (Exception e) {
                log.error(e.getMessage());
                return;
            }

            Map<String, Object> fieldValue = new HashMap<>();
            if (StringUtils.isNotBlank(filterWorkingDayResponse.getDateFrom())) {
                String dateFrom = FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                        ? String.format(ConstantsEmployees.DATE_MINTIME, filterWorkingDayResponse.getDateFrom())
                        : filterWorkingDayResponse.getDateFrom();
                fieldValue.put(Query.SEARCH_FIELDS.FROM.toString().toLowerCase(), dateFrom);
            }
            if (StringUtils.isNotBlank(filterWorkingDayResponse.getDateTo())) {
                String dateTo = FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                        ? String.format(ConstantsEmployees.DATE_MAXTIME, filterWorkingDayResponse.getDateTo())
                        : filterWorkingDayResponse.getDateTo();
                fieldValue.put(Query.SEARCH_FIELDS.TO.toString().toLowerCase(), dateTo);
            }

            try {
                filter.setFieldValue(objectMapper.writeValueAsString(fieldValue));
            } catch (JsonProcessingException e) {
                log.error(e.getLocalizedMessage());
            }
        });

        return filterConditions;
    }

    /**
     * Refactor parameter for get-employees
     * 
     * @param requestAPI - request for API
     */
    private void refactorParameter(GetEmployeesRequest requestAPI) {
        if (requestAPI.getSearchConditions() == null) {
            requestAPI.setSearchConditions(new ArrayList<>());
        }
        if (requestAPI.getFilterConditions() == null) {
            requestAPI.setFilterConditions(new ArrayList<>());
        }
        if (requestAPI.getLocalSearchKeyword() == null) {
            requestAPI.setLocalSearchKeyword(ConstantsEmployees.EMPTY);
        }
        if (requestAPI.getSelectedTargetType() == null) {
            requestAPI.setSelectedTargetType(ConstantsEmployees.NUMBER_ZERO);
        }
        if(requestAPI.getSelectedTargetId() == null) {
            requestAPI.setSelectedTargetId(ConstantsEmployees.LONG_VALUE_0L);
        }
        if(requestAPI.getOrderBy() == null) {
            requestAPI.setOrderBy(new ArrayList<>());
        }
    }

    /**
     * Validate param for API get-employees
     * 
     * @param req - request for API
     */
    private void validateParameterGetEmployees(GetEmployeesRequest req) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(OFFSET_FIELD, req.getOffset());
        fixedParams.put(LIMIT_FIELD, req.getLimit());
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse validateResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                VALIDATE_MEHOTD, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (validateResponse.getErrors() != null && !validateResponse.getErrors().isEmpty()) {
            throw new CustomRestException(Constants.CONNECT_FAILED_CODE, validateResponse.getErrors());
        }
    }

    /**
     * Update listView setting
     * 
     * @param filterConditions - list filter condiiton
     * @param orderBy - list order by
     * @param selectedTargetId - ID selected
     * @param selectedTargetType - Type selected
     */
    private void callAPIUpdateListViewSetting(List<SearchItem> filterConditions, List<OrderValue> orderBy,
            Integer selectedTargetType, Long selectedTargetId) {

        UpdateListViewSettingRequest updateListViewSettingRequest = new UpdateListViewSettingRequest();
        updateListViewSettingRequest.setFieldBelong(Constants.FieldBelong.EMPLOYEE.getValue());
        updateListViewSettingRequest.setSelectedTargetType(selectedTargetType);
        updateListViewSettingRequest.setSelectedTargetId(selectedTargetId);

        if (filterConditions != null) {
            updateListViewSettingRequest.setFilterConditions(filterConditions);
        }
        if (orderBy != null) {
            updateListViewSettingRequest.setOrderBy(orderBy);
        }
        restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "update-list-view-setting", HttpMethod.POST,
                updateListViewSettingRequest, String.class, SecurityUtils.getTokenValue().orElse(""),
                jwtTokenUtil.getTenantIdFromToken());
    }

    /**
     * Get Ids Of get employees
     *
     * @return response
     */
    @PostMapping(path = "/get-ids-of-get-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetIdsBySearchConditionsOut> getIdsOfGetActivities(@RequestBody GetEmployeesRequest request) {
        GetIdsBySearchConditionsOut response = new GetIdsBySearchConditionsOut();

        ResponseEntity<GetEmployeeResponse> employeesResponse = getEmployees(request);

        if (!employeesResponse.hasBody() || employeesResponse.getBody() == null
                || CollectionUtils.isEmpty(employeesResponse.getBody().getEmployees())) {
            response.setListIds(new ArrayList<>());
            return ResponseEntity.ok(response);
        }
        GetEmployeeResponse searchResponse = employeesResponse.getBody();

        List<Long> listIdsResult = searchResponse.getEmployees().stream().map(EmployeeInfoDTO::getEmployeeId)
                .collect(Collectors.toList());
        response.setListIds(listIdsResult);
        return ResponseEntity.ok(response);
    }

}
