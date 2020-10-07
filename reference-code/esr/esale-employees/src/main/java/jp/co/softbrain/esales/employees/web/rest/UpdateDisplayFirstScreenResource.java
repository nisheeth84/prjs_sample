package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateDisplayFirstScreenRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateDisplayFirstScreenResponse;

/**
 * Update Display First Screen
 *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class UpdateDisplayFirstScreenResource {

    @Autowired
    private EmployeesService employeesService;

    /**
     * Update Display First Screen
     *
     * @param req - Employees and IsDisplayFirstScreen
     * @return id employee
     */
    @PostMapping(path = "/update-display-first-screen", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateDisplayFirstScreenResponse> updateDisplayFirstScreen(
            @RequestBody UpdateDisplayFirstScreenRequest req) {
        return ResponseEntity.ok(employeesService.updateDisplayFirstScreen(req.getEmployeeId(),
                req.getIsDisplayFirstScreen(), req.getUpdatedDate()));
    }

}
