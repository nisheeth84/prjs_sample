package jp.co.softbrain.esales.employees.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.Departments;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationDepartmentDTO;

/**
 * Spring Data repository for the Departments entity.
 */
@Repository
@XRayEnabled
public interface DepartmentsRepository extends JpaRepository<Departments, Long> {

    /**
     * Get the name of subordinate staff
     * @param employeeId - employee id
     * @return list department name
     */
    @Query(value = "SELECT dep.department_name "
                 + "FROM departments dep "
                 + "INNER JOIN employees_departments emd "
                 + "        ON emd.department_id = dep.department_id "
                 + "WHERE emd.employee_id = :employeeId " 
                 + "ORDER BY department_name ASC ", nativeQuery = true)
    List<String> findDepartmentNameByEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * Get the last order Departments by departmentOrder.
     *
     * @return The last order Departments by departmentOrder.
     */
    public Optional<Departments> findFirstByDepartmentOrderNotNullOrderByDepartmentOrderDesc();
    
    /**
     * get department in listDepartmentId input
     * @param lstDepartmentId - list department id
     * @return list department id exist
     */
    @Query(value = "SELECT dep.department_id "
                 + "FROM departments dep "
                 + "WHERE dep.department_id IN (:lstDepartmentId) ", nativeQuery = true)
    List<Long> getExistDepartmentByIds(@Param("lstDepartmentId") List<Long> lstDepartmentId);
    
    /**
     * find All Department By Employee Id
     * @param employeeId - employee id
     * @return
     */
    @Query(value = "SELECT dep.* "
                 + "FROM departments dep "
                 + "INNER JOIN employees_departments emd "
                 + "        ON emd.department_id = dep.department_id "
                 + "WHERE emd.employee_id = :employeeId " 
                 + "ORDER BY department_name ASC", nativeQuery = true)
    List<Departments> findAllDepartmentByEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * Find all entity and order by department order ASC
     * 
     * @return list entity
     */
    List<Departments> findAllByOrderByDepartmentOrderAsc();

    /**
     * Count department by departmentId
     * 
     * @param departmentId - condition find
     * @return - number counted
     */
    @Query(value = "SELECT COUNT(1) "
                 + "FROM departments dep "
                 + "WHERE dep.department_id = :departmentId", nativeQuery = true)
    int checkExistDepartmentById(@Param("departmentId") Long departmentId);

    /**
     * Fild one Department by departmentId
     * 
     * @param departmentId id department
     * @return entity department
     */
    Departments findByDepartmentId(Long departmentId);

    /**
     * Delete by departmentId
     * 
     * @param departmentId
     */
    void deleteByDepartmentId(Long departmentId);

    /**
     * Find Childs list by parent id
     * 
     * @param departmentId - department id parent
     * @return list childs
     */
    List<Departments> findByParentId(Long parentId);

    /**
     * Find record by manager id
     * 
     * @param employeeIds - list id manager
     * @return list entity
     */
    List<Departments> findByManagerIdIn(List<Long> managerIds);

    /**
     * get department data by  name department
     * 
     * @param empName - name department
     * @return list employee
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.GetOrganizationDepartmentDTO(dpm.departmentId"
            + " ,dpm.departmentName) "
            + " FROM Departments dpm"
            + " WHERE dpm.departmentName = :nameDepartment")
    List<GetOrganizationDepartmentDTO> findAllByNameDepartment(@Param("nameDepartment") String nameDepartment);

    /**
     * @param departmentIds
     * @return
     */
    List<Departments> findByDepartmentIdIn(List<Long> departmentIds);

}
