package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupInDTO;
import jp.co.softbrain.esales.employees.service.dto.GetFullEmployeesByParticipantRequest;
import jp.co.softbrain.esales.employees.service.dto.GetFullEmployeesByParticipantResponse;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsRequest;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupsOutDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.vm.request.DeleteGroupRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetGroupsRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.LeaveGroupRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.RefreshAutoGroupRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CreateGroupResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.DeleteGroupResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.LeaveGroupResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RefreshAutoGroupResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateGroupResponse;

/**
 * GetGroupsQuery class process GraphQL Query
 *
 * @author TranTheDuy
 */
@RestController
@RequestMapping("/api")
public class EmployeesGroupsResource {

    @Autowired
    private EmployeesGroupsService employeesGroupsService;

    @Autowired
    private EmployeesGroupMembersService employeesGroupMembersService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Get groups by groupIds
     *
     * @param groupIds groupIds get
     * @param getEmployeesFlg confirm flag get employee information.
     * @return information groups and employees
     */
    @PostMapping(path = "/get-groups", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetGroupsOutDTO> getGroups(@RequestBody GetGroupsRequest req) {
        return ResponseEntity.ok(employeesGroupsService.getGroups(req.getGroupIds(), req.getGetEmployeesFlg(),
                jwtTokenUtil.getLanguageKeyFromToken()));
    }

    /**
     * Delete employees group member by groupId and employeeIds.
     *
     * @param groupId group id remove employees.
     * @param employeeIds employees id remove group.
     * @return list employeeId leaved.
     */
    @PostMapping(path = "/leave-groups", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LeaveGroupResponse> leaveGroup(@RequestBody LeaveGroupRequest request) {
        LeaveGroupResponse leaveGroupResponse = new LeaveGroupResponse();
        leaveGroupResponse.setEmployeeIds(
                employeesGroupMembersService.leaveGroup(request.getGroupId(), request.getEmployeeIds()));
        return ResponseEntity.ok(leaveGroupResponse);
    }

    /**
     * Delete employee's group by groupId.
     *
     * @param groupId group id delete.
     * @return id group has been removed.
     */
    @PostMapping(path = "/delete-groups", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DeleteGroupResponse> deleteGroup(@RequestBody DeleteGroupRequest request) {
        DeleteGroupResponse deleteGroupResponse = new DeleteGroupResponse();
        deleteGroupResponse.setGroupId(employeesGroupsService.deleteGroup(request.getGroupId()));
        return ResponseEntity.ok(deleteGroupResponse);
    }

    /**
     * Refresh auto group
     *
     * @param request request
     */
    @PostMapping(path = "/refresh-auto-group", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RefreshAutoGroupResponse> updateAutoGroup(@RequestBody RefreshAutoGroupRequest request) {
        return ResponseEntity.ok(employeesGroupsService.refreshAutoGroup(request.getIdOfList()));
    }

    /**
     * Perform Group registration (case of creating and copying groups)
     *
     * @param groupParams the information group
     * @return the groupId of the entity inserted
     */
    @PostMapping(path = "/create-groups", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateGroupResponse> createGroup(@RequestBody EmployeesGroupInDTO groupParams) {
        CreateGroupResponse createGroupResponse = new CreateGroupResponse();
        createGroupResponse.setGroupId(employeesGroupsService.createGroup(groupParams));
        return ResponseEntity.ok(createGroupResponse);
    }

    /**
     * Update change Group information
     *
     * @param groupParams the information group
     * @return the groupId of the entity updated
     */
    @PostMapping(path = "/update-groups", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateGroupResponse> updateGroup(@RequestBody EmployeesGroupInDTO groupParams) {
        UpdateGroupResponse updateAutoGroupResponse = new UpdateGroupResponse();
        updateAutoGroupResponse.setGroupId(employeesGroupsService.updateGroup(groupParams));
        return ResponseEntity.ok(updateAutoGroupResponse);
    }

    /**
     * Get group suggestions
     *
     * @param searchValue - key word to search
     * @return list suggest
     */
    @PostMapping(path = "/get-group-suggestions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetGroupSuggestionsResponseDTO> getGroupSuggestions(
            @RequestBody GetGroupSuggestionsRequest request) {
        return ResponseEntity.ok(employeesGroupsService.getGroupSuggestions(request.getSearchValue()));
    }

    /**
     * Get all employee id from participant id. <Br/>
     *
     * @param GetFullEmployeesByParticipantRequest - participant id
     * @return list employee id result
     */
    @PostMapping(path = "/get-full-employees-by-participant", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFullEmployeesByParticipantResponse> getFullEmployeesByParticipant(
            @RequestBody GetFullEmployeesByParticipantRequest request) {
        List<Long> employeeIds = request.getEmployeeIds();
        List<Long> departmentIds = request.getDepartmentIds();
        List<Long> groupIds = request.getGroupIds();
        return ResponseEntity
                .ok(employeesGroupsService.getFullEmployeesByParticipant(employeeIds, departmentIds, groupIds));
    }

}
