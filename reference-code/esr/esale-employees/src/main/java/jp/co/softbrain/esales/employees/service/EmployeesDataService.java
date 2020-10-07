package jp.co.softbrain.esales.employees.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeeResponseDTO;

/**
 * Service Interface for managing data
 * {@link jp.co.softbrain.esales.employees.domain.Employees}.
 */
@XRayEnabled
public interface EmployeesDataService {

    /**
     * Get all data of employees, such as: field info, tab info, employee's
     * info,...
     *
     * @param employeeId id of employee to get data
     * @param mode [edit,detail]
     *        edit: Edit mode
     *        detail: View mode
     * @return Employee's data, such as: field info, tab info, employee's
     *         info,...
     */
    public EmployeeResponseDTO getEmployee(Long employeeId, String mode);

}
