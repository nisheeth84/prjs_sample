package jp.co.softbrain.esales.employees.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.service.dto.DepartmentAndEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentEmployeeListDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOfEmployeeQueryResult;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType2;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantDepartmentDTO;

@Repository
public class DepartmentsRepositoryCustomImpl extends RepositoryCustomUtils implements DepartmentsRepositoryCustom {

    private static final String EMPLOYEE_ID = "employeeId";
    private static final String DEPARTMENT_IDS = "departmentIds";

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#isExistDepartment(java.lang.Long, java.lang.String, java.lang.Long)
     */
    @Override
    public boolean isExistDepartment(Long departmentId, String departmentName, Long parentId) {
        Object count = null;
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT COUNT(*) ");
        sqlBuilder.append("FROM departments dep ");
        sqlBuilder.append("WHERE ");
        sqlBuilder.append("dep.department_name = :departmentName ");
        parameters.put("departmentName", departmentName);
        if (parentId != null) {
            sqlBuilder.append("AND dep.parent_id = :parentId ");
            parameters.put("parentId", parentId);
        } else {
            sqlBuilder.append("AND dep.parent_id IS NULL ");
        }
        if (departmentId != null) {
            sqlBuilder.append("AND dep.department_id != :departmentId ");
            parameters.put("departmentId", departmentId);
        }
        count = this.getSingleResult(sqlBuilder.toString(), parameters);
        return count != null && Integer.valueOf(count.toString()) > 0;
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentsByKeyWord(java.lang.String)
     */
    @Override
    public List<GetEmployeesSuggestionSubType2> getDepartmentsByKeyWord(String keyWords, List<Long> idHistoryChoiceList,
            List<Long> idItemChoiceList) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT dep.department_id,  ");
        sqlBuilder.append("       dep.department_name , ");
        sqlBuilder.append("       empDep.employee_id, ");
        sqlBuilder.append("       p_departments.department_id AS parent_department_id, ");
        sqlBuilder.append("       p_departments.department_name AS parent_department_name ");
        sqlBuilder.append(" FROM departments dep ");
        sqlBuilder.append(" LEFT JOIN employees_departments empDep ");
        sqlBuilder.append("        ON dep.department_id = empDep.department_id ");
        sqlBuilder.append(" LEFT JOIN departments p_departments ");
        sqlBuilder.append("        ON dep.parent_id = p_departments.department_id ");
        String searchKeyword = "%" + keyWords + "%";
        sqlBuilder.append(" WHERE dep.department_name LIKE :searchKeyword ");
        parameters.put("searchKeyword", searchKeyword);
        if (idItemChoiceList != null && !idItemChoiceList.isEmpty()) {
            sqlBuilder.append("   AND dep.department_id NOT IN (:idItemChoiceList) ");
            parameters.put(ConstantsEmployees.ID_ITEM_CHOICE, idItemChoiceList);
        }
        if (idHistoryChoiceList != null && !idHistoryChoiceList.isEmpty()) {
            sqlBuilder.append("   AND dep.department_id IN (:idHistoryChoiceList) ");
            parameters.put(ConstantsEmployees.ID_HISTORY_CHOICE, idHistoryChoiceList);
        }

        sqlBuilder.append(" ORDER BY dep.department_name ASC ");
        return this.getResultList(sqlBuilder.toString(), "GetEmployeesSuggestionSubType2Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentsTimelineByKeyWord(java.lang.String,
     *      java.util.List, java.util.List, java.util.List)
     */
    public List<GetEmployeesSuggestionSubType2> getDepartmentsTimelineByKeyWord(String keyWords,
            List<Long> idHistoryChoiceList, List<Long> inviteId, List<Long> idItemChoiceList) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT dep.department_id,  ");
        sqlBuilder.append("       dep.department_name , ");
        sqlBuilder.append("       empDep.employee_id, ");
        sqlBuilder.append("       p_departments.department_id AS parent_department_id, ");
        sqlBuilder.append("       p_departments.department_name AS parent_department_name ");
        sqlBuilder.append(" FROM departments dep ");
        sqlBuilder.append(" LEFT JOIN employees_departments empDep ");
        sqlBuilder.append("        ON dep.department_id = empDep.department_id ");
        sqlBuilder.append(" LEFT JOIN departments p_departments ");
        sqlBuilder.append("        ON dep.parent_id = p_departments.department_id ");
        String searchKeyword = "%" + keyWords + "%";
        sqlBuilder.append(" WHERE dep.department_name LIKE :searchKeyword ");
        parameters.put("searchKeyword", searchKeyword);
        if (idItemChoiceList != null && !idItemChoiceList.isEmpty()) {
            sqlBuilder.append("   AND empDep.department_id NOT IN (:idItemChoiceList) ");
            parameters.put(ConstantsEmployees.ID_ITEM_CHOICE, idItemChoiceList);
        }
        if (idHistoryChoiceList != null && !idHistoryChoiceList.isEmpty()) {
            sqlBuilder.append("   AND empDep.department_id IN (:idHistoryChoiceList) ");
            parameters.put(ConstantsEmployees.ID_HISTORY_CHOICE, idHistoryChoiceList);
        }
        if (inviteId != null && !inviteId.isEmpty()) {
            sqlBuilder.append("   AND empDep.department_id IN (:inviteId) ");
            parameters.put(ConstantsEmployees.INVITE_ID, inviteId);
        }

        sqlBuilder.append(" ORDER BY dep.department_name ASC ");
        return this.getResultList(sqlBuilder.toString(), "GetEmployeesSuggestionSubType2Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getEmployeeDepartmentPosition(java.lang.Long, java.lang.String)
     */
    @Override
    public List<EmployeeDepartmentsDTO> getEmployeeDepartmentPosition(Long employeeId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT departments.department_id AS departmentId ");
        sqlBuilder.append("     , departments.department_name AS departmentName ");
        sqlBuilder.append("     , departments.department_order AS departmentOrder ");
        sqlBuilder.append("     , positions.position_id AS positionId ");
        sqlBuilder.append("     , positions.position_name AS positionName ");
        sqlBuilder.append("     , positions.position_order AS positionOrder ");
        sqlBuilder.append("FROM employees_departments ");
        sqlBuilder.append("LEFT JOIN departments ");
        sqlBuilder.append("       ON employees_departments.department_id = departments.department_id ");
        sqlBuilder.append("LEFT JOIN positions ");
        sqlBuilder.append("       ON employees_departments.position_id = positions.position_id ");
        sqlBuilder.append("WHERE employees_departments.employee_id = :employeeId ");
        sqlBuilder.append("ORDER BY positions.position_order ASC ");
        sqlBuilder.append("       , departments.department_order ASC ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(EMPLOYEE_ID, employeeId);
        return this.getResultList(sqlBuilder.toString(), "EmployeeDepartmentPositionMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentsByDepartmentIds(java.util.List)
     */
    @Override
    public List<ParticipantDepartmentDTO> getDepartmentsByDepartmentIds(List<Long> depIds) {
        String sql = "SELECT dep.department_id , dep.department_name , parentDep.department_name AS parentDepartmentName "
                   + "FROM departments dep "
                   + "LEFT JOIN departments parentDep "
                   + "       ON dep.parent_id = parentDep.department_id "
                   + "WHERE dep.department_id IN (:depIds )";
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("depIds", depIds);
        return this.getResultList(sql, "InitializeGroupModalSubType1Mapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentAndEmployeeIds(java.util.List, java.lang.Long, boolean)
     */
    @Override
    public List<DepartmentAndEmployeeDTO> getDepartmentAndEmployeeIds(List<Long> departmentIds, Long employeeId,
            boolean getEmployeesFlg) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sql.append("SELECT departments.department_id ");
        sql.append("     , departments.department_name ");
        sql.append("     , p_departments.department_id AS parent_id ");
        sql.append("     , p_departments.department_name AS parent_name ");
        if (getEmployeesFlg) {
            sql.append(" , ed.employee_id ");
        } else {
            sql.append(" , 0 AS employee_id ");
        }
        sql.append("     , departments.updated_date ");
        sql.append("FROM departments ");
        sql.append("LEFT JOIN departments p_departments ");
        sql.append("       ON departments.parent_id = p_departments.department_id ");
        if (getEmployeesFlg || employeeId != null) {
            sql.append("LEFT JOIN employees_departments ed ");
            sql.append("       ON departments.department_id = ed.department_id ");
        }
        sql.append("WHERE 1=1 ");
        if (!departmentIds.isEmpty()) {
            sql.append("AND departments.department_id IN ( :departmentIds ) ");
            parameters.put(DEPARTMENT_IDS, departmentIds);
        }
        if (employeeId != null) {
            sql.append("AND ed.employee_id = ( :employeeId ) ");
            parameters.put(EMPLOYEE_ID, employeeId);
        }
        sql.append("ORDER BY departments.department_order ASC ; ");
        return getResultList(sql.toString(), "DepartmentAndEmployeeDTOMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartment(java.lang.Long)
     */
    @Override
    public  DepartmentManagerDTO getDepartment(Long departmentId) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("      d.department_id, ");
        sql.append("      d.department_name, ");
        sql.append("      d.manager_id, ");
        sql.append("      emp.employee_surname AS managerSurname, ");
        sql.append("      emp.employee_name AS managerName ");
        sql.append(" FROM departments d ");
        sql.append(" LEFT JOIN employees emp ");
        sql.append("        ON d.manager_id = emp.employee_id ");
        sql.append(" WHERE d.department_id = :departmentId");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("departmentId", departmentId);
        return this.getSingleResult(sql.toString(), "DepartmentManagerMapping", parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getParentDepartment(java.lang.List<Long>)
     */
    @Override
    public List<GetParentDepartmentDTO> getParentDepartment(List<Long> departmentIds) {
        StringBuilder sql = new StringBuilder();
        sql.append("WITH RECURSIVE departments_tmp ( department_id, path_tree_name, parent_id, child_id, path_tree_id ) AS ( ");
        sql.append("    SELECT      ");
        sql.append("    department_id, ");
        sql.append("        ARRAY [ department_name ], ");
        sql.append("        parent_id,  ");
        sql.append("        department_id,  ");
        sql.append("        ARRAY [ department_id ] ");
        sql.append("    FROM        ");
        sql.append("        departments ");
        sql.append("    WHERE       ");
        sql.append("        department_id IN (:departmentIds) ");
        sql.append("    UNION ALL ");
        sql.append("    SELECT ");
        sql.append("        de.department_id, ");
        sql.append("        ( ARRAY [ de.department_name ] || tmp.path_tree_name ) \\:\\: VARCHAR ( 50 ) [], ");
        sql.append("        de.parent_id, ");
        sql.append("        tmp.child_id, ");
        sql.append("        ARRAY [ de.department_id ] || tmp.path_tree_id  ");
        sql.append("    FROM        ");
        sql.append("        departments_tmp AS tmp  ");
        sql.append("        INNER JOIN departments AS de    ");
        sql.append("    ON  tmp.parent_id = de.department_id ");
        sql.append(") ");
        sql.append("SELECT ");
        sql.append("    child_id AS department_id, ");
        sql.append("    path_tree_name AS pathTreeName, ");
        sql.append("    path_tree_id AS pathTreeId ");
        sql.append("FROM ");
        sql.append("    departments_tmp ");
        sql.append("WHERE ");
        sql.append("    parent_id IS NULL ");
        sql.append("    OR parent_id = 0 ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(DEPARTMENT_IDS, departmentIds);
        return getResultList(sql.toString(), "GetParentDepartmentDTOMapping", parameters);
    }

    /**
     * @see DepartmentsRepositoryCustom#getDepartmentsOfEmployee(Long)
     */
    @Override
    public List<GetDepartmentsOfEmployeeQueryResult> getDepartmentsOfEmployee(Long employeeId) {
        return getResultList(
                "WITH RECURSIVE get_departments as ( " +
                        "    SELECT d1.department_id, d1.department_name, d1.parent_id, d1.department_id as current_id, 1 AS display_order " +
                        "    FROM departments d1 " +
                        "             INNER JOIN employees_departments ed ON d1.department_id = ed.department_id " +
                        "    WHERE ed.employee_id = :employeeId " +
                        "    UNION ALL " +
                        "    SELECT d2.department_id, d2.department_name, d2.parent_id, gd.current_id, gd.display_order + 1 AS display_order " +
                        "    FROM departments d2 " +
                        "             INNER JOIN get_departments as gd ON gd.department_id = d2.parent_id " +
                        ") " +
                        "SELECT DISTINCT gd.department_id, gd.department_name, gd.parent_id, gd.current_id, gd.display_order " +
                        "FROM get_departments gd " +
                        "ORDER BY current_id, display_order, department_id",
                "GetDepartmentsOfEmployeeQueryResultMapping", Map.of(EMPLOYEE_ID, employeeId));
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentsAndEmployeesForOrg(List)
     *
     * @param departmentIds
     * @return
     */
    public List<DepartmentEmployeeListDTO> getDepartmentsAndEmployeesForOrg(List<Long> departmentIds) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT dep.department_id AS departmentId, dep.department_name AS departmentName ");
        sql.append(" , STRING_AGG(TRIM(CONCAT(emp.employee_surname, ' ', emp.employee_name)) ");
        sql.append(" , ', ' ORDER BY pos.position_order, dep.department_order) AS listEmployeeFullName ");
        sql.append(" FROM  departments  dep ");
        sql.append(" LEFT JOIN employees_departments ed ON ed.department_id = dep.department_id ");
        sql.append(" LEFT JOIN employees emp ON emp.employee_id = ed.employee_id ");
        sql.append(" LEFT JOIN positions pos ON pos.position_id = ed.position_id ");
        sql.append(" WHERE dep.department_id IN (:departmentIds) ");
        sql.append(" GROUP BY dep.department_id");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(DEPARTMENT_IDS, departmentIds);
        return getList(sql.toString(), DepartmentEmployeeListDTO.class, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom#getDepartmentByConditions(java.lang.String)
     */
    @Override
    public List<GetDepartmentByNameDTO> getDepartmentByConditions(String conditions, Map<String, Object> parameters) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT department_id AS departmentId ");
        sqlBuilder.append("     , department_name AS departmentName ");
        sqlBuilder.append(" FROM departments ");
        if (StringUtils.isNotBlank(conditions)) {
            sqlBuilder.append(Constants.WHERE);
            sqlBuilder.append(conditions);
        }
        return getList(sqlBuilder.toString(), GetDepartmentByNameDTO.class, parameters);
    }

}
