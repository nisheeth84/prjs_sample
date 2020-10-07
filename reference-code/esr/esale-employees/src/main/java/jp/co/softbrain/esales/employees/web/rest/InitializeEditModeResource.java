package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeRelationsDTO;

/**
 * InitializeEditModeQuery class process GraphQL query
 *
 * @author lediepoanh
 *
 */
@RestController
@RequestMapping("/api")
public class InitializeEditModeResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get relations of the employee for editing
     * 
     * @return the entity of EmployeeRelationsDTO
     */
    @PostMapping(path = "/initialize-edit-mode", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EmployeeRelationsDTO> getInitializeEditMode() {
        return ResponseEntity.ok(employeeService.getEmployeeRelations(null));
    }
}
