package jp.co.softbrain.esales.employees.web.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesDataService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeResponseDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeByTenantRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeByTenantResponse;

/**
 * EmployeeQuery class process GraphQL query for getEmployee
 *
 * @author nguyentienquan
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeResource {

    @Autowired
    private EmployeesService employeeService;

    @Autowired
    private EmployeesDataService employeesDataService;

    /**
     * Get all data of employees, such as: field info, tab info, employee's info,...
     *
     * @param employeeId id of employee to get data
     * @param mode       [edit,detail] edit: Edit mode detail: View mode
     * @return Employee's data, such as: field info, tab info, employee's info,...
     */
    @PostMapping(path = "/get-employee", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EmployeeResponseDTO> getEmployee(@RequestBody GetEmployeeRequest req) {
        final Long employeeId = req.getEmployeeId();
        final String mode = req.getMode();
        return ResponseEntity.ok(employeesDataService.getEmployee(employeeId, mode));
    }
    
    
    /**
     * Get employee by tenant
     *
     * @param request request for search user
     * @return GetEmployeeByTenantResponse
     * @throws IOException
     */
    @PostMapping(path = "/get-employee-by-tenant", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeByTenantResponse> getEmployee(@RequestBody GetEmployeeByTenantRequest request) {
        GetEmployeeByTenantResponse responseData = new GetEmployeeByTenantResponse();
        EmployeeOutDTO employee = employeeService.getEmployeeByTenant(request.getEmail());
	         responseData.setData(employee);
        return ResponseEntity.ok(responseData);
    }
}
