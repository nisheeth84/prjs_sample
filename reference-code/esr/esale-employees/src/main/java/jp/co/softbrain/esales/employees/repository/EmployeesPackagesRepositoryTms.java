package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * TMS repository for EmployeesPackages
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface EmployeesPackagesRepositoryTms extends TmsRepository {

    /**
     * Find employees packages Ids
     * 
     * @param employeeIds
     * @param transID
     * @return
     */
    String findEmployeesPackagesIdsByEmployeeIds(List<Long> employeeIds, String transID);

    /**
     * Delete EmployeePackage By EmployeeId
     * 
     * @param employeeId
     * @param transID
     * @return true if successful
     */
    boolean deleteEmployeePackageByEmployeeId(Long employeeId, String transID);

    /**
     * get Sum EmployeePackage By Ids
     * 
     * @param employeePackageIds
     * @param transID
     * @return json string that contains results
     */
    String getSumEmployeePackageByIds(List<Long> employeePackageIds, String transID);
}
