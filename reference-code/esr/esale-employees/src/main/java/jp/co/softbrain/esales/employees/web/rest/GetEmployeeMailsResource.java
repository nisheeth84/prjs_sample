package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeMailsOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeeMailsOutRequest;

/**
 * GetEmployeeMailsQuery class process GraphQL query to get list mail employee
 * 
 * @author vuvankien
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeMailsResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get list mail of employee
     *
     * @param employeeIds - list employee
     * @param groupIds - list group
     * @param departmentIds - list department
     * @return list email return
     */
    @PostMapping(path="get-employee-mails",consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeMailsOutDTO> getEmployeeMails(@RequestBody GetEmployeeMailsOutRequest req) {
        return ResponseEntity.ok(this.employeeService.getEmployeeMails(req.getEmployeeIds(),req.getGroupIds(),req.getDepartmentIds()));
    }

}
