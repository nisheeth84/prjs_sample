package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupMembers} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupMembersDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 2581133766798375248L;

    /**
     * The EmployeesGroupMembers groupMemberId
     */
    private Long groupMemberId;

    /**
     * The EmployeesGroupMembers groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroupMembers employeeId
     */
    private Long employeeId;

}
