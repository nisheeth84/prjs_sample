package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * TMS Repository for EmployeesGroups
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface EmployeesGroupsRepositoryTms extends TmsRepository {

    /**
     * String that contains group of Employee
     * 
     * @param employeeId
     *            employeeId
     * @param transID
     *            transID
     * @return json data
     */
    public String findGroupWithEmployeeId(Long employeeId, String transID);

    /**
     * find Employee Ids With Group Ids
     * 
     * @param groupIds
     *            groupIds
     * @param transID
     *            transID
     * @return json data
     */
    public String findEmployeeIdsWithGroupIds(List<Long> groupIds, String transID);

}
