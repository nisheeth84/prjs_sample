package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for InitializeLocalMenu
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class InitializeLocalMenuSubType1DTO extends BaseDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -1387115717570162166L;

    /**
     * The EmployeesGroups groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    private String groupName;

    /**
     * The EmployeesGroups isAutoGroup
     */
    private Boolean isAutoGroup;

    /**
     * The EmployeesGroupParticipants participantType
     */
    private Integer participantType;
}
