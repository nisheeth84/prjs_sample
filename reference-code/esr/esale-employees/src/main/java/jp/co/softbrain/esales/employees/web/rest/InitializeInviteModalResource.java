package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.InitializeInviteModalDTO;

/**
 * InitializeEditModeQuery class process GraphQL query
 *
 * @author phamdongdong
 *
 */
@RestController
@RequestMapping("/api")
public class InitializeInviteModalResource {

    @Autowired
    private EmployeesService employeeService;

    /**
     * Get data to initialize Invite employee screen
     * @return data: departments info, subscriptions info, options info
     */
    @PostMapping(path = "/get-initialize-invite-modal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeInviteModalDTO> getInitializeInviteModal() {
        return ResponseEntity.ok(this.employeeService.getInitializeInviteModal());
    }
}
