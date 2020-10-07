package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupParticipants} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupParticipantsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -8458934634576026549L;

    /**
     * The EmployeesGroupParticipants employeeGroupParticipantId
     */
    private Long employeeGroupParticipantId;

    /**
     * The EmployeesGroupParticipants groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroupParticipants employeeId
     */
    private Long employeeId;

    /**
     * The EmployeesGroupParticipants departmentId
     */
    private Long departmentId;

    /**
     * The EmployeesGroupParticipants participantGroupId
     */
    private Long participantGroupId;

    /**
     * The EmployeesGroupParticipants participantType
     */
    private Integer participantType;
}
