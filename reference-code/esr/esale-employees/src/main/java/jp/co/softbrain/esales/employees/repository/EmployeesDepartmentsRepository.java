package jp.co.softbrain.esales.employees.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;


/**
 * Spring Data  repository for the EmployeesDepartments entity.
 */
@Repository
@XRayEnabled
public interface EmployeesDepartmentsRepository extends JpaRepository<EmployeesDepartments, Long> {

    /**
     * Delete all employees departments by employeeId
     * 
     * @param employeeId - id condition
     */
    @Modifying(clearAutomatically = true)
    void deleteByEmployeeId(Long employeeId);

    /**
     * Count relations between given employeeId and departmentId
     * 
     * @param employeeId - employeeId
     * @param departmentId - departmentId
     * @return - number of relations
     */
    @Query(value = "SELECT COUNT(*) "
                 + "FROM employees_departments ed "
                 + "WHERE ed.employee_id = :employeeId "
                 + "  AND ed.department_id = :departmentId ", nativeQuery = true)
    int countExistDepartmentRelation(@Param("employeeId") Long employeeId, @Param("departmentId") Long departmentId);

    /**
     * get Relation Employees Departments
     * 
     * @param departmentId - department id
     * @return
     */
    @Query(value = "SELECT COUNT(1) "
                 + "FROM employees_departments ed "
                 + "INNER JOIN departments d "
                 + "        ON ed.department_id = d.department_id "
                 + "WHERE d.department_id = :departmentId", nativeQuery = true)
    int getRelationEmployeesDepartments(@Param("departmentId") Long departmentId);

    /**
     * Delete some Employees-Departments by employeeId and avoid departmentId
     * 
     * @param employeeId - define employee has some relation in table
     * @param departmentId - define department which will be avoid
     */
    @Modifying(clearAutomatically = true)
    void deleteByEmployeeIdAndDepartmentIdNot(Long employeeId, Long departmentId);

    /**
     * Find employees departments By employeeId
     * 
     * @param employeeId employeeId
     * @return employees departments list.
     */
    List<EmployeesDepartments> findByEmployeeId(Long employeeId);

    /**
     * find employee departments data by department id and list employee id
     * 
     * @param departmentId - department id
     * @param employeeIds - list employee id
     * @return list entity
     */
    @Query(value = "SELECT * "
                 + "FROM employees_departments "
                 + "WHERE department_id = :departmentId "
                 + "  AND employee_id IN ( :employeeIds )", nativeQuery = true)
    List<EmployeesDepartments> findByDepartmentIdAndEmployeeIds(@Param("departmentId") Long departmentId,
            @Param("employeeIds") List<Long> employeeIds);

    /**
     * get EmployeesDepartments by employeeId and departmentId
     * 
     * @param employeeId the employeeId of the entity
     * @param departmentId the departmentId of the entity
     * @return the optional entity
     */
    List<EmployeesDepartments> findOneByEmployeeIdAndDepartmentId(Long employeeId, Long departmentId);

    /**
     * Delete record employees departments by departmentId.
     * 
     * @param departmentId departmentId delete.
     */
    public void deleteByDepartmentId(Long departmentId);

    /**
     * select employeeId by list departmentId
     * 
     * @param departmentIds - condition to select
     */
    @Query("SELECT ed.employeeId FROM EmployeesDepartments ed WHERE ed.departmentId IN :departmentIds")
    List<Long> findEmployeeIdsWithDepartmentIds(@Param("departmentIds") List<Long> departmentIds);

    /**
     * select managerId by list employeeId
     * 
     * @param managerIds - condition to select
     */
    @Query("SELECT ed.managerId FROM EmployeesDepartments ed WHERE ed.employeeId IN :employeeIds")
    List<Long> findManagerIdsWithEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

    /**
     * select employeeId by list managerId
     * 
     * @param employeeIds - condition to select
     */
    @Query("SELECT ed.employeeId FROM EmployeesDepartments ed WHERE ed.managerId IN :managerIds")
    List<Long> findEmployeeIdsWithManagerIds(@Param("managerIds") List<Long> managerIds);

    /**
     * find department of employee
     * contructor auto concat fullName
     * 
     * @param employeeId
     * @return
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO(dep.departmentId"
            + " , dep.departmentName, pos.positionId, pos.positionName, pos.positionOrder"
            + " , emp.employeeId, emp.employeeSurname, emp.employeeName)"
            + " FROM EmployeesDepartments ed"
            + " LEFT JOIN Departments dep ON dep.departmentId = ed.departmentId"
            + " LEFT JOIN Positions pos ON pos.positionId = ed.positionId"
            + " LEFT JOIN Employees emp ON emp.employeeId = ed.managerId"
            + " WHERE ed.employeeId = :employeeId"
            + " ORDER BY pos.positionOrder ASC, dep.departmentOrder")
    List<DepartmentPositionDTO> findDepartmentWithEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * find department of employee
     * contructor auto concat fullName
     * 
     * @param employeeId
     * @return
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO(dep.departmentId"
            + " , dep.departmentName, pos.positionId, pos.positionName, pos.positionOrder, dep.managerId ) "
            + " FROM EmployeesDepartments ed"
            + " LEFT JOIN Departments dep ON dep.departmentId = ed.departmentId"
            + " LEFT JOIN Positions pos ON pos.positionId = ed.positionId"
            + " LEFT JOIN Employees emp ON emp.employeeId = ed.managerId"
            + " WHERE ed.employeeId = :employeeId"
            + " ORDER BY pos.positionOrder ASC, dep.departmentOrder")
    List<DepartmentPositionDTO> findDepartmentOfEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * Get EmployeeId by Department
     * 
     * @param departmentIds departmentIds
     * @return the list EmployeeId
     */
    @Query(value = " SELECT ed.employee_id "
                 + " FROM departments d "
                 + " LEFT JOIN employees_departments ed "
                 + "       ON d.department_id = ed.department_id "
                 + " LEFT JOIN departments pd "
                 + "       ON d.parent_id = pd.department_id "
                 + " WHERE d.department_id IN ( :departmentIds ) ", nativeQuery = true)
    List<Long> getEmployeeIdByDepartment(@Param("departmentIds") List<Long> departmentIds);

    /**
     * findByPositionIdIn : get EmployeesDepartments by position id
     *
     * @param positionIds : list position id
     * @return EmployeesDepartments : list EmployeesDepartments
     */
    List<EmployeesDepartments> findByPositionIdIn(List<Long> positionIds);

    /**
     * Find By EmployeesDepartmentsId
     * 
     * @param employeesDepartmentsId 
     * @return the entity EmployeesDepartments
     */
    EmployeesDepartments findByEmployeesDepartmentsId(Long employeesDepartmentsId);

    /**
     * Find by managerIds
     * 
     * @param mamagerIds - list id manager
     * @return list entity
     */
    List<EmployeesDepartments> findByManagerIdIn(List<Long> mamagerIds);

    /**
     * Delete record by employeeId
     * 
     * @param employeeIds
     */
    void deleteByEmployeeIdIn(List<Long> employeeIds);

    /**
     * Find record by given employee id
     * 
     * @param employeeIds - list employeeid
     * @return list entity
     */
    List<EmployeesDepartments> findByEmployeeIdIn(List<Long> employeeIds);

    /**
     * Count relation of employee
     * 
     * @param employeeId
     * @return count
     */
    @Query(value = "SELECT COUNT(*) "
            + "FROM employees_departments ed "
            + "WHERE ed.employee_id =:employeeId ", nativeQuery = true)
    int countRelationOfEmployee(@Param("employeeId") Long employeeId);
}
