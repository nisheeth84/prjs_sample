package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeForSyncSchedulesResponse;

/**
 * Rest controller for API getEmployeeForSyncSchedules
 *
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeForSyncSchedulesResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get all data for sync schedules
     *
     * @return Employee's data
     */
    @PostMapping(path = "/get-employee-for-sync-schedules", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeForSyncSchedulesResponse> getEmployeeForSyncSchedules() {
        GetEmployeeForSyncSchedulesResponse response = new GetEmployeeForSyncSchedulesResponse();
        response.setEmployeeList(employeeService.getEmployeeForSyncSchedules());
        return ResponseEntity.ok(response);
    }
}
