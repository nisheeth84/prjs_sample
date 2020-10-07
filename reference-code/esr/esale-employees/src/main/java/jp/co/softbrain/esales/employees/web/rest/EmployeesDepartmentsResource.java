package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.service.dto.MoveToDepartmentResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.request.MoveToDepartmentRequest;

/**
 * Rest call service API moveToDepartment
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class EmployeesDepartmentsResource {

    @Autowired
    private EmployeesDepartmentsService employeesDepartmentsService;

    /**
     * Move employees to department
     * 
     * @param departmentId - destination department
     * @param employeeIds - list employeeId will be moved
     * @param moveType - type dispatch or type concurrently
     * @return list employeeId have been moved
     */
    @PostMapping(path = "/move-to-department", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MoveToDepartmentResponse> moveToDepartment(@RequestBody MoveToDepartmentRequest input) {
        return ResponseEntity.ok(employeesDepartmentsService.moveToDepartment(input.getDepartmentId(),
                input.getEmployeeIds(), input.getMoveType()));
    }

}
