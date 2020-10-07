package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.dto.GetParticipantDataByIdsResponse;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetInitializeGroupModalRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetParticipantDataByIdsRequest;

/**
 * InitializeGroupModalQuery class process GraphQL query
 *
 * @author nguyenductruong
 *
 */
@RestController
@RequestMapping("/api")
public class InitializeGroupModalResource {

    @Autowired
    private EmployeesGroupsService employeesGroupsService;

    /**
     * Get information to display Initialize Group Modal
     * 
     * @param groupId      groupId
     * @param isOwnerGroup true : group owner false : my group
     * @param isAutoGroup  isAutoGroup
     * @return the entity of InitializeGroupModalOutDTO
     */
    @PostMapping(path = "/initialize-group-modal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeGroupModalOutDTO> getInitializeGroupModal(
            @RequestBody GetInitializeGroupModalRequest req) {
        Long groupId = req.getGroupId();
        Boolean isOwnerGroup = req.getIsOwnerGroup();
        Boolean isAutoGroup = req.getIsAutoGroup();
        return ResponseEntity
                .ok(this.employeesGroupsService.getInitializeGroupModalInfo(groupId, isOwnerGroup, isAutoGroup));
    }

    /**
     * Get participant data by participant id
     * 
     * @param participantEmployeeIds
     * @param participantDepartmentIds
     * @param participantGroupIds
     * @return the entity of GetParticipantDataByIdsResponse
     */
    @PostMapping(path = "/get-participant-data-by-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetParticipantDataByIdsResponse> getParticipantDataByIds(
            @RequestBody GetParticipantDataByIdsRequest request) {
        List<Long> participantEmployeeIds = request.getParticipantEmployeeIds();
        List<Long> participantDepartmentIds = request.getParticipantDepartmentIds();
        List<Long> participantGroupIds = request.getParticipantGroupIds();
        return ResponseEntity.ok(this.employeesGroupsService.getParticipantDataByIds(participantEmployeeIds,
                participantDepartmentIds, participantGroupIds));
    }
    
}
