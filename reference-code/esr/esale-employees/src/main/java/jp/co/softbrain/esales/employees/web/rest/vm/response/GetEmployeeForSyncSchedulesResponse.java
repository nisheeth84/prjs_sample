/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import lombok.Data;

/**
 * Response for API getEmployeeForSyncSchedules
 * 
 * @author phamminhphu
 */
@Data
public class GetEmployeeForSyncSchedulesResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8075645839767284009L;

    /**
     * employeeList
     */
    private List<EmployeesDTO> employeeList;
}
