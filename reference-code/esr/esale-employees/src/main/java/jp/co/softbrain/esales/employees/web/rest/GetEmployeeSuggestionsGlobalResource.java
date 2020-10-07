package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeSuggestionsGlobalRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeSuggestionsGlobalResponse;

/**
 * Rest controller for API getEmployeeSuggestionsGlobal
 *
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeSuggestionsGlobalResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get all data of employees with suggest input global
     *  
     * @param req request
     * @return the response data
     */
    @PostMapping(path = "/get-employee-suggestions-global", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeSuggestionsGlobalResponse> getEmployeeSuggestionsGlobal(
            @RequestBody GetEmployeeSuggestionsGlobalRequest req) {
        return ResponseEntity.ok(
                employeeService.getEmployeeSuggestionsGlobal(req.getSearchValue(), req.getLimit(), req.getOffset()));
    }
}
