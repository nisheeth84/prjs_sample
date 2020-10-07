package jp.co.softbrain.esales.employees.repository.impl;

import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.Query;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.CalculatorResultDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsGroupsMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadDepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeBasicDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSummaryDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.mapper.CommonsInfoMapper;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.QueryUtils;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.SearchItem;

@Repository
public class EmployeesRepositoryCustomImpl extends RepositoryCustomUtils implements EmployeesRepositoryCustom {

    private final Logger log = LoggerFactory.getLogger(EmployeesRepositoryCustomImpl.class);

    public static final String TABLE_ALIAS = "emp";
    private static final String FROM_EMPLOYEES_EMP = " FROM employees emp ";
    private static final String EMPLOYEES_ID_PK = "emp.employee_id";
    private static final String EMPLOYEES_IDS = "employeeIds";
    private static final String MANAGER_IDS = "managerIds";
    private static final String EMPLOYEES_ALIAS_WITH_COLUMN = "emp.%s";
    private static final String EMPLOYEE_NAME_DTO_MAPPING = "EmployeeNameDTOMapping";
    public static final String WHERE = " WHERE ";
    public static final String LANGUAGE_CODE = "languageCode";
    public static final String SELECT_SQL = "SELECT ";
    public static final String FROM_EMPLOYEE_SQL = "FROM employees ";


    @Autowired
    private QueryUtils queryUtils;

    @Autowired
    private CommonsInfoMapper commonsInfoMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    /**
     * build sql string
     *
     * @param searchCondition-Array of search criteria
     * @param isCount - true if getTotalEmployees, false if getEmployess
     * @return map parameter
     *         [QUERY] = query string
     *         [PARAMETERS] = parameter put into query
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> buildSql(SearchConditionsDTO searchConditionDTO, boolean isCount) {

        Map<String, Object> params = new HashMap<>();
        int indexParam = 0;

        // for search non packages
        boolean nonPackSearch = checkSearchByNonPackages(searchConditionDTO.getSearchConditions())
                || checkSearchByNonPackages(searchConditionDTO.getFilterConditions());
        if (nonPackSearch && !CollectionUtils.isEmpty(searchConditionDTO.getElasticResultIds())) {
            List<Long> idsWithPack = employeesPackagesRepository.selectDistinctEmployeeId();
            searchConditionDTO.getElasticResultIds().removeAll(idsWithPack);
        }

        // Dynamic params
        List<SearchItem> searchConditions = commonsInfoMapper.clone(searchConditionDTO.getSearchConditions());
        searchConditions.removeIf(item -> item.getFieldType().equals(ConstantsEmployees.SpecialItem.SPECIAL_TYPE));

        List<SearchItem> filterConditions = commonsInfoMapper.clone(searchConditionDTO.getFilterConditions());
        filterConditions.removeIf(item -> item.getFieldType().equals(ConstantsEmployees.SpecialItem.SPECIAL_TYPE));

        List<KeyValue> filterTypeList = searchConditionDTO.getFilterType();

        int emStatus = 0;
        String groupId = StringUtils.EMPTY;
        String departmentId = StringUtils.EMPTY;

        for (KeyValue item : filterTypeList) {
            if (ConstantsEmployees.EMPLOYEE_STATUS_FIELD.equalsIgnoreCase(item.getKey())) {
                try {
                    emStatus = Integer.parseInt(item.getValue());
                } catch (Exception e) {
                    emStatus = 0;
                }
            }
            else if (ConstantsEmployees.GROUP_ID_FIELD.equalsIgnoreCase(item.getKey())) {
                groupId = item.getValue();
            }
            else if (ConstantsEmployees.DEPARTMENT_ID_FIELD.equalsIgnoreCase(item.getKey())) {
                departmentId = item.getValue();
            }
        }

        // sql select
        StringBuilder sqlSelect = new StringBuilder();
        sqlSelect.append("SELECT emp.* ");

        // swl join
        StringBuilder sqlJoin = new StringBuilder();
        sqlJoin.append(FROM_EMPLOYEES_EMP);

        // sql condition
        StringBuffer sqlCondition = new StringBuffer();
        sqlCondition.append(" WHERE emp.employee_status = :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), emStatus);

        // add elastic search result ids condition
        if (searchConditionDTO.getElasticResultIds() == null || searchConditionDTO.getElasticResultIds().isEmpty()) {
            sqlCondition.append(" AND FALSE ");
        }
        else {
            sqlCondition
                    .append(queryUtils.buildIdCondition(searchConditionDTO.getElasticResultIds(), EMPLOYEES_ID_PK, true));
        }

        // build orderBy
        boolean isOrderDepartment = false;
        boolean isOrderPosition = false;
        boolean isOrderManager = false;
        boolean isOrderSuborinate = false;
        boolean isOrderTimezone = false;
        boolean isOrderLanguage = false;

        if (!isCount && searchConditionDTO.getOrderBy() != null) {
            searchConditionDTO.getOrderBy().removeIf(od -> StringUtils.isBlank(od.getKey()));
            List<String> columsEmployees = getTableColumnName("employees");
            for (KeyValue order : searchConditionDTO.getOrderBy()) {
                if (StringUtils.isNotEmpty(order.getKey()) && order.getKey().endsWith(".keyword")) {
                    String fieldName = order.getKey();
                    order.setKey(fieldName.substring(0, fieldName.lastIndexOf('.')));
                }
                switch (order.getKey()) {
                case ConstantsEmployees.SpecialItem.EMPLOYEE_DEPARTMENTS:
                    isOrderDepartment = true;
                    order.setKey("dep.department_name");
                    break;
                case ConstantsEmployees.SpecialItem.EMPLOYEE_POSITIONS:
                    isOrderPosition = true;
                    order.setKey("pos.position_name");
                    break;
                case ConstantsEmployees.COLUMN_NAME_POSITION_ORDER:
                    isOrderPosition = true;
                    order.setKey("pos.position_order");
                    break;
                case ConstantsEmployees.SpecialItem.EMPLOYEE_MANAGERS:
                    isOrderManager = true;
                    order.setKey("mng.employee_name");
                    break;
                case ConstantsEmployees.SpecialItem.EMPLOYEE_SUBORDINATES:
                    isOrderSuborinate = true;
                    order.setKey("sub.employee_name");
                    break;
                case ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID:
                    isOrderTimezone = true;
                    order.setKey("zone.timezone_name");
                    break;
                case ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID:
                    isOrderLanguage = true;
                    order.setKey("lng.language_name");
                    break;
                default:
                    break;
                }
                String fieldName = order.getKey();
                if (!ConstantsEmployees.SpecialItem.IS_ADMIN.equals(fieldName) && columsEmployees.contains(fieldName)) {
                    order.setKey(String.format(EMPLOYEES_ALIAS_WITH_COLUMN, fieldName));
                }
            }
        }

        sqlJoin.append(" LEFT JOIN employees_departments empDepartments ");
        sqlJoin.append("            ON emp.employee_id = empDepartments.employee_id ");
        if (isOrderDepartment || !StringUtils.isEmpty(departmentId)) {
            sqlJoin.append(" LEFT JOIN departments dep ON dep.department_id = empDepartments.department_id ");
        }
        if (isOrderPosition) {
            sqlJoin.append(" LEFT JOIN positions pos ON pos.position_id = empDepartments.position_id ");
        }
        if (isOrderManager) {
            sqlJoin.append(" LEFT JOIN employees mng ON mng.employee_id = empDepartments.manager_id ");
        }
        if (isOrderSuborinate) {
            sqlJoin.append(" LEFT JOIN employees_departments depSub ");
            sqlJoin.append("            ON emp.employee_id = depSub.manager_id ");
            sqlJoin.append(" LEFT JOIN employees sub ON sub.employee_id = emp.employee_id ");
        }
        if (isOrderTimezone) {
            sqlJoin.append(" LEFT JOIN timezones_view zone ON zone.timezone_id = emp.timezone_id ");
        }
        if (isOrderLanguage) {
            sqlJoin.append(" LEFT JOIN languages_view lng ON lng.language_id = emp.language_id ");
        }

        if (!StringUtils.isEmpty(departmentId)) {
            sqlCondition.append(" AND dep.department_id = :indexParam" + indexParam);
            params.put(Query.INDEX_PARAM + (indexParam++), BigInteger.valueOf(Long.valueOf(departmentId)));
        }

        if (!StringUtils.isEmpty(groupId)) {
            sqlJoin.append(" INNER JOIN employees_group_members groupMembers  ");
            sqlJoin.append("           ON emp.employee_id = groupMembers.employee_id ");
            sqlCondition.append(" AND groupMembers.group_id = :indexParam" + indexParam);
            params.put(Query.INDEX_PARAM + (indexParam++), BigInteger.valueOf(Long.valueOf(groupId)));
        }

        indexParam = buildQuerySpecialItems(searchConditions, sqlCondition, params, indexParam,
                searchConditionDTO.getOptionMap());
        indexParam = buildQuerySpecialItems(filterConditions, sqlCondition, params, indexParam,
                searchConditionDTO.getOptionMap());

        if (!sqlJoin.toString().contains("departments dep") && sqlCondition.toString().contains("dep.")) {
            sqlJoin.append(" LEFT JOIN departments dep ON dep.department_id = empDepartments.department_id ");
        }
        if (!sqlJoin.toString().contains("positions pos") && sqlCondition.toString().contains("pos.")) {
            sqlJoin.append(" LEFT JOIN positions pos ON pos.position_id = empDepartments.position_id ");
        }
        if (sqlCondition.toString().contains("emp_pack.")) {
            sqlJoin.append(" LEFT JOIN employees_packages emp_pack ");
            sqlJoin.append("            ON emp.employee_id = emp_pack.employee_id ");
            sqlJoin.append(" INNER JOIN packages_view pack ON emp_pack.package_id = pack.m_package_id ");
        }

        // build search condition
        Map<String, Object> conditionMap = queryUtils.buildCondition(searchConditions, TABLE_ALIAS,
                ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA, indexParam, searchConditionDTO.getOptionMap());
        sqlCondition.append(conditionMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) conditionMap.get(Query.PARAMETERS));
        indexParam = (int) conditionMap.get(Query.INDEX_PARAM);

        // build filter condition
        Map<String, Object> filterMap = queryUtils.buildCondition(filterConditions, TABLE_ALIAS,
                ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA, indexParam, searchConditionDTO.getOptionMap());
        sqlCondition.append(filterMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) filterMap.get(Query.PARAMETERS));
        indexParam = (int) filterMap.get(Query.INDEX_PARAM);

        return buildSqlMap(isCount, sqlSelect, sqlJoin, sqlCondition, searchConditionDTO, indexParam, params);
    }

    /**
     * check search with non employee_packages
     *
     * @param searchConditions
     * @return
     */
    private boolean checkSearchByNonPackages(List<SearchItem> searchConditions) {
        return searchConditions.stream()
                .anyMatch(item -> ConstantsEmployees.SpecialItem.EMPLOYEE_PACKAGES.equals(item.getFieldName())
                        && (StringUtils.isEmpty(item.getFieldValue())
                                || ConstantsEmployees.STRING_ARRAY_EMPTY.equals(item.getFieldValue())));
    }

