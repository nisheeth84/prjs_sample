package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.AddGroupRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.AddGroupResponse;

/**
 * AddGroupResource class process Rest
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class AddGroupResource {

    @Autowired
    private EmployeesGroupMembersService employeesGroupMembersService;

    /**
     * Add the employee list to the group
     * 
     * @param groupId the groupId of the entity.
     * @param employeeIds the employeeId list of the entity.
     * @return add group id list
     */
    @PostMapping(path = "/add-group", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AddGroupResponse> addGroup(@RequestBody AddGroupRequest input) {
        AddGroupResponse addGroupResponse = new AddGroupResponse();
        addGroupResponse.setListGroup(employeesGroupMembersService.addGroup(input.getGroupId(), input.getEmployeeIds()));
        return ResponseEntity.ok(addGroupResponse);
    }
}
