package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.IsExistEmployeeByKeyOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetIsExistEmployeeByKeyRequest;

/**
 * IsExistEmployeeByKeyQuery class process GraphQL query to check exist employee
 * 
 * @author vuvankien
 */
@RestController
@RequestMapping("/api")
public class IsExistEmployeeByKeyResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Check exsit employee
     * 
     * @param keyFieldName - field search 
     * @param fieldValue - value search
     * @return number of employee satisfied
     */
    @PostMapping(path = "/get-employee-by-key", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IsExistEmployeeByKeyOutDTO> getIsExistEmployeeByKey(@RequestBody GetIsExistEmployeeByKeyRequest req) {
        return ResponseEntity.ok(this.employeeService.isExistEmployeeByKey(req.getKeyFieldName(), req.getFieldValue()));
    }
}
