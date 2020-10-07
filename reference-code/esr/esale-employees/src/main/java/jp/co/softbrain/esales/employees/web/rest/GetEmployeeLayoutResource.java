package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.GetEmployeeLayoutPersonalResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.GetEmployeeLayoutResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeLayoutPersonalRequest;

/**
 * EmployeeLayoutQuery class process GraphQL query
 *
 * @author nguyentienquan
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeLayoutResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get fields of employees' service
     *
     * @return List of fields that belong employees' service
     */
    @PostMapping(path = "/get-employee-layout", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeLayoutResponse> getEmployeeLayout() {
        GetEmployeeLayoutResponse res = new GetEmployeeLayoutResponse(this.employeeService.getEmployeeLayout());
        return ResponseEntity.ok(res);
    }

    /**
     * Get fields of employee
     * 
     * @param extensionBelong
     * @return List of fields that belong employees' service
     */
    @PostMapping(path = "/get-employee-layout-personal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeLayoutPersonalResponse> getEmployeeLayoutPersonal(
            @RequestBody GetEmployeeLayoutPersonalRequest req) {
        int extensionBelong = req.getExtensionBelong();
        return ResponseEntity.ok(new GetEmployeeLayoutPersonalResponse(
                this.employeeService.getEmployeeLayoutPersonal(extensionBelong)));
    }

}
