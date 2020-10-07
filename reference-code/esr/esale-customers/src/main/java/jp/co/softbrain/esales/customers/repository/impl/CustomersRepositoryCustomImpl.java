package jp.co.softbrain.esales.customers.repository.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.Query;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom;
import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersSupType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionResultSqlMappingDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType3DTO;
import jp.co.softbrain.esales.customers.service.dto.GetParentCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.InformationDetailsCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.SelectCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.mapper.KeyValueTypeMapper;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.QueryUtils;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType1DTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType2DTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * CustomersRepositoryCustomImpl
 *
 * @author nguyenductruong
 */
@XRayEnabled
@Repository
public class CustomersRepositoryCustomImpl extends RepositoryCustomUtils implements CustomersRepositoryCustom {

    public static final String TABLE_ALIAS = "customers";
    public static final String FORMAT_CUSTOMERS_PREFFIX = "customers.%s";
    public static final String CUSTOMER_DATA_COLUMN_NAME = "customer_data";
    private static final String CUSTOMER_IDS = "customerIds";
    private static final String FROM_CUSTOMERS = "FROM customers cus ";
    private static final String FROM_CUSTOMERS_NO_ALIAS = "FROM customers ";
    private static final String SELECT_CUSTOMER_ID = "SELECT cus.customer_id";
    private static final String SELECT_CUSTOMER_NAME = "     , cus.customer_name";
    private static final String SELECT_CUSTOMER_UPDATE_DATE = "     , cus.updated_date ";
    private static final String LEFT_JOIN_CUSTOMERS  = "LEFT JOIN customers p_customers";
    private static final String PARENT_CUSTOMER_NAME = "     , p_customers.customer_name as parent_customer_name ";
    private static final String ZIP_CODE = "     , cus.zip_code ";
    private static final String BUILDING = "     , cus.building ";
    private static final String ADDRESS = "     , cus.address ";
    private static final String ON_CUSTOMER_ID_EQUAL_PARENT_ID = "       ON p_customers.customer_id = cus.parent_id ";
    private static final String WHERE_1_EQUAL_1 = "WHERE 1 = 1 ";
    private static final String WHERE_1_EQUAL_0 = "WHERE 1 = 0 ";
    private static final String AND_CUSTOMER_ID_IN = "AND cus.customer_id IN (:customerIds) ";
    private static final int COLUMN_CUSTOMER_ID = 0;
    private static final String AND_CUSTOMER_DATA = "AND customer_data ->> '";

    @Autowired
    private QueryUtils queryUtils;

