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
public class GetParticipantDataByIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8277571409912180033L;

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

}
