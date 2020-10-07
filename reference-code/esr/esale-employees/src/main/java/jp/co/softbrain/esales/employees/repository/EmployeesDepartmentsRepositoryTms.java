package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * TMS repository for EmployeesDepartments
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface EmployeesDepartmentsRepositoryTms extends TmsRepository {

    /**
     * String that contains department of employee
     * 
     * @param employeeId
     *            employeeId
     * @param transID
     *            transID
     * @return json data
     */
    public String findDepartmentWithEmployeeId(Long employeeId, String transID);

    /**
     * Find Employees Ids with department Ids
     * 
     * @param departmentIds
     *            departmentIds
     * @param transID
     *            transID
     * @return json data
     */
    public String findEmployeeIdsWithDepartmentIds(List<Long> departmentIds, String transID);

    /**
     * Find Manager Ids with Employee Ids
     * 
     * @param employeeIds
     * @param transID
     * @return
     */
    public String findManagerIdsWithEmployeeIds(List<Long> employeeIds, String transID);

    /**
     * Get Employee Ids With Manager Ids
     * 
     * @param employeeIds
     * @param transID
     * @return
     */
    public String findEmployeeIdsWithManagerIds(List<Long> managerIds, String transID);

}
