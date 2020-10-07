package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO contains data about info of group participant of list
 */
@Data
@EqualsAndHashCode
public class ParticipantGroupsDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5433914944488323219L;

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
     * The EmployeesGroups lastUpdatedDate
     */
    private Instant lastUpdatedDate;

    /**
     * The EmployeesGroupParticipants participantType
     */
    private Integer participantType;

    /**
     * employeesGroups
     */
    private List<DepartmentsGroupsMembersDTO> employeesGroups;

}
