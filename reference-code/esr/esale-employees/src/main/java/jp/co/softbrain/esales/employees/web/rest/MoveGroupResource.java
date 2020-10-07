package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.MoveGroupRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.MoveGroupResponse;

/**
 * @author nguyenductruong
 */
@RestController
@RequestMapping("/api")
public class MoveGroupResource {

    @Autowired
    private EmployeesGroupMembersService employeesGroupMembersService;

    /**
     * move the employee list from the source Group to the dest Group
     * 
     * @param sourceGroupId the groupId of the entity
     * @param destGroupId the groupId of the entity
     * @param employeeIds the list of employeeId
     * @return the list groupMemberId of the entity inserted
     */
    @PostMapping(path = "/move-group", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MoveGroupResponse> moveGroup(@RequestBody MoveGroupRequest req) {
        MoveGroupResponse groupResponse = new MoveGroupResponse();
        groupResponse.setList(employeesGroupMembersService.moveGroup(req.getSourceGroupId(), req.getDestGroupId(),
                req.getEmployeeIds()));
        return ResponseEntity.ok(groupResponse);
    }

}
