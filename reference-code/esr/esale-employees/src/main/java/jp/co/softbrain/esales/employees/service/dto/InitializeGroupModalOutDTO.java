/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for InitializeGroupModal
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class InitializeGroupModalOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8277571409912180033L;

    /**
     * group
     */
    private EmployeesGroupsDTO group;

    /**
     * groups
     */
    private List<EmployeesGroupsDTO> groups;

    /**
     * groupParticipants
     */
    private List<EmployeesGroupParticipantsDTO> groupParticipants;

    /**
     * searchConditions
     */
    private List<EmployeesGroupSearchConditionsDTO> searchConditions;

    /**
     * fields
     */
    private List<CustomFieldInfoResponseWrapperDTO> customFields;

    /**
     * participantEmployees
     */
    private List<ParticipantEmployeesDTO> participantEmployees;

    /**
     * participantDepartments
     */
    private List<ParticipantDepartmentDTO> participantDepartments;

    /**
     * participantsGroups
     */
    private List<ParticipantGroupsDTO> participantGroups;

    /**
     * listUpdateTime
     */
    private String listUpdateTime;
}
