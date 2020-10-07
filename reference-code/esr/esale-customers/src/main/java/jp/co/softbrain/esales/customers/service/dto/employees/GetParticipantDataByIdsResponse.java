/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.customers.service.dto.ParticipantDepartmentDTO;
import jp.co.softbrain.esales.customers.service.dto.ParticipantEmployeesDTO;
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
    private List<EmployeesGroupsDTO> participantGroups;

}
