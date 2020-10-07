/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesHistoriesService;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeHistoryOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeHistoryRequest;

/**
 * Rest class for EmployeeHistory
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class EmployeesHistoriesResource {

    @Autowired
    EmployeesHistoriesService employeesHistoriesService;

    /**
     * Get employee's history changed information
     * 
     * @param employeeId - id to get
     * @param currentPage - current page
     * @param limit - max record on page
     * @return object contains informations
     */
    @PostMapping(path = "/get-employee-history", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeHistoryOutDTO> getEmployeeHistory(@RequestBody GetEmployeeHistoryRequest input) {
        return ResponseEntity.ok(employeesHistoriesService.getEmployeeHistory(input.getEmployeeId(),
                input.getCurrentPage(), input.getLimit()));
    }

}
