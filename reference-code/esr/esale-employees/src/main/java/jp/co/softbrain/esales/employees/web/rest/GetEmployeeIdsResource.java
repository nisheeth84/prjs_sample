package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeIdsRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeIdsResponse;

/**
 * Rest controller for API getEmployeeIds
 *
 * @author VietNQ
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeIdsResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get employeeId by employeeName
     * 
     * @param list employee's name
     * @return list EmployeeNameDTO
     */
    @PostMapping(path = "/get-employee-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeIdsResponse> getEmployeeForSyncSchedules(
            @RequestBody GetEmployeeIdsRequest request) {
        GetEmployeeIdsResponse response = new GetEmployeeIdsResponse();
        response.setEmployees(employeeService.getEmployeeIds(request.getEmployeeNames()));
        return ResponseEntity.ok(response);
    }
}
