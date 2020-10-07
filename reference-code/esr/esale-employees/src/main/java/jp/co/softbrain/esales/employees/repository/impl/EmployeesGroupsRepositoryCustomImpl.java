package jp.co.softbrain.esales.employees.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupAndGroupMemberDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupAutoUpdateDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType4;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsDataDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupEmployeeListDTO;

/**
 * Repository Implement from RepositoryCustomUtils
 */
@Repository
public class EmployeesGroupsRepositoryCustomImpl extends RepositoryCustomUtils
        implements EmployeesGroupsRepositoryCustom {

    private static final String GROUP_IDS = "groupIds";

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#findGroupInformationByGroupId(java.lang.Long)
     */
    @Override
    public List<EmployeesGroupAutoUpdateDTO> findGroupInformationByGroupId(Long groupId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT eg.group_id ");
        sqlBuilder.append("     , eg.group_name ");
        sqlBuilder.append("     , eg.group_type ");
        sqlBuilder.append("     , eg.is_auto_group ");
        sqlBuilder.append("     , eg.is_over_write ");
        sqlBuilder.append("     , eg.display_order ");
        sqlBuilder.append("     , egsc.search_content_id ");
        sqlBuilder.append("     , egsc.field_id ");
        sqlBuilder.append("     , egsc.search_type ");
        sqlBuilder.append("     , egsc.search_option ");
        sqlBuilder.append("     , egsc.search_value ");
        sqlBuilder.append("     , egsc.time_zone_offset ");
        sqlBuilder.append(" FROM employees_groups eg  ");
        sqlBuilder.append("INNER JOIN employees_group_search_conditions egsc ");
        sqlBuilder.append("        ON egsc.group_id = eg.group_id ");
        sqlBuilder.append("WHERE eg.group_id = :groupId ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("groupId", groupId);
        return this.getResultList(sqlBuilder.toString(), "EmployeesGroupAutoUpdateDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getSharedGroups(java.lang.Long, boolean)
     */
    @Override
    public List<EmployeesGroupsDTO> getSharedGroups(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, boolean isOwner) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT eGroup.* ");
        sqlBuilder.append("     , eGp.participant_type ");
        sqlBuilder.append("FROM employees_groups eGroup ");
        sqlBuilder.append("INNER JOIN employees_group_participants eGp ");
        sqlBuilder.append("        ON eGroup.group_id = eGp.group_id ");
        sqlBuilder.append("WHERE eGroup.group_type = 2 ");
        sqlBuilder.append("    AND ( eGp.employee_id = :employeeId ");
        sqlBuilder.append("    OR eGp.department_id IN (:departmentIds) ");
        sqlBuilder.append("    OR eGp.participant_group_id IN (:groupIds) ) ");
        if (isOwner) {
            sqlBuilder.append("AND eGp.participant_type = 2 ");
        }
        sqlBuilder.append("ORDER BY eGroup.display_order ASC ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("employeeId", employeeId);
        parameters.put("departmentIds", depOfEmployee);
        parameters.put(GROUP_IDS, groupOfEmployee);
        return this.getResultList(sqlBuilder.toString(), "EmployeesGroupsCommonMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupsByKeyword(java.lang.String)
     */
    @Override
    public List<GetEmployeesSuggestionSubType4> getGroupsByKeyword(String keyWords, List<Long> idHistoryChoiceList,
            List<Long> idItemChoiceList) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT eGroup.group_id, ");
        sqlBuilder.append("       eGroup.group_name, ");
        sqlBuilder.append("       eGroup.is_auto_group, ");
        sqlBuilder.append("       eGroupMember.employee_id ");
        sqlBuilder.append(" FROM employees_groups eGroup ");
        sqlBuilder.append(" INNER JOIN employees_group_participants eGroupParticipant ");
        sqlBuilder.append("         ON eGroup.group_id = eGroupParticipant.group_id ");
        if (idItemChoiceList != null && !idItemChoiceList.isEmpty()) {
            sqlBuilder.append("   AND eGroupParticipant.group_id NOT IN (:idItemChoiceList) ");
            parameters.put(ConstantsEmployees.ID_ITEM_CHOICE, idItemChoiceList);
        }
        if (idHistoryChoiceList != null && !idHistoryChoiceList.isEmpty()) {
            sqlBuilder.append("   AND eGroupParticipant.group_id IN (:idHistoryChoiceList) ");
            parameters.put(ConstantsEmployees.ID_HISTORY_CHOICE, idHistoryChoiceList);
        }
        String searchKeyword = "%" + keyWords + "%";
        sqlBuilder.append(" LEFT JOIN employees_group_members eGroupMember ");
        sqlBuilder.append("         ON eGroup.group_id = eGroupMember.group_id ");
        sqlBuilder.append(" WHERE eGroup.group_name LIKE :searchKeyword ");
        sqlBuilder.append(" ORDER BY eGroup.group_name ASC ");
        parameters.put("searchKeyword", searchKeyword);
        return this.getResultList(sqlBuilder.toString(), "GetEmployeesSuggestionSubType4Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupsAndEmployeeIds(java.util.List, boolean)
     */
    @Override
    public List<EmployeeGroupAndGroupMemberDTO> getGroupsAndEmployeeIds(List<Long> groupIds, boolean employeeFlg) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append(" SELECT eg.group_id ");
        sqlBuilder.append("      , eg.group_name ");
        sqlBuilder.append("      , eg.group_type ");
        sqlBuilder.append("      , eg.is_auto_group ");
        if (employeeFlg) {
            sqlBuilder.append("  , egm.employee_id ");
        } else {
            sqlBuilder.append("  , 0 AS employee_id ");
        }
        sqlBuilder.append("      , eg.updated_date ");
        sqlBuilder.append("FROM employees_groups eg ");
        if (employeeFlg) {
            sqlBuilder.append("LEFT JOIN employees_group_members egm ");
            sqlBuilder.append("       ON eg.group_id = egm.group_id ");
        }
        if (!groupIds.isEmpty()) {
            sqlBuilder.append(" WHERE eg.group_id IN ( :groupIds ) ");
            parameters.put(GROUP_IDS, groupIds);
        }
        sqlBuilder.append("ORDER BY eg.display_order ASC ");
        return getResultList(sqlBuilder.toString(), "EmployeeGroupAndGroupMemberDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#findGroupByOwnerAndGroupName(java.lang.Long,
     *      java.lang.String)
     */
    @Override
    public List<GetGroupSuggestionsDataDTO> findGroupByOwnerAndGroupName(Long employeeId, String searchValue) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT eg.group_id, ");
        sqlBuilder.append("       eg.group_name, ");
        sqlBuilder.append("       eg.group_type, ");
        sqlBuilder.append("       eg.is_auto_group, ");
        sqlBuilder.append("       eg.last_updated_date, ");
        sqlBuilder.append("       eg.is_over_write, ");
        sqlBuilder.append("       emp.employee_surname, ");
        sqlBuilder.append("       emp.employee_name AS created_user_name ");
        sqlBuilder.append("FROM employees_groups eg  ");
        sqlBuilder.append("INNER JOIN employees_group_participants egp ");
        sqlBuilder.append("    ON eg.group_id = egp.group_id ");
        sqlBuilder.append("INNER JOIN employees emp ");
        sqlBuilder.append("    ON emp.employee_id = eg.created_user ");
        sqlBuilder.append("WHERE egp.employee_id =:employeeId ");
        sqlBuilder.append("  AND egp.participant_type = 2 ");
        sqlBuilder.append("  AND eg.group_name LIKE :searchValue ");
        parameters.put("employeeId", employeeId);
        parameters.put("searchValue", searchValue);
        return getResultList(sqlBuilder.toString(), "EmployeeGroupByOwnerMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupWithOwnerPermision(java.lang.Long,
     *      java.lang.Long, java.util.List, java.util.List)
     */
    @Override
    public EmployeesGroups getGroupWithOwnerPermision(Long groupId, Long employeeId, List<Long> depOfEmp,
            List<Long> groupOfEmp) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();

        sqlBuilder.append("SELECT * FROM employees_groups eg ");
        sqlBuilder.append("INNER JOIN employees_group_participants egp ");
        sqlBuilder.append("        ON eg.group_id = egp.group_id ");
        sqlBuilder.append("WHERE eg.group_id = :groupId ");
        sqlBuilder.append("  AND egp.participant_type = 2 ");
        sqlBuilder.append("  AND ( egp.employee_id =:employeeId ");

        parameters.put(ConstantsEmployees.GROUP_ID, groupId);
        parameters.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);

        if (!CollectionUtils.isEmpty(depOfEmp)) {
            sqlBuilder.append("  OR egp.department_id IN (:departmentId) ");
            parameters.put(ConstantsEmployees.PARAM_DEPARTMENT_ID, depOfEmp);
        }
        if (!CollectionUtils.isEmpty(groupOfEmp)) {
            sqlBuilder.append("  OR egp.participant_group_id IN (:participantGroupId) ");
            parameters.put(ConstantsEmployees.PARTICIPANT_GROUP_ID, groupOfEmp);
        }
        sqlBuilder.append(" ) ");
        return this.getSingleResult(sqlBuilder.toString(), "EmployeesGroupsEntityMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupByGroupParticipant(java.util.List)
     */
    @Override
    public List<EmployeesGroupsDTO> getGroupByGroupParticipant(List<Long> groupParticipantIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();

        sqlBuilder.append("SELECT eg.* ");
        sqlBuilder.append("     , '0' participant_type ");
        sqlBuilder.append("FROM employees_groups eg ");
//        sqlBuilder.append("LEFT JOIN employees_group_participants egp ")
//        sqlBuilder.append("   ON eg.group_id = egp.group_id ")
        sqlBuilder.append("WHERE 1=1 ");
        if (!CollectionUtils.isEmpty(groupParticipantIds)) {
            sqlBuilder.append("AND eg.group_id IN (:groupParticipantIds) ");
            parameters.put("groupParticipantIds", groupParticipantIds);
        }
        sqlBuilder.append("ORDER BY ");
        sqlBuilder.append("       eg.group_id ASC ");
//        sqlBuilder.append("     , egp.participant_type DESC ")

        return getResultList(sqlBuilder.toString(), "GroupsByGroupParticipantMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupsAndEmployeesForOrg(List)
     *
     * @param groupIds
     * @return
     */
    public List<GroupEmployeeListDTO> getGroupsAndEmployeesForOrg(List<Long> groupIds) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT eg.group_id AS groupId, eg.group_name AS groupName");
        sql.append(" , STRING_AGG(TRIM(CONCAT(emp.employee_surname, ' ', emp.employee_name)) ");
        sql.append(" , ', ' ORDER BY CONCAT(emp.employee_surname, ' ', emp.employee_name)) AS listEmployeeFullName ");
        sql.append(" FROM employees_groups eg ");
        sql.append(" LEFT JOIN employees_group_members egm ON eg.group_id = egm.group_id ");
        sql.append(" LEFT JOIN employees emp ON emp.employee_id = egm.employee_id ");
        sql.append(" WHERE eg.group_id IN (:groupIds) ");
        sql.append(" GROUP BY eg.group_id");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(GROUP_IDS, groupIds);
        return getList(sql.toString(), GroupEmployeeListDTO.class, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom#getGroupByConditions(java.lang.String)
     */
    @Override
    public List<GetGroupByNameDTO> getGroupByConditions(String conditions, Map<String, Object> parameters) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT eg.group_id AS groupId ").append("      , eg.group_name AS groupName ")
                .append(" FROM employees_groups eg ");
        if (StringUtils.isNotBlank(conditions)) {
            sql.append(Constants.WHERE).append(conditions);
        }
        return getList(sql.toString(), GetGroupByNameDTO.class, parameters);
    }
}