    /**
     * build query for special items
     *
     * @param listParams list search or filter condtitions
     * @param sqlCondition - sql query
     * @param params - params map
     * @param indexParam - index of param in map
     * @param optionMap - option Map
     * @return index new
     */
    @SuppressWarnings("unchecked")
    private int buildQuerySpecialItems(List<SearchItem> listParams, StringBuffer sqlCondition,
            Map<String, Object> params, int indexParam, Map<String, OrderByOption> optionMap) {

        List<SearchItem> listDepartmentSearch = new ArrayList<>();
        List<SearchItem> listPositionSearch = new ArrayList<>();
        List<SearchItem> listSearchAdmin = new ArrayList<>();
        List<SearchItem> listSearchPackages = new ArrayList<>();

        List<Long> idsToRemove = new ArrayList<>();
        boolean seachNullIsAdmin = false;
        for (SearchItem item : listParams) {
            switch (item.getFieldName()) {
            case ConstantsEmployees.SpecialItem.EMPLOYEE_DEPARTMENTS:
                item.setFieldName("department_id");
                item.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
                listDepartmentSearch.add(item);
                idsToRemove.add(item.getFieldId());
                break;
            case ConstantsEmployees.SpecialItem.EMPLOYEE_POSITIONS:
                item.setFieldName("position_id");
                item.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
                listPositionSearch.add(item);
                idsToRemove.add(item.getFieldId());
                break;
            case ConstantsEmployees.SpecialItem.IS_ADMIN:
                idsToRemove.add(item.getFieldId());
                if (StringUtils.isEmpty(item.getFieldValue())
                        || ConstantsEmployees.STRING_ARRAY_EMPTY.equals(item.getFieldValue())) {
                    seachNullIsAdmin = true;
                    break;
                }
                List<String> fValue;
                try {
                    fValue = objectMapper.readValue(item.getFieldValue(), List.class);
                } catch (IOException e) {
                    fValue = Collections.emptyList();
                }
                if (fValue.size() == 2) {
                    break;
                }
                for (String value : fValue) {
                    SearchItem boolItem = commonsInfoMapper.clone(item);
                    boolItem.setFieldType(Integer.parseInt(FieldTypeEnum.BOOL.getCode()));
                    boolItem.setFieldValue(value);
                    listSearchAdmin.add(boolItem);
                }
                break;
            case ConstantsEmployees.SpecialItem.EMPLOYEE_PACKAGES:
                SearchItem packSearch = commonsInfoMapper.clone(item);
                packSearch.setFieldName("package_id");
                packSearch.setFieldType(Integer.parseInt(FieldTypeEnum.CHECKBOX.getCode()));
                listSearchPackages.add(packSearch);
                idsToRemove.add(item.getFieldId());
                break;
            default:
                break;
            }
        }
        listParams.removeIf(item -> idsToRemove.contains(item.getFieldId()));
        listParams.addAll(listSearchAdmin);
        // for search is_admin = null
        if (seachNullIsAdmin) {
            sqlCondition.append(" AND emp.is_admin IS NULL ");
        }

        Map<String, Object> departmentSearchMap = queryUtils.buildCondition(listDepartmentSearch, "dep", "", indexParam,
                optionMap);
        sqlCondition.append(departmentSearchMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) departmentSearchMap.get(Query.PARAMETERS));
        indexParam = (int) departmentSearchMap.get(Query.INDEX_PARAM);