    @Autowired
    private KeyValueTypeMapper keyValueTypeMapper;

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomerInfo(java.lang.Long)
     */
    @Override
    public List<InitializeNetworkMapCustomerDTO> getCustomerInfo(Long customerId) {
        // Build SQL
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(SELECT_CUSTOMER_ID);
        sqlBuilder.append(SELECT_CUSTOMER_NAME);
        sqlBuilder.append("     , p_customer.customer_id AS parent_customer_id");
        sqlBuilder.append("     , p_customer.customer_name AS parent_customer_name");
        sqlBuilder.append("     , c_customer.customer_id AS child_customer_id");
        sqlBuilder.append("     , c_customer.customer_name AS child_customer_name ");
        sqlBuilder.append(FROM_CUSTOMERS);
        sqlBuilder.append("LEFT JOIN customers p_customer ");
        sqlBuilder.append("       ON cus.parent_id = p_customer.customer_id ");
        sqlBuilder.append("LEFT JOIN customers c_customer");
        sqlBuilder.append("       ON cus.customer_id = c_customer.parent_id ");
        sqlBuilder.append("WHERE cus.customer_id = :customerId");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        return this.getResultList(sqlBuilder.toString(), "InitializeNetworkMapCustomerDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getTableColumnName(java.lang.String)
     */
    @Override
    public List<String> getTableColumnName(String tableName) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT COLUMN_NAME ");
        sqlBuilder.append("FROM INFORMATION_SCHEMA.COLUMNS ");
        sqlBuilder.append("WHERE table_name = :tableName");
        Map<String, Object> params = new HashMap<>();
        params.put("tableName", tableName);
        return this.getResultList(sqlBuilder.toString(), params);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getInformationOfCustomer(java.lang.Long)
     */
    @Override
    public List<InformationDetailsCustomerDTO> getInformationDetailCustomer(List<Long> customerIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();

        sqlBuilder.append("SELECT customers.*  ");
        sqlBuilder.append("     , m_business.customer_business_name ");
        sqlBuilder.append("           AS business_main_name ");
        sqlBuilder.append("     , s_business.customer_business_name ");
        sqlBuilder.append("           AS business_sub_name ");
        sqlBuilder.append("     , CASE WHEN emp_created.employee_name IS NULL ");
        sqlBuilder.append("            THEN emp_created.employee_surname ");
        sqlBuilder.append("            ELSE CONCAT(emp_created.employee_surname, ' ', emp_created.employee_name) ");
        sqlBuilder.append("       END AS created_user_name ");
        sqlBuilder.append("     , emp_created.photo_file_path AS created_user_photo ");
        sqlBuilder.append("     , CASE WHEN emp_updated.employee_name IS NULL ");
        sqlBuilder.append("            THEN emp_updated.employee_surname ");
        sqlBuilder.append("            ELSE CONCAT(emp_updated.employee_surname, ' ', emp_updated.employee_name) ");
        sqlBuilder.append("       END AS updated_user_name ");
        sqlBuilder.append("     , emp_updated.photo_file_path AS updated_user_photo");
        sqlBuilder.append("     , p_customers.customer_id ");
        sqlBuilder.append("           AS parent_customer_id ");
        sqlBuilder.append("     , p_customers.customer_name ");
        sqlBuilder.append("           AS parent_customer_name ");
        sqlBuilder.append("     , CASE WHEN emp_incharge.employee_name IS NULL ");
        sqlBuilder.append("            THEN emp_incharge.employee_surname ");
        sqlBuilder.append("            ELSE CONCAT(emp_incharge.employee_surname, ' ', emp_incharge.employee_name) ");
        sqlBuilder.append("       END AS emp_incharge_name ");
        sqlBuilder.append("     , emp_incharge.photo_file_path AS emp_incharge_photo ");
        sqlBuilder.append("     , customers.url->>'url_text' AS url_text ");
        sqlBuilder.append("     , customers.url->>'url_target' AS url_target ");

        sqlBuilder.append(FROM_CUSTOMERS_NO_ALIAS);

        sqlBuilder.append("LEFT JOIN customers_business m_business ");
        sqlBuilder.append("       ON customers.business_main_id = m_business.customer_business_id ");

        sqlBuilder.append("LEFT JOIN customers_business s_business ");
        sqlBuilder.append("       ON customers.business_sub_id = s_business.customer_business_id ");

        sqlBuilder.append("LEFT JOIN employees_view emp_created");
        sqlBuilder.append("        ON customers.created_user = emp_created.employee_id ");

        sqlBuilder.append("LEFT JOIN employees_view emp_updated");
        sqlBuilder.append("        ON customers.updated_user = emp_updated.employee_id ");

        sqlBuilder.append("LEFT JOIN customers p_customers ");
        sqlBuilder.append("       ON customers.parent_id = p_customers.customer_id ");

        sqlBuilder.append("LEFT JOIN employees_view emp_incharge");
        sqlBuilder.append("        ON customers.employee_id = emp_incharge.employee_id ");

        if (!CollectionUtils.isEmpty(customerIds)) {
            sqlBuilder.append("WHERE customers.customer_id IN (:customerIds) ");
            parameters.put(CUSTOMER_IDS, customerIds);
        }
        return this.getResultList(sqlBuilder.toString(), "GetInformationOfCustomerMappingDTO", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getChildCustomers(java.lang.Long)
     */
    @Override
    public List<GetChildCustomersSupType1DTO> getChildCustomers(Long customerId) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();

        sqlBuilder.append("WITH RECURSIVE customers_tmp ");
        sqlBuilder.append("    AS ( ");
        sqlBuilder.append("        SELECT customer_id, customer_name, 0 as level, updated_date ");
        sqlBuilder.append("        FROM customers WHERE customer_id = :customerId ");
        sqlBuilder.append("        UNION ALL ");
        sqlBuilder.append("        SELECT cus.customer_id, cus.customer_name, tmp.level + 1 as level , cus.updated_date ");
        sqlBuilder.append("        FROM customers_tmp as tmp INNER JOIN customers as cus ON tmp.customer_id = cus.parent_id ");
        sqlBuilder.append("    ) ");
        sqlBuilder.append("SELECT * FROM customers_tmp ORDER BY level ");

        parameters.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        return this.getResultList(sqlBuilder.toString(), "GetChildCustomersOutMapping", parameters);

    }

    /*
     * @see
     * jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#
     * getInfoCustomers(java.lang.Integer, java.lang.Integer, java.util.List)
     */
    @Override
    public List<GetCustomersTabSubType3DTO> getInfoCustomers(Integer limit, Integer currentPage,
            List<GetCustomersTabSubType1DTO> searchConditions) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append(SELECT_CUSTOMER_ID);
        sqlBuilder.append(SELECT_CUSTOMER_NAME);
        sqlBuilder.append("     , cus.phone_number");
        sqlBuilder.append("     , cus.building");
        sqlBuilder.append("     , cus.address");
        sqlBuilder.append("     , cbm.customer_business_name as business_main_name");
        sqlBuilder.append("     , cbs.customer_business_name as business_sub_name");
        sqlBuilder.append("     , cus.created_date");
        sqlBuilder.append(SELECT_CUSTOMER_UPDATE_DATE);
        sqlBuilder.append(FROM_CUSTOMERS);
        sqlBuilder.append("LEFT JOIN customers_business cbm");
        sqlBuilder.append("       ON cus.business_main_id = cbm.customer_business_id ");
        sqlBuilder.append("LEFT JOIN customers_business cbs");
        sqlBuilder.append("       ON cus.business_sub_id = cbs.customer_business_id ");
        // TODO 2544 and 2542
        if (limit != null) {
            sqlBuilder.append(" LIMIT :limit ");
            parameters.put(ConstantsCustomers.LIMIT, limit);
        }
        if (currentPage != null) {
            sqlBuilder.append(" OFFSET :offset");
            parameters.put("offset", currentPage);
        }
        return this.getResultList(sqlBuilder.toString(), "GetInfoCustomersDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomerSuggestion(java.lang.String)
     */
    @Override
    public List<GetCustomerSuggestionResultSqlMappingDTO> getCustomerSuggestion(String keywords) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> params = new HashMap<>();
        int indexParam = 0;
        String keyword = null;
        if (!StringUtils.isEmpty(keywords)) {
            keyword = "%" + keywords.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
        }
        sqlBuilder.append(SELECT_CUSTOMER_ID);
        sqlBuilder.append(SELECT_CUSTOMER_NAME);
        sqlBuilder.append("     , cus.address");
        sqlBuilder.append("     , p_customers.customer_id as parent_customer_id");
        sqlBuilder.append("     , p_customers.customer_name as parent_customer_name");
        sqlBuilder.append(SELECT_CUSTOMER_UPDATE_DATE);
        sqlBuilder.append(FROM_CUSTOMERS);
        sqlBuilder.append(LEFT_JOIN_CUSTOMERS);
        sqlBuilder.append("       ON ( cus.parent_id = p_customers.customer_id ");
        if (!StringUtils.isEmpty(keyword)) {
            sqlBuilder.append("  AND   p_customers.customer_name LIKE :indexParam" + indexParam + "");
            params.put(Query.INDEX_PARAM + (indexParam++), keyword);
            sqlBuilder.append("          ) ");
            sqlBuilder.append("WHERE cus.customer_name LIKE :indexParam" + indexParam + "");
            params.put(Query.INDEX_PARAM + (indexParam++), keyword);
            sqlBuilder.append("  AND cus.customer_alias_name LIKE :indexParam" + indexParam + " ");
            params.put(Query.INDEX_PARAM + indexParam, keyword);
        } else {
            sqlBuilder.append("          ) ");
        }
        sqlBuilder.append("ORDER BY cus.customer_name ASC");

        return this.getResultList(sqlBuilder.toString(), "GetCustomerSuggestionResultSqlMapping", params);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#findByCustomerIdsAndSort(java.util.List,
     *      java.util.List)
     */
    @Override
    public List<Customers> findByCustomerIdsAndSort(List<Long> customerIds, List<KeyValue> orderBy) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> params = new HashMap<>();
        sql.append("SELECT * ");
        sql.append(FROM_CUSTOMERS_NO_ALIAS);
        sql.append("WHERE customers.customer_id IN ( :customerIds ) ");
        params.put(CUSTOMER_IDS, customerIds);
        if (orderBy == null || orderBy.isEmpty()) {
            return this.getResultList(sql.toString(), "CustomersEntityMapping", params);
        }
        sql.append("ORDER BY ");
        orderBy.forEach(sort ->
        sql.append(sort.getKey()).append(ConstantsCustomers.SPACE_SYMBOY).append(sort.getValue())
                .append(ConstantsCustomers.SPACE_SYMBOY)
                .append(ConstantsCustomers.COMMA_SYMBOY).append(ConstantsCustomers.SPACE_SYMBOY));
        sql.deleteCharAt(sql.lastIndexOf(ConstantsCustomers.COMMA_SYMBOY));
        return this.getResultList(sql.toString(), "CustomersEntityMapping", params);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomersByIds(java.util.List)
     */
    @Override
    public List<GetCustomersByIdsSubType1DTO> getCustomersByIds(List<Long> customerIds) {
        StringBuilder sqlBuilder = new StringBuilder();

        sqlBuilder.append(SELECT_CUSTOMER_ID);
        sqlBuilder.append("     , cus.photo_file_name ");
        sqlBuilder.append("     , cus.photo_file_path ");
        sqlBuilder.append(SELECT_CUSTOMER_NAME);
        sqlBuilder.append("     , cus.customer_alias_name ");
        sqlBuilder.append("     , p_customers.customer_id as parent_customer_id ");
        sqlBuilder.append(PARENT_CUSTOMER_NAME);
        sqlBuilder.append("     , cus.phone_number ");
        sqlBuilder.append(ZIP_CODE);
        sqlBuilder.append(BUILDING);
        sqlBuilder.append(ADDRESS);
        sqlBuilder.append("     , cus.business_main_id ");
        sqlBuilder.append("     , cus.business_sub_id ");
        sqlBuilder.append("     , cus.url ");
        sqlBuilder.append("     , cus.memo ");
        sqlBuilder.append("     , cus.customer_data ");
        sqlBuilder.append("     , cus.employee_id ");
        sqlBuilder.append("     , cus.department_id ");
        sqlBuilder.append("     , cus.group_id ");
        sqlBuilder.append("     , p_customers_business.customer_business_id AS parent_customer_business_id ");
        sqlBuilder.append("     , p_customers_business.customer_business_name AS parent_customer_business_name ");
        sqlBuilder.append("     , c_customers_business.customer_business_id AS child_customer_business_id ");
        sqlBuilder.append("     , c_customers_business.customer_business_name AS child_customer_business_name ");
        sqlBuilder.append(FROM_CUSTOMERS);

        sqlBuilder.append(LEFT_JOIN_CUSTOMERS);
        sqlBuilder.append(ON_CUSTOMER_ID_EQUAL_PARENT_ID);

        sqlBuilder.append("LEFT JOIN customers_business p_customers_business");
        sqlBuilder.append("       ON p_customers_business.customer_business_id = cus.business_main_id ");

        sqlBuilder.append("LEFT JOIN customers_business c_customers_business");
        sqlBuilder.append("       ON c_customers_business.customer_business_id = cus.business_sub_id ");

        sqlBuilder.append(WHERE_1_EQUAL_1);

        Map<String, Object> params = new HashMap<>();
        if (customerIds != null && !customerIds.isEmpty()) {
            sqlBuilder.append(AND_CUSTOMER_ID_IN);
            params.put(CUSTOMER_IDS, customerIds);
        }
        sqlBuilder.append("ORDER BY cus.customer_id ASC ");
        return this.getResultList(sqlBuilder.toString(), "GetCustomersByIdsMapping", params);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomersSuggestionByIds(java.util.List)
     */
    @Override
    public List<GetCustomersByIdsSubType1DTO> getCustomersSuggestionByIds(List<Long> customerIds, List<Long> groupId,
            List<Long> employeeId, List<Long> departmentId, Integer offset, Integer limit) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> params = new HashMap<>();
        sqlBuilder.append("SELECT cus.customer_id, ");
        sqlBuilder.append("cus.customer_name, ");
        sqlBuilder.append("cus.customer_alias_name, ");
        sqlBuilder.append("cus.parent_id as parent_customer_id, ");
        sqlBuilder.append("p_customers.customer_name as parent_customer_name, ");
        sqlBuilder.append("cus.photo_file_name, ");
        sqlBuilder.append("cus.photo_file_path, ");
        sqlBuilder.append("cus.phone_number, ");
        sqlBuilder.append("cus.zip_code, ");
        sqlBuilder.append("cus.building, ");
        sqlBuilder.append("cus.address, ");
        sqlBuilder.append("cus.business_main_id, ");
        sqlBuilder.append("cus.business_sub_id, ");
        sqlBuilder.append("cus.url, ");
        sqlBuilder.append("cus.employee_id, ");
        sqlBuilder.append("cus.department_id, ");
        sqlBuilder.append("cus.group_id, ");
        sqlBuilder.append("cus.scenario_id, ");
        sqlBuilder.append("cus.customer_data, ");
        sqlBuilder.append("cus.memo, ");
        sqlBuilder.append("cus.longitude, ");
        sqlBuilder.append("cus.latitude, ");
        sqlBuilder.append("cus.created_date, ");
        sqlBuilder.append("cus.created_user, ");
        sqlBuilder.append("cus.updated_date, ");
        sqlBuilder.append("cus.updated_user, ");
        sqlBuilder.append("cus.parent_tree ");
        sqlBuilder.append(FROM_CUSTOMERS);
        sqlBuilder.append(LEFT_JOIN_CUSTOMERS);
        sqlBuilder.append(ON_CUSTOMER_ID_EQUAL_PARENT_ID);

        boolean isCheck = customerIds.isEmpty() && employeeId.isEmpty() && groupId.isEmpty() && departmentId.isEmpty();
        if (isCheck) {
            sqlBuilder.append(WHERE_1_EQUAL_0);
        } else {
            sqlBuilder.append(WHERE_1_EQUAL_1);
            sqlBuilder.append(" AND (");
            StringBuilder customerIdCondition = new StringBuilder();
            if (!customerIds.isEmpty()) {
                customerIdCondition.append(" OR cus.customer_id IN (:customerIds) ");
                params.put(CUSTOMER_IDS, customerIds);
            }
            StringBuilder employeeIdCondition = new StringBuilder();
            if (!employeeId.isEmpty()) {
                employeeIdCondition.append(" OR cus.employee_id IN (:employeeIds)");
                params.put("employeeIds", employeeId);
            }
            StringBuilder groupIdCondition = new StringBuilder();
            if (!groupId.isEmpty()) {
                groupIdCondition.append(" OR cus.group_id IN (:groupIds)");
                params.put("groupIds", groupId);
            }
            StringBuilder departmentIdCondition = new StringBuilder();
            if (!departmentId.isEmpty()) {
                departmentIdCondition.append(" OR cus.department_id IN (:departmentIds)");
                params.put("departmentIds", departmentId);
            }
            StringBuilder orConditions = new StringBuilder();
            orConditions.append(customerIdCondition).append(employeeIdCondition).append(groupIdCondition)
                    .append(departmentIdCondition);
            sqlBuilder.append(orConditions.toString().replaceFirst("OR", "")).append(") ");

        }

        sqlBuilder.append("ORDER BY cus.customer_name ASC ");
        sqlBuilder.append("OFFSET :offset ");
        params.put(ConstantsCustomers.OFFSET, offset);
        sqlBuilder.append("LIMIT :limit ");
        params.put(ConstantsCustomers.LIMIT, limit);
        return this.getResultList(sqlBuilder.toString(), "GetCustomersSuggestionByIdsMapping", params);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomerIdByFieldName(java.lang.String,
     *      java.util.List)
     */
    @Override
    public List<Long> getCustomerIdsByFieldName(String fieldName, List<Long> fieldValue) {
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append(" SELECT cus.customer_id ");
        sqlQuery.append(FROM_CUSTOMERS);
        sqlQuery.append("WHERE cus." + fieldName + " IN (:fieldValue) ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("fieldValue", fieldValue);
        return this.getResultList(sqlQuery.toString(), parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getParentCustomers(java.util.List)
     */
    @Override
    public List<GetParentCustomersDTO> getParentCustomers(List<Long> customerIds) {
        StringBuilder sql = new StringBuilder();
        sql.append("WITH RECURSIVE customers_tmp ");
        sql.append(" (  customer_id, path_tree_name, parent_id, child_id, path_tree_id ) AS ( ");
        sql.append("    SELECT ");
        sql.append("        customer_id, ");
        sql.append("        ARRAY [ customer_name ], ");
        sql.append("        parent_id, ");
        sql.append("        customer_id, ");
        sql.append("        ARRAY [ customer_id ] ");
        sql.append("    FROM ");
        sql.append("        customers ");
        sql.append("    WHERE ");
        sql.append("        customer_id IN [<parameter customerIds>] ");
        sql.append("    UNION ALL ");
        sql.append("    SELECT ");
        sql.append("        cus.customer_id, ");
        sql.append("        ( ARRAY [ cus.customer_name ] || cus_tmp.path_tree_name ) :: VARCHAR ( 100 ) [], ");
        sql.append("        cus.parent_id, ");
        sql.append("        cus_tmp.child_id, ");
        sql.append("        ARRAY [ cus.customer_id ] || cus_tmp.path_tree_id ");
        sql.append("    FROM ");
        sql.append("        customers_tmp AS cus_tmp, ");
        sql.append("    INNER JOIN customers AS cus ");
        sql.append("            ON cus_tmp.parent_id = cus.customer_id ");
        sql.append(" )         ");
        sql.append("SELECT         ");
        sql.append("    child_id as customer_id,     ");
        sql.append("    path_tree_name,     ");
        sql.append("    path_tree_id     ");
        sql.append("FROM         ");
        sql.append("    customers_tmp ");
        sql.append("WHERE         ");
        sql.append("    parent_id IS NULL OR parent_id = 0 ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCustomers.CUSTOMER_IDS, customerIds);
        return getResultList(sql.toString(), "GetParentCustomersDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomersIdsCreatedRelation(java.util.List,
     *      jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO)
     */
    @Override
    public List<Long> getCustomersIdsCreatedRelation(List<Long> customerIds, CustomFieldsInfoOutDTO firstField) {
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append("SELECT customer_id ");
        sqlQuery.append(FROM_CUSTOMERS_NO_ALIAS);
        sqlQuery.append("WHERE customer_id IN (:customerIds) ");
        if (!Boolean.TRUE.equals(firstField.getIsDefault())) {
            sqlQuery.append(AND_CUSTOMER_DATA + firstField.getFieldName() + "' IS NOT NULL ");
            sqlQuery.append(AND_CUSTOMER_DATA + firstField.getFieldName() + "' != '[]' ");
        } else {
            sqlQuery.append("AND " + firstField.getFieldName() + " IS NOT NULL ");
            sqlQuery.append("AND " + firstField.getFieldName() + " != '[]' ");
        }
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCustomers.CUSTOMER_IDS, customerIds);
        List<Long> listEmployeeId = new ArrayList<>();
        List<BigInteger> listOutput = this.getResultList(sqlQuery.toString(), parameters);
        if (listOutput != null && !listOutput.isEmpty()) {
            listOutput.forEach(idOutput -> listEmployeeId.add(idOutput.longValue()));
        }
        return listEmployeeId;
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCalculatorFormular(java.lang.Integer)
     */
    @Override
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("fieldBelong", fieldBelong);
        parameters.put("fieldType", FieldTypeEnum.CALCULATION.getCode());
        return this.getResultList(queryUtils.getCalculatorFormularQuery(), "CalculatorFormularDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCountTotalCustomers(jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO)
     */
    @SuppressWarnings("unchecked")
    @Override
    public int getCountTotalCustomers(CustomersSearchConditionsDTO searchConditionsDto) {
        Map<String, Object> sqlMap = buildSqlMap(searchConditionsDto, true);
        Object count = this.getSingleResult(sqlMap.get(Query.QUERY_STRING).toString(),
                (Map<String, Object>) sqlMap.get(Query.PARAMETERS));
        return (count == null ? 0 : Integer.valueOf(count.toString()));
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomers(jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO)
     */
    @SuppressWarnings("unchecked")
    @Override
    public List<SelectCustomersDTO> getCustomers(CustomersSearchConditionsDTO input) {
        Map<String, Object> sqlMap = buildSqlMap(input, false);
        return this.getResultList(sqlMap.get(Query.QUERY_STRING).toString(), "SelectCustomersDTOMapping",
                (Map<String, Object>) sqlMap.get(Query.PARAMETERS));
    }

    /**
     * @param searchConditionsDto
     * @param isCount
     * @return
     */
    private Map<String, Object> buildSqlMap(CustomersSearchConditionsDTO input, boolean isCount) {
        Map<String, Object> params = new HashMap<>();
        input.setIndexParam(0);
        int indexParam = input.getIndexParam();
        StringBuilder sqlTotal = new StringBuilder();
        StringBuilder sqlSelect = new StringBuilder();
        StringBuilder sqlJoin = new StringBuilder();
        StringBuilder sqlCondition = new StringBuilder();

        sqlSelect.append("SELECT customers.* ");
        sqlSelect.append("     , concat(COALESCE(customers.zip_code, ''), ");
        sqlSelect.append("              COALESCE(customers.address, ''), ");
        sqlSelect.append("              COALESCE(customers.building, '')) ");
        sqlSelect.append("       AS customer_address ");
        sqlSelect.append("     , m_business.customer_business_name ");
        sqlSelect.append("           AS business_main_name ");
        sqlSelect.append("     , s_business.customer_business_name ");
        sqlSelect.append("           AS business_sub_name ");
        sqlSelect.append("     , CASE WHEN emp_created.employee_name IS NULL ");
        sqlSelect.append("            THEN emp_created.employee_surname ");
        sqlSelect.append("            ELSE CONCAT(emp_created.employee_surname, ' ', emp_created.employee_name) ");
        sqlSelect.append("       END AS created_user_name ");
        sqlSelect.append("     , emp_created.photo_file_path AS created_user_photo ");
        sqlSelect.append("     , CASE WHEN emp_updated.employee_name IS NULL ");
        sqlSelect.append("            THEN emp_updated.employee_surname ");
        sqlSelect.append("            ELSE CONCAT(emp_updated.employee_surname, ' ', emp_updated.employee_name) ");
        sqlSelect.append("       END AS updated_user_name ");
        sqlSelect.append("     , emp_updated.photo_file_path AS updated_user_photo");
        sqlSelect.append("     , p_customers.customer_id ");
        sqlSelect.append("           AS parent_customer_id ");
        sqlSelect.append("     , p_customers.customer_name ");
        sqlSelect.append("           AS parent_customer_name ");

        sqlJoin.append("  FROM customers  ");

        sqlJoin.append("LEFT JOIN employees_view emp_created");
        sqlJoin.append("        ON customers.created_user = emp_created.employee_id ");

        sqlJoin.append("LEFT JOIN customers_business m_business ");
        sqlJoin.append("       ON customers.business_main_id = m_business.customer_business_id ");

        sqlJoin.append("LEFT JOIN customers_business s_business ");
        sqlJoin.append("       ON customers.business_sub_id = s_business.customer_business_id ");

        sqlJoin.append("LEFT JOIN employees_view emp_updated");
        sqlJoin.append("        ON customers.updated_user = emp_updated.employee_id ");

        sqlJoin.append("LEFT JOIN customers p_customers ");
        sqlJoin.append("       ON customers.parent_id = p_customers.customer_id ");

        // build sql conditions
        sqlCondition.append(" WHERE 1 = 1 ");
        if (CollectionUtils.isEmpty(input.getElasticSearchResultIds()) || !input.isTrueCondition()) {
            sqlCondition.append(" AND FALSE ");
        } else {
            sqlCondition.append(queryUtils.buildIdCondition(input.getElasticSearchResultIds(),
                    TABLE_ALIAS.concat(".").concat(ConstantsCustomers.CUSTOMER_COLUMN_ID), true));
        }

        // build selected target id search
        if (input.getSelectedTargetType() > 1) {
            sqlJoin.append("INNER JOIN customers_list_members clm ");
            sqlJoin.append("        ON customers.customer_id = clm.customer_id ");
            sqlJoin.append("INNER JOIN customers_list cl ");
            sqlJoin.append("        ON clm.customer_list_id = cl.customer_list_id ");
        }
        // build sql condititon
        input.setIndexParam(indexParam);
        buildSqlConditions(input, sqlCondition, params);

        return buildSqlComplete(input, sqlTotal, sqlSelect, sqlJoin, sqlCondition, isCount, params);
    }

    /**
     * @param input
     * @param sqlCondition
     * @param params
     */
    @SuppressWarnings("unchecked")
    private void buildSqlConditions(CustomersSearchConditionsDTO input, StringBuilder sqlCondition,
            Map<String, Object> params) {
        int indexParam = input.getIndexParam();

        // build person incharge
        if (input.isSearchNonPersonInCharge()) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append(" ( ( customers.employee_id IS NULL OR customers.employee_id = 0 ) ");
            sqlCondition.append(" AND ( customers.department_id IS NULL OR customers.department_id = 0 ) ");
            sqlCondition.append(" AND ( customers.group_id IS NULL OR customers.group_id = 0 ) ");
            sqlCondition.append(" ) ");
        } else {
            input.setIndexParam(indexParam);
            buildQuerySearchPersonInCharge(input, params, sqlCondition);

        }
        indexParam = input.getIndexParam();

        // build search created user
        if (!CollectionUtils.isEmpty(input.getEmployeesCreated())) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append("customers.created_user IN (:").append(Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            params.put(Query.INDEX_PARAM + indexParam++, input.getEmployeesCreated());
        } else if (input.isSearchCreatedUser()) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append(" customers.created_user IS NULL ");
        }

        // build search updated user
        if (!CollectionUtils.isEmpty(input.getEmployeesUpdated())) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append("customers.updated_user IN (:").append(Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            params.put(Query.INDEX_PARAM + indexParam++, input.getEmployeesUpdated());
        } else if (input.isSearchUpdatedUser()) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append(" customers.updated_user IS NULL ");
        }

        // build search scenario
        if (input.isSearchNullScenarioId()) {
            sqlCondition.append(ConstantsCustomers.AND).append("customer.scenario_id IS NULL ");
        }

        // build search business
        if (!CollectionUtils.isEmpty(input.getBusinessIds())) {
            sqlCondition.append(ConstantsCustomers.AND).append(ConstantsCustomers.OPEN_BRACKET);

            sqlCondition.append("customers.business_main_id IN (:").append(Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            params.put(Query.INDEX_PARAM + indexParam++, input.getBusinessIds());

            sqlCondition.append(ConstantsCustomers.OR);

            sqlCondition.append("customers.business_sub_id IN (:").append(Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            params.put(Query.INDEX_PARAM + indexParam++, input.getBusinessIds());

            sqlCondition.append(ConstantsCustomers.CLOSE_BRACKET);
        } else if (input.isSearchNonBussiness()) {
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append(" customers.business_main_id IS NULL ");
            sqlCondition.append(ConstantsCustomers.AND);
            sqlCondition.append(" customers.business_sub_id IS NULL ");
        }

        if (input.getSelectedTargetType() > 1) {
            sqlCondition.append(" AND cl.customer_list_id =:").append(Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.SPACE_SYMBOY);
            params.put(Query.INDEX_PARAM + indexParam++, input.getSelectedTargetId());

        }

        // build search businessMain
        if (input.getSearchBusinessMain() != null) {
            sqlCondition.append(" AND customers.business_main_id IN ( " + input.getSearchBusinessMain() + " ) ");
        } else if (input.isSearchNonBusinessMain()) {
            sqlCondition.append(" AND customers.business_main_id IS NULL ");
        }

        // build search businessSub
        if (input.getSearchBusinessSub() != null) {
            sqlCondition.append(" AND customers.business_sub_id IN ( " + input.getSearchBusinessSub() + " ) ");
        } else if (input.isSearchNonBusinessSub()) {
            sqlCondition.append(" AND customers.business_sub_id IS NULL ");
        }

        Map<String, Object> conditionMap = queryUtils.buildCondition(input.getSearchConditions(), TABLE_ALIAS,
                CUSTOMER_DATA_COLUMN_NAME, indexParam, input.getOptionMap());
        sqlCondition.append(conditionMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) conditionMap.get(Query.PARAMETERS));
        indexParam = (int) conditionMap.get(Query.INDEX_PARAM);

        // build filter condition
        Map<String, Object> filterMap = queryUtils.buildCondition(input.getFilterConditions(), TABLE_ALIAS,
                CUSTOMER_DATA_COLUMN_NAME, indexParam, input.getOptionMap());
        sqlCondition.append(filterMap.get(Query.CONDITIONS));
        params.putAll((Map<String, Object>) filterMap.get(Query.PARAMETERS));
        indexParam = (int) filterMap.get(Query.INDEX_PARAM);

        input.setIndexParam(indexParam);
    }


    /**
     * @param input
     * @param sqlMap
     * @param sqlSelect
     * @param sqlCondition
     * @param sqlJoin
     * @param isCount
     * @param params
     * @return
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> buildSqlComplete(CustomersSearchConditionsDTO input, StringBuilder sqlTotal,
            StringBuilder sqlSelect, StringBuilder sqlJoin, StringBuilder sqlCondition, boolean isCount,
            Map<String, Object> params) {
        Map<String, Object> sqlMap = new HashMap<>();

        StringBuilder sqlGroup = new StringBuilder();
        sqlGroup.append(" GROUP BY  ");
        sqlGroup.append("    customers.customer_id, ");
        sqlGroup.append("    m_business.customer_business_id, ");
        sqlGroup.append("    s_business.customer_business_id, ");
        sqlGroup.append("    created_user_name, ");
        sqlGroup.append("    created_user_photo, ");
        sqlGroup.append("    updated_user_name, ");
        sqlGroup.append("    updated_user_photo, ");
        sqlGroup.append("    p_customers.customer_id ");

        StringBuilder sqlOrder = new StringBuilder();

        if (isCount) {
            sqlTotal.append(buildLastQuery(input, sqlSelect, sqlJoin, sqlCondition, sqlOrder, sqlGroup, isCount));
            sqlMap.put(Query.QUERY_STRING, sqlTotal);
            sqlMap.put(Query.PARAMETERS, params);
            return sqlMap;
        }

        input.getListOrders()
                .removeIf(order -> StringUtils.isBlank(order.getKey())
                        || (ConstantsCustomers.SORT_TYPE_ASC.equalsIgnoreCase(order.getValue())
                                && ConstantsCustomers.SORT_TYPE_DESC.equalsIgnoreCase(order.getValue())));
        sqlOrder.append(" ORDER BY ");
        if (CollectionUtils.isEmpty(input.getListOrders())) {
            sqlOrder.append(" customer_id DESC , COALESCE(NULLIF(customer_name, '')) ASC ");
        } else {
            updateOrderByList(input, sqlOrder);
            Map<String, Object> orderMap = queryUtils.buildOrder(input.getListOrders(),
                    input.getOptionMap());

            if (orderMap.get(Query.QUERY_SELECT).toString().length() > 0) {
                sqlSelect.append(orderMap.get(Query.QUERY_SELECT).toString());
            }

            sqlJoin.append(orderMap.get(Query.QUERY_JOIN).toString().replace(CUSTOMER_DATA_COLUMN_NAME,
                    String.format(FORMAT_CUSTOMERS_PREFFIX, CUSTOMER_DATA_COLUMN_NAME)));
            sqlOrder.append(orderMap.get(Query.QUERY_ORDERBY).toString().replace("ORDER BY", ""));
        }
        sqlTotal.append(buildLastQuery(input, sqlSelect, sqlJoin, sqlCondition, sqlOrder, sqlGroup, isCount));

        // build offset, limit
        if (input.getOffset() != null && input.getLimit() != null) {
            Map<String, Object> offsetMap = queryUtils.buildOffsetLimit(input.getOffset(), input.getLimit(),
                    input.getIndexParam());

            sqlTotal.append(offsetMap.get(Query.OFFSET_LIMIT));
            params.putAll((Map<String, Object>) offsetMap.get(Query.PARAMETERS));
        }
        sqlMap.put(Query.QUERY_STRING, sqlTotal);
        sqlMap.put(Query.PARAMETERS, params);
        return sqlMap;
    }

    /**
     * buildLastQuery
     *
     * @param input
     * @param sqlJoin
     * @param sqlSelect
     * @param groupBy
     * @param sqlCondition
     * @param sqlOrder
     * @param outSideSqlGroup
     * @param sqlJoin2
     * @return
     */
    private StringBuilder buildLastQuery(CustomersSearchConditionsDTO input,
            StringBuilder sqlSelect, StringBuilder sqlJoin, StringBuilder sqlCondition, StringBuilder sqlOrder,
            StringBuilder sqlGroup, boolean isCount) {
        StringBuilder sqlTotal = new StringBuilder();

        sqlTotal.append("WITH ");

        // if sort schedule
        if (input.isSortSchedules()) {
            sqlTotal.append(" tmp_schedules AS ( ");
            sqlTotal.append("   SELECT sc.customer_id ");
            sqlTotal.append("        , sc.schedule_name ");
            sqlTotal.append("        , cal.start_date ");
            sqlTotal.append("   FROM schedules_view sc ");
            sqlTotal.append("     INNER JOIN calendars_view cal ");
            sqlTotal.append("        ON sc.calendar_id = cal.calendar_id ");
            sqlTotal.append("   WHERE cal.start_date IS NOT NUll ");
            sqlTotal.append("     AND cal.start_date > now() ");
            sqlTotal.append("   ORDER BY cal.start_date ASC ");
            sqlTotal.append(" ), ");

            sqlSelect.append("     , array_to_string(ARRAY_AGG( (sc.schedule_name) ORDER BY sc.start_date), ',') ");
            sqlSelect.append("           AS schedule_next ");

            sqlJoin.append(" LEFT JOIN tmp_schedules sc ");
            sqlJoin.append("       ON customers.customer_id = sc.customer_id ");

        } else {
            sqlSelect.append(" , '' AS schedule_next ");
        }

        // if sort task
        if (input.isSortTask()) {
            sqlTotal.append(" tmp_tasks AS ( ");
            sqlTotal.append("   SELECT tv.customer_id ");
            sqlTotal.append("        , tv.task_name ");
            sqlTotal.append("        , cal.start_date ");
            sqlTotal.append("   FROM tasks_view tv ");
            sqlTotal.append("     INNER JOIN calendars_view cal ");
            sqlTotal.append("        ON tv.calendar_id = cal.calendar_id ");
            sqlTotal.append("   WHERE cal.start_date IS NOT NUll ");
            sqlTotal.append("     AND cal.start_date > now() ");
            sqlTotal.append("   ORDER BY cal.start_date ASC ");
            sqlTotal.append(" ), ");

            sqlSelect.append("     , array_to_string(ARRAY_AGG( (tv.task_name) ORDER BY tv.start_date ), ',') ");
            sqlSelect.append("           AS action_next ");

            sqlJoin.append(" LEFT JOIN tmp_tasks tv ");
            sqlJoin.append("       ON customers.customer_id = tv.customer_id ");

        } else {
            sqlSelect.append(" , '' AS action_next ");
        }

        sqlTotal.append("    tmp_customers AS ( ");
        sqlTotal.append(sqlSelect);
        sqlTotal.append(sqlJoin);
        sqlTotal.append(sqlCondition);
        sqlTotal.append(sqlGroup);
        sqlTotal.append("    ),   ");

        if (input.isDisplayCutomerChilds()) {
            sqlTotal.append("    tmp_customers_child_all  AS ( ");
            sqlTotal.append(sqlSelect);
            sqlTotal.append(sqlJoin);
            sqlTotal.append(sqlGroup);
            sqlTotal.append("    ), ");
            sqlTotal.append("    tmp_customers_child  AS ( ");
            sqlTotal.append("       SELECT c_customers.* ");
            sqlTotal.append("       FROM tmp_customers_child_all AS c_customers ");
            sqlTotal.append("       INNER JOIN tmp_customers AS p_customers ");
            sqlTotal.append("             ON p_customers.customer_id ");
            sqlTotal.append("                 IN (select jsonb_array_elements(c_customers.parent_tree)\\:\\:BIGINT) ");
            sqlTotal.append("       WHERE c_customers.customer_id NOT IN (SELECT customer_id FROM tmp_customers) ");
            sqlTotal.append("    ), ");
        }

        sqlTotal.append("    tmp_customers_all AS ( ");
        sqlTotal.append("       SELECT * FROM tmp_customers ");

        if (input.isDisplayCutomerChilds()) {
            sqlTotal.append("       UNION ALL ");
            sqlTotal.append("       SELECT DISTINCT ON (customer_id) * FROM tmp_customers_child ) ");
        } else {
            sqlTotal.append(" ) ");
        }

        StringBuilder beyondConditions = new StringBuilder();
        beyondConditions.append(" WHERE 1 = 1 ");

        if (isCount) {
            sqlTotal.append(" SELECT COUNT(*) FROM  tmp_customers_all AS TBL ");
            sqlTotal.append(beyondConditions);
        } else {
            sqlTotal.append(" SELECT * FROM tmp_customers_all ");
            sqlTotal.append(beyondConditions);
            sqlTotal.append(input.getSqlOutSideGroup());

            buildExtendsSqlOrder(input, sqlOrder);

            sqlTotal.append(sqlOrder);
        }
        return sqlTotal;
    }

    /**
     * build extend sql order for get customers
     *
     * @param input - iput
     * @param sqlOrder - sql order
     */
    private void buildExtendsSqlOrder(CustomersSearchConditionsDTO input, StringBuilder sqlOrder) {
        if (input.isSortSchedules()) {
            appendOrderForFieldCanNull(sqlOrder, "schedule_next ", null, input.getSchedulesSortType());
        }
        if (input.isSortTask()) {
            appendOrderForFieldCanNull(sqlOrder, "action_next ", null, input.getTaskSortType());
        }
        if (StringUtils.isNotBlank(input.getSortUrlType())) {
            appendOrderForFieldCanNull(sqlOrder, " CONCAT(url->>'url_text', url->>'url_target') ", null,
                    input.getSortUrlType());
        }

    }

    /**
     * append order by for field can null
     *
     * @param sqlOrder - sql to append condition
     * @param fieldName - field name to sort
     * @param valueReplace
     * @param sortType
     */
    private void appendOrderForFieldCanNull(StringBuilder sqlOrder, String fieldName, String valueReplace,
            String sortType) {
        if (sqlOrder.toString().contains(ConstantsCustomers.SORT_TYPE_ASC)
                || sqlOrder.toString().contains(ConstantsCustomers.SORT_TYPE_DESC)) {
            sqlOrder.append(ConstantsCustomers.COMMA_BETWEEN_SPACE);
        } else {
            sqlOrder.append(ConstantsCustomers.SPACE_SYMBOY);
        }
        sqlOrder.append(" COALESCE( " + fieldName + ConstantsCustomers.COMMA_BETWEEN_SPACE);
        if (StringUtils.isEmpty(valueReplace)) {
            sqlOrder.append("''");
        } else {
            sqlOrder.append(valueReplace);
        }
        sqlOrder.append(ConstantsCustomers.CLOSE_BRACKET);
        sqlOrder.append(sortType).append(ConstantsCustomers.SPACE_SYMBOY);
    }

    /**
     * @param input
     * @param sqlOrder
     */
    private void updateOrderByList(CustomersSearchConditionsDTO input, StringBuilder sqlOrder) {
        List<KeyValue> orderSpecial = new ArrayList<>();
        List<String> orderToRemove = new ArrayList<>();
        input.getListOrders()
                .removeIf(item -> StringUtils.isBlank(item.getKey()));
        boolean isSortBusiness = false;
        String sortTypeBusiness = "";
        for (KeyValue order : input.getListOrders()) {
            order.setKey(order.getKey().replace(ConstantsCustomers.DOT_KEYWORD, ""));
            if (ConstantsCustomers.SORT_TYPE_ASC.equalsIgnoreCase(order.getValue())
                    || ConstantsCustomers.SORT_TYPE_DESC.equalsIgnoreCase(order.getValue())) {
                order.setValue(order.getValue().toUpperCase());
            }
            switch (order.getKey()) {
            case ConstantsCustomers.COLUMN_SCHEDULE_NEXT:
                orderToRemove.add(order.getKey());
                input.setSortSchedules(true);
                input.setSchedulesSortType(order.getValue());
                break;
            case ConstantsCustomers.COLUMN_ACTION_NEXT:
                orderToRemove.add(order.getKey());
                input.setSortTask(true);
                input.setTaskSortType(order.getValue());
                break;
            case ConstantsCustomers.COLUMN_CREATED_DATE:
                KeyValue sortCreatedDate = keyValueTypeMapper.cloneKV(order);
                sortCreatedDate.setKey("created_date");
                orderSpecial.add(sortCreatedDate);
                orderToRemove.add(order.getKey());
                break;
            case ConstantsCustomers.COLUMN_UPDATED_DATE:
                KeyValue sortUpdateDate = keyValueTypeMapper.cloneKV(order);
                sortUpdateDate.setKey("updated_date");
                orderSpecial.add(sortUpdateDate);
                orderToRemove.add(order.getKey());
                break;
            case ConstantsCustomers.COLUMN_CREATED_USER:
                KeyValue sortCreatedUser = keyValueTypeMapper.cloneKV(order);
                sortCreatedUser.setKey("created_user_name");
                orderSpecial.add(sortCreatedUser);
                orderToRemove.add(order.getKey());
                break;
            case ConstantsCustomers.COLUMN_UPDATED_USER:
                KeyValue sortUpdatedUser = keyValueTypeMapper.cloneKV(order);
                sortUpdatedUser.setKey("updated_user_name");
                orderSpecial.add(sortUpdatedUser);
                orderToRemove.add(order.getKey());
                break;
            case ConstantsCustomers.COLUMN_CUSTOMER_PARENT:
                order.setKey("parent_customer_name");
                break;
            case ConstantsCustomers.COLUMN_BUSINESS:
                order.setKey("business_main_name");
                isSortBusiness = true;
                sortTypeBusiness = order.getValue();
                break;
            case ConstantsCustomers.FIELD_URL:
                orderToRemove.add(order.getKey());
                input.setSortUrlType(order.getValue());
                break;
            default:
                break;
            }
        }
        if (isSortBusiness) {
            KeyValue businessSubSort = new KeyValue();
            businessSubSort.setKey("business_sub_name");
            businessSubSort.setValue(sortTypeBusiness);
            input.getListOrders().add(businessSubSort);
        }
        input.getListOrders().removeIf(item -> orderToRemove.contains(item.getKey()));
        // build orderBy special column
        if(!orderSpecial.isEmpty()) {
            List<String> orderQuerySpecial = new ArrayList<>();
            for (KeyValue od : orderSpecial) {
                orderQuerySpecial.add(ConstantsCustomers.SPACE_SYMBOY + od.getKey() + " " + od.getValue() + " ");
            }
            sqlOrder.append(String.join(ConstantsCustomers.COMMA_SYMBOY, orderQuerySpecial));
        }
    }


    /**
     * @param input
     * @param params
     * @param sqlCondition
     * @return
     */
    private void buildQuerySearchPersonInCharge(CustomersSearchConditionsDTO input, Map<String, Object> params,
            StringBuilder sqlCondition) {
        if (!input.isSearchPersonInCharge()) {
            return;
        }
        int indexParam = input.getIndexParam();
        StringBuilder sqlBuff = new StringBuilder();
        List<String> listSearch = new ArrayList<>();

        if (!input.getEmployeeIds().isEmpty()) {
            sqlBuff.setLength(0);
            sqlBuff.append(" customers.employee_id IN (:").append(Constants.Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            listSearch.add(sqlBuff.toString());
            params.put(Constants.Query.INDEX_PARAM + indexParam++, input.getEmployeeIds());
        }
        if (!input.getDepartmentIds().isEmpty()) {
            sqlBuff.setLength(0);
            sqlBuff.append(" customers.department_id IN (:").append(Constants.Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            listSearch.add(sqlBuff.toString());
            params.put(Constants.Query.INDEX_PARAM + indexParam++, input.getDepartmentIds());
        }
        if (!input.getGroupIds().isEmpty()) {
            sqlBuff.setLength(0);
            sqlBuff.append(" customers.group_id IN (:").append(Constants.Query.INDEX_PARAM).append(indexParam)
                    .append(ConstantsCustomers.CLOSE_BRACKET);
            listSearch.add(sqlBuff.toString());
            params.put(Constants.Query.INDEX_PARAM + indexParam++, input.getGroupIds());
        }
        input.setIndexParam(indexParam);
        if (!listSearch.isEmpty()) {
            sqlCondition.append(ConstantsCustomers.AND).append(String.format(ConstantsCustomers.ELEMENT_BETWEEN_BRACKET,
                    String.join(ConstantsCustomers.OR, listSearch)));
        }
    }

    /**
     * (non-Javadoc)
     *
     * @see jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom#
     *      getAllCalculatorFormular(java.lang.Integer)
     */
    @Override
    public List<CalculatorFormularDTO> getAllCalculatorFormular(Integer fieldBelong) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("fieldBelong", fieldBelong);
        parameters.put("fieldType", FieldTypeEnum.CALCULATION.getCode());
        return this.getResultList(queryUtils.getAllCalculatorFormularQuery(), "AllCalculatorFormularDTOMapping",
                parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom#getCustomerFieldsByRecordIds(java.util.List,
     *      java.util.List)
     */
    @Override
    public List<GetDataByRecordIdsSubType1DTO> getCustomerFieldsByRecordIds(List<Long> recordIds,
            List<GetDataByRecordIdsInDTO> lstFieldInfo) {
        List<GetDataByRecordIdsSubType1DTO> relationDatas = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT customer_id AS recordId ");
        for (int i = 0; i < lstFieldInfo.size(); i++) {
            String fieldName = lstFieldInfo.get(i).getFieldName();
            if (Boolean.TRUE.equals(lstFieldInfo.get(i).getIsDefault())) {
                sql.append(" ," + fieldName + " AS " + fieldName + " ");
            } else {
                sql.append(" , customer_data->> '" + fieldName + "' AS " + fieldName + " ");
            }
        }
        sql.append(FROM_CUSTOMERS_NO_ALIAS);
        sql.append("WHERE customer_id IN (:customerIds)");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(CUSTOMER_IDS, recordIds);
        List<Object[]> lstObject = getResultList(sql.toString(), parameters);

        lstObject.forEach(row -> {
            if (row == null) {
                return;
            }
            GetDataByRecordIdsSubType1DTO relationData = new GetDataByRecordIdsSubType1DTO();
            // PK customer_id
            relationData.setRecordId(row[COLUMN_CUSTOMER_ID] != null ? Long.valueOf(row[0].toString()) : 0L);
            // field info
            List<GetDataByRecordIdsSubType2DTO> dataInfos = new ArrayList<>();
            for (int i = 0; i < lstFieldInfo.size(); i++) {
                GetDataByRecordIdsSubType2DTO field = new GetDataByRecordIdsSubType2DTO();
                field.setFieldId(lstFieldInfo.get(i).getFieldId());
                field.setFieldName(lstFieldInfo.get(i).getFieldName());
                field.setFieldType(lstFieldInfo.get(i).getFieldType());
                field.setValue(row.length > i + 1 && row[i + 1] != null ? row[i + 1].toString() : "");
                field.setRelationData(lstFieldInfo.get(i).getRelationData());
                field.setIsDefault(lstFieldInfo.get(i).getIsDefault());
                dataInfos.add(field);
            }
            // data info
            relationData.setDataInfos(dataInfos);
            relationDatas.add(relationData);
        });
        return relationDatas;
    }

    /**
     * Get customers ids
     *
     * @param fields
     * @param customerIds
     * @return
     */
    @Override
    public List<Long> getCustomerIdsCreatedRelation(List<CustomFieldsInfoOutDTO> fields, List<Long> customerIds) {
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append("SELECT customer_id ");
        sqlQuery.append("FROM customers  ");
        sqlQuery.append("WHERE customer_id IN (:customerIds) ");
        fields.forEach(field -> {
            if (!Boolean.TRUE.equals(field.getIsDefault())) {
                sqlQuery.append("AND  customer_data ->> '" + field.getFieldName() + "' IS NOT NULL ");
                sqlQuery.append(AND_CUSTOMER_DATA + field.getFieldName() + "' != '[]' ");
            } else {
                sqlQuery.append("AND " + field.getFieldName() + " IS NOT NULL ");
                sqlQuery.append("AND " + field.getFieldName() + " != '[]' ");
            }
        });
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCustomers.CUSTOMER_IDS, customerIds);
        List<Long> listEmployeeId = new ArrayList<>();
        List<BigInteger> listOutput = this.getResultList(sqlQuery.toString(), parameters);
        if (listOutput != null && !listOutput.isEmpty()) {
            listOutput.forEach(idOutput -> listEmployeeId.add(idOutput.longValue()));
        }
        return listEmployeeId;
    }
}
