package jp.co.softbrain.esales.employees.web.rest;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetInitializeManagerModalRequest;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * InitializeManagerModalQuery class process GraphQL query
 * 
 * @author nguyentrunghieu
 */
@RestController
@RequestMapping("/api")
public class InitializeManagerModalResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * initializeManagerModal
     * 
     * @param employeeId
     * @param employeeIds
     * @return
     */
    @PostMapping(path = "/get-initialize-manager-modal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeManagerModalOutDTO> getInitializeManagerModal(@RequestBody GetInitializeManagerModalRequest req) {
        List<Long> employeeIds = req.getEmployeeIds();
        try {
            return ResponseEntity.ok(this.employeeService.initializeManagerModal(employeeIds, null));
        } catch (IOException ex) {
            throw new CustomException(ex);
        }
    }
}
