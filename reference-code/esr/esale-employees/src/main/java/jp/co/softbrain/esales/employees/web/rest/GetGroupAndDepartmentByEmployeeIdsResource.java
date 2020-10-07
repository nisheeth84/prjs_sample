package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetGroupAndDepartmentByEmployeeIdsRequest;

/**
 * GetGroupAndDepartmentByEmployeeIdsQuery
 *
 * @author lequyphuc
 */
@RestController
@RequestMapping("/api")
public class GetGroupAndDepartmentByEmployeeIdsResource {

    @Autowired
    EmployeesService employeesService;

    /**
     * Get group and department by employeeIds
     * 
     * @param employeeIds - list employeeId to get
     * @return data response
     */
    @PostMapping(path = "/get-group-and-department-by-employee-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetGroupAndDepartmentByEmployeeIdsOutDTO> getGroupAndDepartmentByEmployeeIds(@RequestBody GetGroupAndDepartmentByEmployeeIdsRequest req) {
        return ResponseEntity.ok(employeesService.getGroupAndDepartmentByEmployeeIds(req.getEmployeeIds()));
    }
}