        // build for position
        Map<String, Object> positionSearchMap = queryUtils.buildCondition(listPositionSearch, "pos", "", indexParam,
                optionMap);
        sqlCondition.append(positionSearchMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) positionSearchMap.get(Query.PARAMETERS));
        indexParam = (int) positionSearchMap.get(Query.INDEX_PARAM);

        listSearchPackages.removeIf(item -> StringUtils.isEmpty(item.getFieldValue())
                || ConstantsEmployees.STRING_ARRAY_EMPTY.equals(item.getFieldValue()));
        Map<String, Object> packagesSearchMap = queryUtils.buildCondition(listSearchPackages, "emp_pack", "",
                indexParam,
                optionMap);
        sqlCondition.append(packagesSearchMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) packagesSearchMap.get(Query.PARAMETERS));
        indexParam = (int) packagesSearchMap.get(Query.INDEX_PARAM);

        return indexParam;
    }

    /**
     * Build sql map
     *
     * @param isCount - true if getTotalEmployees, false if getEmployess
     * @param sqlJoin - sql buffer
     * @param sqlCondition - string sql condition
     * @param searchCondition - Array of search criteria
     * @param indexParam - index param
     * @param params - map of params
     * @return map parameter
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> buildSqlMap(boolean isCount, StringBuilder sqlSelect, StringBuilder sqlJoin,
            StringBuffer sqlCondition, SearchConditionsDTO searchCondition, int indexParam,
            Map<String, Object> params) {
        Map<String, Object> sqlMap = new HashMap<>();
        String groupBy = " GROUP BY emp.employee_id ";

        if (isCount) {
            sqlSelect.append(sqlJoin);
            sqlMap.put(Query.QUERY_STRING,
                    "SELECT COUNT(*) FROM (" + sqlSelect.append(sqlCondition).append(groupBy) + ") AS TBL");
        }
        else {
            Long offset = searchCondition.getOffset();
            Long limit = searchCondition.getLimit();
            List<KeyValue> orderBy = searchCondition.getOrderBy();
            if (orderBy != null && !orderBy.isEmpty()) {
                List<KeyValue> specialItemOrder = getSpecialItem(orderBy);

                Map<String, Object> orderMap = queryUtils.buildOrder(searchCondition.getOrderBy(),
                        searchCondition.getOptionMap());
                sqlSelect.append(orderMap.get(Query.QUERY_SELECT));
                groupBy += orderMap.get(Query.QUERY_GROUPBY).toString();
                sqlJoin.append(orderMap.get(Query.QUERY_JOIN)).append(sqlCondition).append(groupBy)
                        .append(orderMap.get(Query.QUERY_ORDERBY));
                if (!CollectionUtils.isEmpty(specialItemOrder)) {
                    List<String> listOrderPlus = new ArrayList<>();
                    specialItemOrder.forEach(
                            spec -> listOrderPlus.add(spec.getKey() + ConstantsEmployees.SPACE + spec.getValue()));
                    if (!sqlJoin.toString().contains("ORDER BY")) {
                        sqlJoin.append("ORDER BY");
                    } else {
                        sqlJoin.append(ConstantsEmployees.SPACE).append(ConstantsEmployees.COMMA);
                    }
                    sqlJoin.append(ConstantsEmployees.SPACE)
                            .append(String.join(ConstantsEmployees.COMMA, listOrderPlus));
                }
            }
            else {
                sqlJoin.append(sqlCondition).append(groupBy).append(ConstantsEmployees.EMPLOYEE_ORDER_BY_DEFAULT);
            }
            if (offset != null && limit != null) {
                Map<String, Object> offsetMap = queryUtils.buildOffsetLimit(offset, limit, indexParam);

                sqlJoin.append(offsetMap.get(Query.OFFSET_LIMIT));
                params.putAll((Map<String, Object>) offsetMap.get(Query.PARAMETERS));
            }

            sqlMap.put(Query.QUERY_STRING, sqlSelect.append(sqlJoin));
        }
        sqlMap.put(Query.PARAMETERS, params);
        return sqlMap;
    }

    /**
     * @param originalOrderBy
     * @return
     */
    private List<KeyValue> getSpecialItem(List<KeyValue> originalOrderBy) {
        List<KeyValue> listSpecial = new ArrayList<>();
        for (KeyValue order : originalOrderBy) {
            if (ConstantsEmployees.SpecialItem.IS_ADMIN.equals(order.getKey())) {
                listSpecial.add(order);
            }
        }
        originalOrderBy.removeIf(listSpecial::contains);
        return listSpecial;
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     * getCalculatorFormular(java.lang.Integer)
     */
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("fieldBelong", fieldBelong);
        parameters.put("fieldType", FieldTypeEnum.CALCULATION.getCode());
        return this.getResultList(queryUtils.getCalculatorFormularQuery(), "CalculatorFormularDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getTotalEmployees(jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO)
     */
    @Override
    @SuppressWarnings("unchecked")
    public Long getTotalEmployees(SearchConditionsDTO searchConditions) {
        Map<String, Object> sqlMap = new HashMap<>();
        try {
            sqlMap = buildSql(searchConditions, true);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        Object count = (sqlMap != null && !sqlMap.isEmpty()) ? this.getSingleResult(
                sqlMap.get(Query.QUERY_STRING).toString(), (Map<String, Object>) sqlMap.get(Query.PARAMETERS)) : null;
        return (count == null ? 0L : Long.valueOf(count.toString()));
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployees(jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO)
     */
    @Override
    @SuppressWarnings("unchecked")
    public List<SelectEmployeesDTO> getEmployees(SearchConditionsDTO searchConditions) {
        Map<String, Object> sqlMap = new HashMap<>();
        try {
            sqlMap = buildSql(searchConditions, false);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return (sqlMap == null || sqlMap.isEmpty()) ? new ArrayList<>()
                : this.getResultList(sqlMap.get(Query.QUERY_STRING).toString(),
                        "SelectEmployeesDTOMapping",
                (Map<String, Object>) sqlMap.get(Query.PARAMETERS));
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findDepartmentByEmployeeIds(List, String)
     */
    @Override
    public List<DownloadDepartmentPositionDTO> findDepartmentByEmployeeIds(List<Long> employeeIds, String languageCode) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT ed.employee_id  AS  targetId ");
        sqlBuilder.append("     , d.department_id AS departmentId ");
        sqlBuilder.append("     , d.department_name AS departmentName ");
        sqlBuilder.append("     , p.position_id AS positionId ");
        sqlBuilder.append("     , p.position_name->>:languageCode AS positionName ");
        sqlBuilder.append("     , p.position_order AS positionOrder ");
        sqlBuilder.append(" FROM employees_departments  ed ");
        sqlBuilder.append("LEFT JOIN departments d ");
        sqlBuilder.append("         ON d.department_id  =  ed.department_id ");
        sqlBuilder.append("LEFT JOIN positions p ");
        sqlBuilder.append("         ON p.position_id  =  ed.position_id ");
        sqlBuilder.append("WHERE ed.employee_id IN (:employeeIds)  ");
        parameters.put(EMPLOYEES_IDS, employeeIds);
        sqlBuilder.append("ORDER BY  p.position_order ASC, d.department_order ASC ");
        parameters.put(LANGUAGE_CODE, languageCode);
        return this.getList(sqlBuilder.toString(), DownloadDepartmentPositionDTO.class, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findManagerByEmployeeIds(List)
     */
    @Override
    public List<DownloadEmployeeNameDTO> findManagerByEmployeeIds(List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ed.employee_id  AS  targetId ");
        sqlBuilder.append("     , emp.employee_id  AS  employeeId ");
        sqlBuilder.append("     , concat (emp.employee_surname, ' ', emp.employee_name ) AS employeeName ");
        sqlBuilder.append("FROM employees_departments  ed ");
        sqlBuilder.append("INNER JOIN departments d ");
        sqlBuilder.append("         ON d.department_id = ed.department_id ");
        sqlBuilder.append("INNER JOIN employees  emp ");
        sqlBuilder.append("         ON ed.manager_id = emp.employee_id ");
        sqlBuilder.append("WHERE ed.employee_id IN (:employeeIds) ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        sqlBuilder.append("ORDER BY d.department_order ASC ");
        return this.getList(sqlBuilder.toString(), DownloadEmployeeNameDTO.class, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findEmployeeByManagerIds(List)
     */
    @Override
    public List<DownloadEmployeeNameDTO> findEmployeeByManagerIds(List<Long> managerIds) {
        if (managerIds == null || managerIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT eDepartments.employee_id  AS  targetId ");
        sqlBuilder.append("     , emp.employee_id  AS  employeeId ");
        sqlBuilder.append("     , concat ( emp.employee_surname,' ', emp.employee_name ) AS employeeName ");
        sqlBuilder.append("FROM employees_departments eDepartments ");
        sqlBuilder.append("INNER JOIN employees  emp ");
        sqlBuilder.append("         ON eDepartments.employee_id = emp.employee_id ");
        sqlBuilder.append("WHERE eDepartments.manager_id IN (:managerIds) ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(MANAGER_IDS, managerIds);
        return this.getList(sqlBuilder.toString(), DownloadEmployeeNameDTO.class, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findDepartmentByEmployeeId(java.util.List,
     *      java.lang.Long)
     */
    @Override
    public List<DepartmentPositionDTO> findDepartmentByEmployeeId(List<Long> employeeIds, Long managerId) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT d.department_id ");
        sqlBuilder.append("     , d.department_name ");
        sqlBuilder.append("     , p.position_id ");
        sqlBuilder.append("     , p.position_name \\:\\: TEXT ");
        sqlBuilder.append("     , p.position_order ");
        sqlBuilder.append("     , emp.employee_id ");
        sqlBuilder.append("     , mng.employee_surname ");
        sqlBuilder.append("     , mng.employee_name ");
        sqlBuilder.append("     , mng.employee_id AS manager_id ");
        sqlBuilder.append("     , mng.photo_file_path AS manager_photo_file_path ");
        sqlBuilder.append("FROM employees_departments ed ");
        sqlBuilder.append("LEFT JOIN departments d ");
        sqlBuilder.append("        ON d.department_id = ed.department_id ");
        sqlBuilder.append("LEFT JOIN positions p ");
        sqlBuilder.append("        ON p.position_id = ed.position_id ");
        sqlBuilder.append("LEFT JOIN employees emp ");
        sqlBuilder.append("        ON emp.employee_id = ed.employee_id ");
        sqlBuilder.append("LEFT JOIN employees mng ");
        sqlBuilder.append("        ON ed.manager_id = mng.employee_id ");

        sqlBuilder.append("WHERE ed.employee_id IN (:employeeIds) ");
        if (managerId != null) {
            sqlBuilder.append("AND ed.manager_id =:managerId ");
            parameters.put(ConstantsEmployees.PARAM_MANAGER_ID, managerId);
        }

        sqlBuilder.append("ORDER BY  p.position_order ASC, d.department_order ASC ");

        parameters.put(ConstantsEmployees.PARAM_EMPLOYEE_IDS, employeeIds);

        return this.getResultList(sqlBuilder.toString(), "DepartmentPositionDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findManagerByEmployeeId(java.lang.Long)
     */
    @Override
    public List<EmployeeNameDTO> findManagerByEmployeeId(Long employeeId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT emp.employee_id AS employeeId ");
        sqlBuilder.append("     , concat (emp.employee_surname, ' ', emp.employee_name ) AS employeeName ");
        sqlBuilder.append("FROM employees_departments ed ");
        sqlBuilder.append("INNER JOIN departments d ");
        sqlBuilder.append("        ON d.department_id = ed.department_id ");
        sqlBuilder.append("INNER JOIN employees emp ");
        sqlBuilder.append("        ON ed.manager_id = emp.employee_id ");
        sqlBuilder.append("WHERE ed.employee_id = :employeeId ");
        sqlBuilder.append("ORDER BY d.department_order ASC ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);
        return this.getResultList(sqlBuilder.toString(), EMPLOYEE_NAME_DTO_MAPPING, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findEmployeeByManagerId(java.lang.Long)
     */
    @Override
    public List<EmployeeNameDTO> findEmployeeByManagerId(Long managerId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT emp.employee_id AS employeeId ");
        sqlBuilder.append("     , concat ( emp.employee_surname,' ', emp.employee_name ) AS employeeName ");
        sqlBuilder.append("FROM employees_departments eDepartments ");
        sqlBuilder.append("INNER JOIN employees emp ");
        sqlBuilder.append("        ON eDepartments.employee_id = emp.employee_id ");
        sqlBuilder.append("WHERE eDepartments.manager_id = :managerId");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("managerId", managerId);
        return this.getResultList(sqlBuilder.toString(), EMPLOYEE_NAME_DTO_MAPPING, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesByEmployeeIds(List,
     *      List)
     */
    @Override
    public List<SelectEmployeesDTO> getEmployeesByEmployeeIds(List<Long> employeeIds, List<KeyValue> orderBy) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT DISTINCT emp.* ");
        sqlBuilder.append("FROM employees emp ");
        sqlBuilder.append("LEFT JOIN employees_departments empDepartments ");
        sqlBuilder.append("        ON emp.employee_id = empDepartments.employee_id ");
        sqlBuilder.append("LEFT JOIN departments dep ");
        sqlBuilder.append("        ON empDepartments.department_id = dep.department_id ");
        sqlBuilder.append("LEFT JOIN positions pos ");
        sqlBuilder.append("        ON empDepartments.position_id = pos.position_id ");
        sqlBuilder.append("WHERE emp.employee_id IN (:employeeIds) ");
        if (orderBy != null && !orderBy.isEmpty()) {
            Map<String, Object> orderMap = queryUtils.buildOrder(orderBy, null);
            try {
                sqlBuilder.append(orderMap.get(Query.QUERY_ORDERBY));
            } catch (Exception e) {
                e.getStackTrace();
                return new ArrayList<>();
            }
        }
        else {
            sqlBuilder.append(" ORDER BY emp.employee_name ASC");
        }
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        return this.getResultList(sqlBuilder.toString(), "SelectEmployeesDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeeMails(java.util.List,
     *      java.util.List, java.util.List)
     */
    @Override
    public List<String> getEmployeeMails(List<Long> employeeIds, List<Long> groupIds, List<Long> departmentIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT emp.email ");
        sqlBuilder.append(FROM_EMPLOYEES_EMP);

        StringBuilder conditions = new StringBuilder();
        // If list employeeIds not null and not empty
        if (employeeIds != null && !employeeIds.isEmpty()) {
            conditions.append("emp.employee_id IN (").append(StringUtils.join(employeeIds, Constants.COMMA))
                    .append(")");
        }
        // If list departmentIds not null and not empty
        if (departmentIds != null && !departmentIds.isEmpty()) {
            sqlBuilder.append(" INNER JOIN employees_departments empdep ")
                    .append("         ON emp.employee_id = empdep.employee_id ");
            if (conditions.length() > 0) {
                conditions.append(" AND ");
            }
            conditions.append("empdep.department_id IN (").append(StringUtils.join(departmentIds, Constants.COMMA))
                    .append(")");
        }
        // If list groupIds not null and not empty
        if (groupIds != null && !groupIds.isEmpty()) {
            sqlBuilder.append(" INNER JOIN employees_group_members egm ")
                    .append("         ON emp.employee_id = egm.employee_id ");
            if (conditions.length() > 0) {
                conditions.append(" AND ");
            }
            conditions.append("egm.group_id IN (").append(StringUtils.join(groupIds, Constants.COMMA)).append(")");
        }
        sqlBuilder.append(WHERE).append(conditions);
        return this.getResultList(sqlBuilder.toString());
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#countEmployeeByKey(java.lang.String,
     *      java.lang.String)
     */
    @Override
    public Long countEmployeeByKey(String keyFieldName, String fieldValue) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT 1 FROM employees emp ");
        sqlBuilder.append("WHERE ");
        sqlBuilder.append(" emp." + keyFieldName + " = '" + fieldValue + "'");
        sqlBuilder.append(" LIMIT 1");
        Object count = this.getSingleResult(sqlBuilder.toString());
        return count == null ? 0l : Long.valueOf(count.toString());
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeeIdsByCondition(java.util.Map,
     *      java.util.List)
     */
    @Override
    public List<Long> getEmployeeIdsByCondition(Map<Integer, String> columnCheckDuplicatedMap,
            List<String> csvContentRow) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT employee_id ");
        sqlBuilder.append(" FROM  employees ");
        sqlBuilder.append(" WHERE ( ");
        String operator = ConstantsEmployees.EMPTY;
        for (int i = 0; i < csvContentRow.size(); i++) {
            if (!columnCheckDuplicatedMap.containsKey(i)) {
                continue;
            }
            sqlBuilder.append(operator);
            sqlBuilder.append(columnCheckDuplicatedMap.get(i)).append(" = '").append(csvContentRow.get(i) + "'");
            operator = Constants.Query.SPACE + Constants.Query.AND_CONDITION + Constants.Query.SPACE;
        }
        sqlBuilder.append(" ); ");

        List<Long> result = new ArrayList<>();
        List<BigInteger> bigIntegerResult = this.getResultList(sqlBuilder.toString());
        for (BigInteger bigInteger : bigIntegerResult) {
            result.add(bigInteger.longValue());
        }
        return result;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesByKeyword(java.lang.String)
     */
    @Override
    public List<Employees> getEmployeesByKeyword(String keyWord) {
        Map<String, Object> params = new HashMap<>();
        int indexParam = 0;

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT DISTINCT emp.* ");
        sqlBuilder.append("FROM employees emp ");
        sqlBuilder.append("LEFT JOIN employees_departments emp_dep ");
        sqlBuilder.append("        ON emp.employee_id = emp_dep.employee_id ");
        sqlBuilder.append("INNER JOIN departments dep ");
        sqlBuilder.append("        ON emp_dep.department_id = dep.department_id ");
        sqlBuilder.append("INNER JOIN positions pos  ");
        sqlBuilder.append("        ON emp_dep.position_id = pos.position_id ");

        StringBuffer sqlCondition = new StringBuffer();
        String searchKeyword = "%" + keyWord + "%";

        sqlCondition.append(" emp.employee_surname LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.employee_name LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.employee_surname_kana LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.employee_name_kana LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.email LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.telephone_number LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR emp.cellphone_number LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam++), searchKeyword);
        sqlCondition.append(" OR pos.position_name \\:\\: TEXT LIKE :indexParam" + indexParam);
        params.put(Query.INDEX_PARAM + (indexParam), searchKeyword);

        sqlBuilder.append(" WHERE (").append(sqlCondition).append(")");
        sqlBuilder.append(" ORDER BY emp.employee_name ASC");

        return this.getResultList(sqlBuilder.toString(), "GetEmployeesSuggestionMapping", params);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesManagers(java.lang.Long)
     */
    @Override
    public List<EmployeeSummaryDTO> getEmployeesManagers(Long employeeId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(SELECT_SQL);
        sqlBuilder.append("       CASE WHEN employees_departments.manager_id IS NULL ");
        sqlBuilder.append("            THEN p_employees.employee_id ");
        sqlBuilder.append("            ELSE employees.employee_id ");
        sqlBuilder.append("       END AS employeeId ");
        sqlBuilder.append("     , CASE WHEN employees_departments.manager_id IS NULL ");
        sqlBuilder.append("            THEN p_employees.photo_file_path ");
        sqlBuilder.append("            ELSE employees.photo_file_path ");
        sqlBuilder.append("       END AS employeeIconPath");
        sqlBuilder.append("     , CASE WHEN employees_departments.manager_id IS NULL ");
        sqlBuilder.append("            THEN CONCAT(p_employees.employee_surname, ' ', p_employees.employee_name) ");
        sqlBuilder.append("            ELSE CONCAT(employees.employee_surname, ' ', employees.employee_name) ");
        sqlBuilder.append("       END AS employeeName ");
        sqlBuilder.append("     , employees_departments.manager_id AS managerId ");
        sqlBuilder.append("     , departments.department_name AS departmentName ");
        sqlBuilder.append("FROM employees_departments ");
        sqlBuilder.append("LEFT JOIN employees ");
        sqlBuilder.append("       ON employees_departments.manager_id = employees.employee_id ");
        sqlBuilder.append("LEFT JOIN departments ");
        sqlBuilder.append("       ON employees_departments.department_id = departments.department_id ");
        sqlBuilder.append("LEFT JOIN employees p_employees ");
        sqlBuilder.append("       ON departments.manager_id = p_employees.employee_id ");
        sqlBuilder.append("WHERE employees_departments.employee_id = :employeeId ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);
        return this.getResultList(sqlBuilder.toString(), "GetEmployeesManagersMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesByEmployeesIds(java.util.List)
     */
    @Override
    public List<InitializeGroupModalSubType2DTO> getEmployeesByEmployeesIds(List<Long> empIds, String languageCode) {
        String sql = "SELECT emp.employee_id, emp.employee_surname, emp.employee_name, dep.department_name, emp.photo_file_name, emp.photo_file_path, p.position_id,  p.position_name->>:languageCode AS position_name "
                + FROM_EMPLOYEES_EMP
                + " INNER JOIN employees_departments empDep ON emp.employee_id = empdep.employee_id "
                + " INNER JOIN departments dep ON empDep.department_id = dep.department_id "
                + " LEFT JOIN positions p ON p.position_id = empDep.position_id "
                + " WHERE emp.employee_id IN (:empIds) ";
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("empIds", empIds);
        parameters.put(LANGUAGE_CODE, languageCode);
        return this.getResultList(sql, "InitializeGroupModalSubType2Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getListGroupIdAndDepartmentId(java.util.List)
     */
    @Override
    public List<GetGroupAndDepartmentDTO> getListGroupIdAndDepartmentId(List<Long> employeeIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT e.employee_id ");
        sqlBuilder.append("     , e.employee_name ");
        sqlBuilder.append("     , egm.group_id ");
        sqlBuilder.append("     , ed.department_id ");
        sqlBuilder.append("     , e.updated_date ");
        sqlBuilder.append("FROM employees e ");
        sqlBuilder.append("LEFT JOIN employees_group_members egm ");
        sqlBuilder.append("    ON e.employee_id = egm.employee_id ");
        sqlBuilder.append("LEFT JOIN employees_departments ed ");
        sqlBuilder.append("    ON e.employee_id = ed.employee_id ");
        sqlBuilder.append("WHERE e.employee_id IN ( :employeeIds ); ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        return getResultList(sqlBuilder.toString(), "GroupAndDeparmentMapping", parameters);
    }

    /**
     * get data calculator item
     *
     * @param employeeIds - employee ids
     * @param formular - formular string
     * @return list data calculator
     */
    @Override
    public List<CalculatorResultDTO> getCalculatorResult(List<Long> employeeIds, String formular) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT employee_id AS employeeId");
        sqlBuilder.append(", calculator(:formular, 'employees', 'employee_id', employee_id) AS result");
        sqlBuilder.append(" FROM employees ");
        sqlBuilder.append(" WHERE employee_id IN ( :employeeIds )");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        parameters.put("formular", formular.replace("''", "'"));
        return getList(sqlBuilder.toString(), CalculatorResultDTO.class, parameters);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     * getEmployeeSelectedOrganization(java.lang.Long)
     */
    @Override
    public List<EmployeeSelectedOrganizationDTO> getEmployeeSelectedOrganization(List<Long> employeeIds,
            String langCode) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT e.employee_id,");
        sqlBuilder.append("       e.photo_file_path,");
        sqlBuilder.append("       e.photo_file_name,");
        sqlBuilder.append("       e.employee_name,");
        sqlBuilder.append("       ed.department_id,");
        sqlBuilder.append("       d.department_name,");
        sqlBuilder.append("       d.department_order,");
        sqlBuilder.append("       p.position_id,");
        sqlBuilder.append("       p.position_name->>:langCode AS position_name,");
        sqlBuilder.append("       p.position_order, ");
        sqlBuilder.append("       e.employee_surname ");
        sqlBuilder.append("FROM   employees e ");
        sqlBuilder.append("LEFT JOIN ");
        sqlBuilder.append("       employees_departments ed ");
        sqlBuilder.append("       LEFT JOIN departments d ON ed.department_id = d.department_id ");
        sqlBuilder.append("       LEFT JOIN positions p ON ed.position_id = p.position_id ");
        sqlBuilder.append("ON     e.employee_id = ed.employee_id ");
        sqlBuilder.append("WHERE  e.employee_id IN (:employeeIds) ");
        sqlBuilder.append("ORDER BY  p.position_order, d.department_order,e.employee_id ASC ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        parameters.put("langCode", langCode);
        return this.getResultList(sqlBuilder.toString(), "EmployeeSelectedOrganization", parameters);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     * getGroupSelectedOrganization(java.lang.Long)
     */
    @Override
    public List<GroupSelectedOrganizationDTO> getGroupSelectedOrganization(List<Long> groupId) {
        if (groupId == null || groupId.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT g.group_id,");
        sqlBuilder.append("       g.group_name,");
        sqlBuilder.append("       eg.employee_id ");
        sqlBuilder.append("FROM employees_groups g ");
        sqlBuilder.append("LEFT JOIN employees_group_members eg ");
        sqlBuilder.append("          ON g.group_id = eg.group_id ");
        sqlBuilder.append("WHERE g.group_id IN (:groupId ) ");
        sqlBuilder.append("ORDER BY g.display_order, eg.employee_id ASC");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("groupId", groupId);
        return this.getResultList(sqlBuilder.toString(), "GroupSelectedOrganization", parameters);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     * getDepartmentSelectedOrganization(java.lang.Long)
     */
    @Override
    public List<DepartmentSelectedOrganizationDTO> getDepartmentSelectedOrganization(List<Long> departmentIds) {
        if (departmentIds == null || departmentIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT d.department_id,");
        sqlBuilder.append("       d.department_name,");
        sqlBuilder.append("       p.department_id AS parent_department_id,");
        sqlBuilder.append("       p.department_name AS parent_department_name,");
        sqlBuilder.append("       ed.employee_id ");
        sqlBuilder.append("FROM departments d  ");
        sqlBuilder.append("LEFT JOIN employees_departments ed ");
        sqlBuilder.append("          ON d.department_id = ed.department_id ");
        sqlBuilder.append("LEFT JOIN departments p ");
        sqlBuilder.append("          ON d.parent_id = p.department_id ");
        sqlBuilder.append("WHERE d.department_id IN (:departmentIds) ");
        sqlBuilder.append("ORDER BY d.department_order ASC");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("departmentIds", departmentIds);
        return this.getResultList(sqlBuilder.toString(), "DepartmentSelectedOrganization", parameters);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesWithRelation(java.util.List, jp.co.softbrain.esales.commons.grpc.Fields)
     */
    @Override
    public List<Employees> getEmployeesWithRelation(List<Long> idListSearch, CustomFieldsInfoOutDTO field) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT * ");
        sqlBuilder.append(FROM_EMPLOYEE_SQL);
        sqlBuilder.append("WHERE ");
        sqlBuilder.append(queryUtils.buildIdCondition(idListSearch, ConstantsEmployees.EMPLOYEE_ID, false));
        if(!idListSearch.isEmpty()) {
            sqlBuilder.append("AND ");
        }
        if(Boolean.TRUE.equals(field.getIsDefault())) {
            sqlBuilder.append("employees.");
            sqlBuilder.append(field.getFieldName());
            sqlBuilder.append(" IS NOT NULL");
        } else {
            sqlBuilder.append("employees.employee_data ->> :fieldName ");
            sqlBuilder.append("IS NOT NULL ");
            sqlBuilder.append("AND employees.employee_data ->> :fieldName ");
            sqlBuilder.append("!= '[]' ");
            parameters.put("fieldName", field.getFieldName());
        }
        return this.getResultList(sqlBuilder.toString(), "GetEmployeesSuggestionMapping", parameters);
    }

    @Override
    public List<Long> getEmployeeIdsCreatedRelation(List<CustomFieldsInfoOutDTO> fields, List<Long> employeeIds) {
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append("SELECT employee_id ");
        sqlQuery.append("FROM employees  ");
        sqlQuery.append("WHERE employee_id IN (:employeeIds) ");
        fields.forEach(field -> {
            if (!Boolean.TRUE.equals(field.getIsDefault())) {
                sqlQuery.append("AND  employee_data ->> '" + field.getFieldName() + "' IS NOT NULL ");
                sqlQuery.append("AND employee_data ->> '" + field.getFieldName() + "' != '[]' ");
            } else {
                sqlQuery.append("AND " + field.getFieldName() + " IS NOT NULL ");
                sqlQuery.append("AND " + field.getFieldName() + " != '[]' ");
            }
        });
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        List<Long> listEmployeeId = new ArrayList<>();
        List<BigInteger> listOutput = this.getResultList(sqlQuery.toString(), parameters);
        if (listOutput != null && !listOutput.isEmpty()) {
            listOutput.forEach(idOutput -> listEmployeeId.add(idOutput.longValue()));
        }
        return listEmployeeId;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#findPackagesByEmployeeId(List)
     */
    @Override
    public List<EmployeesPackagesSubtypeDTO> findPackagesByEmployeeId(List<Long> employeeIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT pack.package_name ");
        sqlBuilder.append("     , emp_pack.package_id ");
        sqlBuilder.append("     , emp_pack.employee_id ");
        sqlBuilder.append("FROM employees_packages emp_pack ");
        sqlBuilder.append("      INNER JOIN packages_view pack ON emp_pack.package_id = pack.m_package_id ");
        sqlBuilder.append("WHERE emp_pack.employee_id IN (:employeeIds) ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEES_IDS, employeeIds);
        return getResultList(sqlBuilder.toString(), "EmployeesPackagesMapping", parameters);
    }

    /**
     * Get list columnName by tableName
     *
     * @param tableName tableName
     * @return list columnName
     */
    public List<String> getTableColumnName(String tableName) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT COLUMN_NAME ");
        sqlBuilder.append("FROM INFORMATION_SCHEMA.COLUMNS ");
        sqlBuilder.append("WHERE table_name = :tableName");
        Map<String, Object> params = new HashMap<>();
        params.put("tableName", tableName);
        return this.getResultList(sqlBuilder.toString(), params);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getAllCalculatorFormular(java.lang.Integer)
     */
    @Override
    public List<CalculatorFormularDTO> getAllCalculatorFormular(Integer fieldBelong) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("fieldBelong", fieldBelong);
        parameters.put("fieldType", FieldTypeEnum.CALCULATION.getCode());
        return this.getResultList(queryUtils.getAllCalculatorFormularQuery(), "AllCalculatorFormularDTOMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     * getCalculation(java.lang.String, java.lang.Long)
     */
    @Override
    public String getCalculation(String calculationFormular, Long employeeId) {
        StringBuilder sqlBuffer = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);
        sqlBuffer.append(SELECT_SQL);
        calculationFormular = calculationFormular.replace("\'\'", "\'").replace("::", "\\:\\:");
        sqlBuffer.append(calculationFormular);
        sqlBuffer.append(" FROM employees ");
        sqlBuffer.append("WHERE employee_id = :employeeId");
        List<Object> list = this.getResultList(sqlBuffer.toString(), parameters);
        String value = String.valueOf(list.get(0));
        if(StringUtils.isNotBlank(value)) {
            value = !value.contains(".") ? value : value.replaceAll("0*$", "").replaceAll("\\.$", "");
        }
        return value;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeesByFullNames(List)
     */
    @Override
    public List<EmployeeNameDTO> getEmployeesByFullNames(List<String> employeeNames) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT employee_id AS employeeId, ");
        sqlBuilder.append("       concat ( employee_surname, ' ', employee_name ) AS employeeName ");
        sqlBuilder.append(FROM_EMPLOYEE_SQL);
        sqlBuilder.append("WHERE concat ( employee_surname, ' ', employee_name ) IN ( :employeeNames ) ");
        Map<String, Object> params = new HashMap<>();
        params.put("employeeNames", employeeNames);
        return this.getResultList(sqlBuilder.toString(), EMPLOYEE_NAME_DTO_MAPPING, params);
    }

    /**
     * @see EmployeesRepositoryCustom#findEmployeesSyncQuickSight(List, Long)
     */
    @Override
    public List<EmployeeSyncQuickSightDTO> findEmployeesSyncQuickSight(List<Long> employeeIds, Long packageId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT emp.employee_id ")
                .append("   , emp.employee_surname ")
                .append("   , emp.employee_name ")
                .append("   , emp.email ")
                .append("   , emp.employee_status ")
                .append("   , emp.is_account_quicksight ")
                .append("   , empp.package_id ")
                .append(FROM_EMPLOYEES_EMP)
                .append(" LEFT JOIN employees_packages empp ON emp.employee_id = empp.employee_id")
                .append(WHERE)
                .append("    ((emp.employee_status = 0 ")
                .append("         AND (emp.is_account_quicksight IS NULL OR emp.is_account_quicksight = FALSE) ")
                .append("         AND empp.package_id = :packageId)")
                .append("     OR emp.is_account_quicksight = TRUE)");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("packageId", packageId);
        if (!CollectionUtils.isEmpty(employeeIds)) {
            sqlBuilder.append("    AND emp.employee_id IN :employeeIds");
            parameters.put(EMPLOYEES_IDS, employeeIds);
        }
        return getResultList(sqlBuilder.toString(), "EmployeeSyncQuickSightDTOMapping", parameters);
    }
    /**
     * Get list employee by tenant
     *
     * @param email email
     * @return list EmployeeOutDTO
     */
    @Override
    public EmployeeOutDTO getEmployeeByTenant(String email) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append(" SELECT e.employee_id, ");
        sqlQuery.append("        e.email, ");
        sqlQuery.append("        e.employee_name, ");
        sqlQuery.append("        e.employee_surname, ");
        sqlQuery.append("        e.employee_status ");
        sqlQuery.append(" FROM employees e ");
        sqlQuery.append(" WHERE e.email = :email ");
        parameters.put("email", email);
        Object result = this.getSingleResult(sqlQuery.toString(), "EmployeeOutDTOMapping", parameters);
        return result != null ? (EmployeeOutDTO) result : new EmployeeOutDTO();
    }

    /**
     * Get list or group with only owner
     *
     * @param fieldName
     * @param fieldValue
     * @return
     */
    @Override
    public List<GetOrganizationGroupDTO> getListOrGroupWithOnlyOneOwner(String fieldName, Long fieldValue) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append(" SELECT ");
        sqlQuery.append("       employees_group_participants.group_id, ");
        sqlQuery.append("       group_name  ");
        sqlQuery.append(" FROM ");
        sqlQuery.append("       employees_group_participants ");
        sqlQuery.append("       INNER JOIN employees_groups ON employees_group_participants.group_id = employees_groups.group_id  ");
        sqlQuery.append(WHERE);
        sqlQuery.append("   employees_group_participants.group_id IN ( SELECT group_id FROM employees_group_participants WHERE participant_type = 2 ");
        sqlQuery.append("   GROUP BY group_id ");
        sqlQuery.append("   HAVING COUNT ( ").append(fieldName).append(" ) = 1 ) ");
        sqlQuery.append("   AND ").append(fieldName).append(" = ").append(fieldValue).append(" ");
        sqlQuery.append("   AND group_type = 2  ");
        return this.getResultList(sqlQuery.toString(), "ListOrGroupWithOnlyOneOwnerMapping", parameters);
    }


    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getEmployeeBasic(java.lang.Long)
     */
    @Override
    public List<EmployeeBasicDTO> getEmployeeBasic(Long employeeId) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sql = new StringBuilder();
        sql.append(SELECT_SQL);
        sql.append("       employee_surname,");
        sql.append("       employee_name,");
        sql.append("       employee_surname_kana,");
        sql.append("       employee_name_kana,");
        sql.append("       email,");
        sql.append("       telephone_number,");
        sql.append("       cellphone_number,");
        sql.append("       departments.department_id,");
        sql.append("       departments.department_name,");
        sql.append("       departments.department_order,");
        sql.append("       positions.position_id,");
        sql.append("       positions.position_name,");
        sql.append("       positions.position_order ");
        sql.append(FROM_EMPLOYEE_SQL);
        sql.append("LEFT JOIN employees_departments");
        sql.append("       ON employees.employee_id = employees_departments.employee_id ");
        sql.append("LEFT JOIN departments");
        sql.append("       ON employees_departments.department_id = departments.department_id ");
        sql.append("LEFT JOIN positions");
        sql.append("       ON employees_departments.position_id = positions.position_id ");
        sql.append("WHERE employees.employee_id = :employeeId ");
        sql.append("ORDER BY ");
        sql.append("         positions.position_order ASC,");
        sql.append("         departments.department_order ASC");
        parameters.put("employeeId", employeeId);
        return this.getResultList(sql.toString(), "GetBasicEmployeeMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#getListMemberByOrganizationInfo(java.util.List,
     *      int)
     */
    @Override
    public List<DepartmentsGroupsMembersDTO> getListMemberByOrganizationInfo(List<Long> organizationIdsList,
            int organizationType) {
        StringBuilder sqlTotal = new StringBuilder();
        StringBuilder sqlSelect = new StringBuilder();
        StringBuilder sqlConditions = new StringBuilder();
        StringBuilder sqlJoin = new StringBuilder();

        Map<String, Object> params = new HashMap<>();

        sqlSelect.append("SELECT emp.employee_id  ");
        sqlSelect.append("     , emp.email ");
        sqlSelect.append("     , emp.employee_status ");
        sqlSelect.append("     , emp.employee_name ");
        sqlSelect.append("     , emp.employee_surname ");
        sqlSelect.append("     , TRIM(CONCAT(emp.employee_surname, ' ', emp.employee_name)) AS employee_full_name");
        sqlSelect.append("     , emp.photo_file_name ");
        sqlSelect.append("     , emp.photo_file_path ");
        sqlSelect.append("     , '' AS photo_file_url ");

        sqlJoin.append("FROM employees emp  ");

        sqlConditions.append("WHERE 1 = 1 ");
        sqlConditions.append(" AND emp.employee_status = 0 ");
        sqlConditions.append("  AND  ");

        if (organizationType == 0) {
            sqlSelect.append("     , ed.department_id AS org_id ");
            sqlJoin.append("LEFT JOIN employees_departments ed  ");
            sqlJoin.append("       ON emp.employee_id = ed.employee_id ");
            sqlConditions.append(" ed.department_id IN (:organizationIdsList) ");
        } else {
            sqlSelect.append("     , egm.group_id AS org_id ");
            sqlJoin.append("LEFT JOIN employees_group_members egm  ");
            sqlJoin.append("       ON emp.employee_id = egm.employee_id ");
            sqlConditions.append(" egm.group_id IN (:organizationIdsList) ");
        }

        params.put("organizationIdsList", organizationIdsList);
        sqlTotal.append(sqlSelect).append(sqlJoin).append(sqlConditions);

        return getResultList(sqlTotal.toString(), "DepartmentsGroupsMembersDTOMapping", params);
    }
}
