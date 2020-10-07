package jp.co.softbrain.esales.customers.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom;
import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersListInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.GetMyListDTO;

/**
 * CustomersListCustomerRepositoryImpl
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public class CustomersListRepositoryCustomImpl extends RepositoryCustomUtils implements CustomersListRepositoryCustom {

    private static final String FROM_CUSTOMERS_LIST = "FROM customers_list cl ";
    private static final String CUSTOMERS_LIST_OPTIONALS_MAPPING = "CustomersListOptionalsMapping";

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getMyList(java.lang.Long)
     */
    @Override
    public List<CustomersListOptionalsDTO> getMyList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode) {
        return getOptionalsList(employeeId, depOfEmployee, groupOfEmployee, mode, ConstantsCustomers.MY_LIST, null,
                false);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getSharedList(java.lang.Long,
     *      boolean)
     */
    @Override
    public List<CustomersListOptionalsDTO> getSharedList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode) {
        return getOptionalsList(employeeId, depOfEmployee, groupOfEmployee, mode, ConstantsCustomers.SHARED_LIST, null,
                false);
    }

    /**
     * Get informations of customerList by given conditions
     * 
     * @param employeeId - employeeId
     * @param groupOfEmployee
     * @param depOfEmployee
     * @param participantType - participantType
     * @param customerListType - customerListType
     * @return - list informations DTO
     */
    private List<CustomersListOptionalsDTO> getOptionalsList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode,
            Integer customerListType, String searchValue, boolean isGetAllOwner) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();

        sqlBuilder.append("SELECT cl.customer_list_id ");
        sqlBuilder.append("     , cl.customer_list_name");
        sqlBuilder.append("     , cl.is_auto_list ");
        sqlBuilder.append("     , cl.customer_list_type ");
        sqlBuilder.append("     , cl.updated_date  ");
        sqlBuilder.append("     , clp.participant_type ");
        sqlBuilder.append("     , cl.is_over_write ");
        sqlBuilder.append("     , cl.last_updated_date ");
        sqlBuilder.append("     , cl.created_user ");
        sqlBuilder.append("     , cl.updated_user ");
        sqlBuilder.append(FROM_CUSTOMERS_LIST);
        sqlBuilder.append("INNER JOIN customers_list_participants clp ");
        sqlBuilder.append("        ON cl.customer_list_id = clp.customer_list_id ");
        sqlBuilder.append("WHERE 1 = 1 ");

        // if my list
        if (ConstantsCustomers.MY_LIST.equals(customerListType)) {
            sqlBuilder.append(" AND cl.customer_list_type = :customerListType ");
            parameters.put(ConstantsCustomers.CUSTOMER_LIST_TYPE, customerListType);
            sqlBuilder.append(" AND clp.participant_type = 2  ");

            if (!ConstantsCustomers.MODE_ALL.equals(mode)) {
                sqlBuilder.append(" AND clp.employee_id = :employeeId ");
                parameters.put(ConstantsCustomers.EMPLOYEE_ID, employeeId);
            }

            sqlBuilder.append(" ORDER BY cl.customer_list_id ASC ");
            return this.getResultList(sqlBuilder.toString(), CUSTOMERS_LIST_OPTIONALS_MAPPING, parameters);

        }
        List<String> listSearchOrganization = new ArrayList<>();

        if (!CollectionUtils.isEmpty(groupOfEmployee)) {
            listSearchOrganization.add(" clp.group_id IN (:groupIds) ");
            parameters.put(ConstantsCustomers.GROUP_IDS, groupOfEmployee);

        }
        if (!CollectionUtils.isEmpty(depOfEmployee)) {
            listSearchOrganization.add(" clp.department_id IN (:departmentIds) ");
            parameters.put(ConstantsCustomers.DEPARTMENT_IDS, depOfEmployee);

        }
            listSearchOrganization.add(" clp.employee_id = :employeeId ");
            parameters.put(ConstantsCustomers.EMPLOYEE_ID, employeeId);

        sqlBuilder.append(ConstantsCustomers.AND).append(ConstantsCustomers.OPEN_BRACKET);
        sqlBuilder.append(String.join(ConstantsCustomers.OR, listSearchOrganization));
        sqlBuilder.append(ConstantsCustomers.CLOSE_BRACKET);

        if (!StringUtils.isEmpty(searchValue)) {
            sqlBuilder.append(" AND cl.customer_list_name LIKE :searchValue ");
            parameters.put("searchValue", searchValue);
        }

        if (isGetAllOwner) {
            sqlBuilder.append(" AND clp.participant_type = 2 ");
            return this.getResultList(sqlBuilder.toString(), CUSTOMERS_LIST_OPTIONALS_MAPPING, parameters);
        }

        // else share list
        sqlBuilder.append(" AND cl.customer_list_type = :customerListType ");
        parameters.put(ConstantsCustomers.CUSTOMER_LIST_TYPE, customerListType);

        // case just owner or my list
        if (ConstantsCustomers.MODE_SHARE_LIST_OWNER.equals(mode)) {
            sqlBuilder.append(" AND clp.participant_type = 2 ");
        }
        sqlBuilder.append(" ORDER BY cl.customer_list_id ASC ");
        sqlBuilder.append("        , clp.participant_type DESC ");
        return this.getResultList(sqlBuilder.toString(), CUSTOMERS_LIST_OPTIONALS_MAPPING, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getMyList(java.lang.Long,
     *      java.lang.Long)
     */
    @Override
    public GetMyListDTO getMyList(Long customerListId, Long employeeId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT cl.customer_list_id ");
        sqlBuilder.append("      , cl.customer_list_name");
        sqlBuilder.append("      , cl.is_auto_list ");
        sqlBuilder.append(FROM_CUSTOMERS_LIST);
        sqlBuilder.append("INNER JOIN customers_list_participants clp ");
        sqlBuilder.append("        ON cl.customer_list_id = clp.customer_list_id ");
        sqlBuilder.append("WHERE clp.participant_type = 2 ");
        sqlBuilder.append("  AND cl.customer_list_id = :customerListId ");
        sqlBuilder.append("  AND clp.employee_id = :employeeId LIMIT 1");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        parameters.put(ConstantsCustomers.EMPLOYEE_ID, employeeId);
        return getSingleResult(sqlBuilder.toString(), "GetMyListDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getFavoriteCustomers(java.util.List)
     */
    @Override
    public List<GetFavoriteCustomersListInfoDTO> getFavoriteCustomers(List<Long> customerListFavouriteId) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT clf.customer_list_favourite_id AS customer_list_id ");
        sqlBuilder.append("     , cl.customer_list_name ");
        sqlBuilder.append("     , cl.updated_date ");
        sqlBuilder.append(FROM_CUSTOMERS_LIST);
        sqlBuilder.append("RIGHT JOIN customers_list_favourites clf ");
        sqlBuilder.append("       ON cl.customer_list_id = clf.customer_list_id ");
        if(customerListFavouriteId != null && !customerListFavouriteId.isEmpty()) {
            sqlBuilder.append("WHERE clf.customer_list_favourite_id IN (:customerListFavouriteIds) ");
            parameters.put(ConstantsCustomers.CUSTOMER_LIST_FAVOURITE_IDS, customerListFavouriteId);
        }
        sqlBuilder.append("ORDER BY cl.customer_list_name ASC ");
        return this.getResultList(sqlBuilder.toString(), "GetFavoriteCustomersOutMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getFavoriteCustomersByEmployeeId(java.lang.Long)
     */
    @Override
    public List<GetFavoriteCustomersSubType4DTO> getFavoriteCustomersByEmployeeId(Long employeeId) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT clf.customer_list_favourite_id ");
        sqlBuilder.append("     , cusList.customer_list_id ");
        sqlBuilder.append("     , cusList.customer_list_name ");
        sqlBuilder.append("     , cus.customer_id ");
        sqlBuilder.append("     , cus.customer_name ");
        sqlBuilder.append("FROM customers_list cusList ");
        sqlBuilder.append("INNER JOIN customers_list_favourites clf ");
        sqlBuilder.append("       ON cusList.customer_list_id = clf.customer_list_id ");
        sqlBuilder.append("LEFT JOIN customers_list_members clm ");
        sqlBuilder.append("       ON clf.customer_list_id = clm.customer_list_id ");
        sqlBuilder.append("LEFT JOIN customers cus ");
        sqlBuilder.append("       ON clm.customer_id = cus.customer_id ");
        sqlBuilder.append("WHERE clf.employee_id = :employeeId ");
        sqlBuilder.append("ORDER BY cusList.customer_list_name ASC ");
        parameters.put(ConstantsCustomers.EMPLOYEE_ID, employeeId);
        return this.getResultList(sqlBuilder.toString(), "GetFavoriteCustomersSubType4Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getCustomerListFavoriteByEmployeeId(java.lang.Long)
     */
    @Override
    public List<CustomersListOptionalsDTO> getCustomerListFavoriteByEmployeeId(Long employeeId,
            List<Long> departmentIds, List<Long> groupIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT cl.customer_list_id  ");
        sqlBuilder.append("     , cl.customer_list_name ");
        sqlBuilder.append("     , cl.is_auto_list ");
        sqlBuilder.append("     , cl.customer_list_type ");
        sqlBuilder.append("     , cl.updated_date ");
        sqlBuilder.append("     , clp.participant_type ");
        sqlBuilder.append("     , cl.is_over_write ");
        sqlBuilder.append("     , cl.last_updated_date ");
        sqlBuilder.append("     , cl.created_user ");
        sqlBuilder.append("     , cl.updated_user ");
        sqlBuilder.append("FROM customers_list cl  ");
        sqlBuilder.append("INNER JOIN customers_list_favourites clf ");
        sqlBuilder.append("        ON cl.customer_list_id = clf.customer_list_id ");
        sqlBuilder.append("LEFT JOIN customers_list_participants clp ");
        sqlBuilder.append("       ON cl.customer_list_id = clp.customer_list_id ");

        sqlBuilder.append("WHERE 1 = 1 ");
        sqlBuilder.append("AND  ( clp.employee_id = :memberId ");
        sqlBuilder.append("    OR clp.group_id IN (:groupIds)  ");
        sqlBuilder.append("    OR clp.department_id IN (:departmentIds) ) ");
        sqlBuilder.append("AND clf.employee_id = :employeeId ");

        sqlBuilder.append("ORDER BY clf.customer_list_favourite_id ASC ");
        sqlBuilder.append("       , clp.participant_type DESC ");

        parameters.put("groupIds", groupIds);
        parameters.put("departmentIds", departmentIds);
        parameters.put("memberId", employeeId);
        parameters.put("employeeId", employeeId);


        return this.getResultList(sqlBuilder.toString(), "GetCustomerListFavoriteByEmployeeIdMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom#getAllListOwnerWithSearchCondition(java.lang.Long,
     *      java.util.List, java.util.List, java.lang.String)
     */
    @Override
    public List<CustomersListOptionalsDTO> getAllListOwnerWithSearchCondition(Long userId, List<Long> departmentIds,
            List<Long> groupIds, String searchValueEscapeSql) {
        return getOptionalsList(userId, departmentIds, groupIds, null, null, searchValueEscapeSql, true);
    }

}
