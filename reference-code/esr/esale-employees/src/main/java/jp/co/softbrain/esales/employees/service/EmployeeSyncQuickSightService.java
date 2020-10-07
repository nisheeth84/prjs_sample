package jp.co.softbrain.esales.employees.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;

/**
 * Service interface for managing Employee quick-sight
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface EmployeeSyncQuickSightService {

    /**
     * Get list of employees that are synchronize quick-sight target
     *
     * @param employeeIds List of employee_id
     * @return List of {@link EmployeeSyncQuickSightDTO}
     */
    List<EmployeeSyncQuickSightDTO> getEmployeesSyncQuickSight(List<Long> employeeIds);

    /**
     * Update quick-sight status for employees
     *
     * @param employeeIds list employee_id
     * @param isAccountQuicksight isAccountQuicksight
     * @return list employee_id
     */
    List<Long> updateUserQuickSightStatus(List<Long> employeeIds, Boolean isAccountQuicksight);
}
