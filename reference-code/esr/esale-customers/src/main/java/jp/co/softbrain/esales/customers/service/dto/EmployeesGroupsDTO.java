package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesGroups}
 * entity.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 5457013709840517484L;

    /**
     * The EmployeesGroups groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    private String groupName;
    /**
     * The EmployeesGroups groupType
     */
    private Integer groupType;

    /**
     * The EmployeesGroups isAutoGroup
     */
    private Boolean isAutoGroup;

    /**
     * The EmployeesGroups isOverWrite
     */
    private Boolean isOverWrite;

    /**
     * The EmployeesGroups displayOrder
     */
    private Integer displayOrder;

    /**
     * The EmployeesGroupParticipants participantType
     */
    private Integer participantType;
}
