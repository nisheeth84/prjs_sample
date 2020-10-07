package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationEmployeeDTO;

/**
 * Spring Data repository for the Employees entity.
 */
@Repository
@XRayEnabled
public interface EmployeesRepository extends JpaRepository<Employees, Long> {

    Employees findByEmployeeId(Long employeeId);

    /**
     * get employee name by manager id
     *
     * @param managerId - id manager
     * @return list string
     */
    @Query(value = "SELECT emp.employee_name "
                 + "FROM employees emp "
                 + "WHERE emp.manager_id = :managerId "
                 + "ORDER BY employee_name ASC", nativeQuery = true)
    List<String> findEmployeeNameByManagerId(@Param("managerId") Long managerId);

    /**
     * count Employees By UserId And EmployeeId
     *
     * @param employeeId - employee id
     * @param userId - user id
     * @return number of employees
     */
    @Query(value = "SELECT count(1) "
                 + "FROM employees emp "
                 + "WHERE emp.employee_status = 0 "
                 + "  AND emp.user_id = :userId "
                 + "  AND emp.employee_id != :employeeId", nativeQuery = true)
    int countEmployeesByUserIdAndEmployeeId(@Param("employeeId") Long employeeId, @Param("userId") String userId);

    /**
     * count the number of employees
     *
     * @param departmentId - department id
     * @return number of employees
     */
    @Query(value = "SELECT COUNT(*) "
                 + "FROM employees emp "
                 + "INNER JOIN employees_departments empDep "
                 + "        ON emp.employee_id = empDep.employee_id "
                 + "WHERE empDep.department_id = :departmentId ", nativeQuery = true)
    int countEmployees(@Param("departmentId") Long departmentId);

    /**
     * Check the number of employees that exist
     *
     * @param employeeId - employee id
     * @param userId - user id
     * @return number of employees
     */
    @Query(value = "SELECT COUNT(*) "
                 + "FROM employees emp "
                 + "WHERE emp.employee_status = 0 "
                 + "  AND emp.user_id = :userId "
                 + "  AND emp.employee_id != :employeeId ", nativeQuery = true)
    int countExistUserID(@Param("employeeId") Long employeeId, @Param("userId") String userId);

    /**
     * Check the number of employees that exist
     *
     * @param userId - user id
     * @return number of employees
     */
    @Query(value = "SELECT COUNT(*) "
                 + "FROM employees emp "
                 + "WHERE emp.employee_status = 0 "
                 + "  AND emp.user_id = :userId ", nativeQuery = true)
    int countExistUserID(@Param("userId") String userId);

    /**
     * get exist email
     *
     * @param lstEmail - list email input
     * @return list email exist
     */
    @Query(value = "SELECT emp.email "
                 + "FROM employees emp "
                 + "WHERE emp.email IN (:lstEmail) ", nativeQuery = true)
    List<String> getExistEmail(@Param("lstEmail") List<String> lstEmail);

    /**
     * get employee data by manager id
     *
     * @param managerId - manager id
     * @return list employee
     */
    @Query(value = "SELECT DISTINCT employees.* "
                 + "FROM employees "
                 + "INNER JOIN employees_departments "
                 + "        ON employees.employee_id = employees_departments.employee_id "
                 + "WHERE employees_departments.manager_id = :managerId", nativeQuery = true)
    List<Employees> getEmployeesByManagerId(@Param("managerId") Long managerId);

    /**
     * Find one entity by given employeeId
     *
     * @param employeeId - id condition
     * @param employeeStatus - status
     */
    Employees findOneByEmployeeIdAndEmployeeStatusNot(Long employeeId, Integer employeeStatus);

    /**
     * find employees by employeeIds
     *
     * @param employeeIds
     * @return
     */
    @Query("SELECT emp FROM Employees emp WHERE emp.employeeStatus = 0 AND emp.employeeId IN :employeeIds")
    List<Employees> findAllWithEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

    /**
     * find manager in by employeeId
     *
     * @param employeeId
     * @return
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO(empd.managerId"
            + " , concat(emp.employeeSurname, ' ', emp.employeeName), emp.employeeSurname, emp.employeeName"
            + " , emp.employeeSurnameKana, emp.employeeNameKana, emp.photoFilePath)"
            + " FROM EmployeesDepartments empd"
            + " INNER JOIN Employees emp ON emp.employeeId = empd.managerId"
            + " WHERE empd.employeeId = :employeeId")
    List<EmployeeFullNameDTO> findManagerWithEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * find staff info by managerId
     * contructor auto concat employeeFullName
     *
     * @param managerId
     * @return
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO(emp.employeeId"
            + " , emp.employeeSurname, emp.employeeName"
            + " , emp.employeeSurnameKana, emp.employeeNameKana, emp.photoFilePath)"
            + " FROM EmployeesDepartments empd"
            + " INNER JOIN Employees emp ON emp.employeeId = empd.employeeId"
            + " WHERE empd.managerId = :managerId")
    List<EmployeeFullNameDTO> findStaffWithManagerId(@Param("managerId") Long managerId);

    /**
     * get all ID in table
     * @return List id
     */
    @Query(value = "SELECT emp.employee_id"
            + " FROM employees emp", nativeQuery = true)
    List<Long> findAllId();

    /**
     * @param email
     * @return
     */
    @Query(value = "SELECT COUNT(1) "
            + " FROM employees emp "
            + " WHERE emp.email = :email ", nativeQuery = true)
    int checkExistedEmail(@Param("email") String email);

    /**
     * Check exist email
     *
     * @param email The email
     * @param employeeId Employee Id
     * @return
     */
    @Query(value = "SELECT COUNT(1) "
            + " FROM employees emp "
            + " WHERE emp.email = :email"
            + " AND emp.employee_id != :employeeId", nativeQuery = true)
    int checkExistedEmail(@Param("email") String email, @Param("employeeId") Long employeeId);

    /**
     * Get all employee by status and email not null
     *
     * @return
     */
    @Query(value = "SELECT * "
            + " FROM employees emp "
            + " WHERE emp.employee_status = 0 "
            + "   AND emp.email IS NOT NULL ", nativeQuery = true)
    List<Employees> findAllByEmployeeStatusAndEmail();

    /**
     * Update quick-sight status for employees
     *
     * @param employeeIds employeeIds
     * @param isAccountQuicksight isAccountQuicksight
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " UPDATE employees "
            + " SET is_account_quicksight = :isAccountQuicksight "
            + " WHERE employee_id IN :employeeIds", nativeQuery = true)
    void updateUserQuickSightStatus(@Param("employeeIds") List<Long> employeeIds,
            @Param("isAccountQuicksight") Boolean isAccountQuicksight);

    /**
     * get employee data by emp_name
     *
     * @param empName - name employee
     * @return list employee
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.GetOrganizationEmployeeDTO(emp.employeeId"
            + " ,CONCAT(emp.employeeSurname,emp.employeeName )) "
            + " FROM Employees emp"
            + " WHERE CONCAT(emp.employeeSurname,emp.employeeName ) = :empName")
    List<GetOrganizationEmployeeDTO> findAllByNameEmployee(@Param("empName") String empName);

    /**
     * @param employeeIds
     * @return
     */
    List<Employees> findByEmployeeIdIn(List<Long> employeeIds);

}
