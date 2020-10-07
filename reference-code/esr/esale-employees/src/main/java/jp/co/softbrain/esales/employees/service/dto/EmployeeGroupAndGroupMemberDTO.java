package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * EmployeeGroupAndGroupMemberDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeeGroupAndGroupMemberDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 42424242424L;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * groupName
     */
    private String groupName;

    /**
     * groupType
     */
    private Integer groupType;

    /**
     * The EmployeesGroups isAutoGroup
     */
    private Boolean isAutoGroup;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * createdDate
     */
    private Instant updatedDate;
}
