package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.InviteEmployeesRequest;

/**
 * InitializeEditModeQuery class process GraphQL query
 *
 * @author phamdongdong
 */
@RestController
@RequestMapping("/api")
public class InviteEmployeesResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * invite employees
     *
     * @param inviteEmployeesIn: List of employees will be invited
     * @return List email and member name of invited employees
     * @throws Exception when having any errors while invite employees
     */
    @PostMapping(path = "/invite-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InviteEmployeesOutDTO> getInviteEmployees(@RequestBody InviteEmployeesRequest req)
            throws Exception {
        List<InviteEmployeesInDTO> inviteEmployeesIn = req.getInviteEmployeesIn();
        return ResponseEntity.ok(employeeService.inviteEmployees(inviteEmployeesIn));
    }
}
