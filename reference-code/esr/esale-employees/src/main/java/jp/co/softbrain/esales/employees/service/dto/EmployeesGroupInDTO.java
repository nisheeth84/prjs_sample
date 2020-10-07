package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Group inDTO for createGroup, updateGroup
 *
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class EmployeesGroupInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 842596638227780149L;

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
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The contain groupMembers
     */
    private List<EmployeeGroupSubType3DTO> groupMembers;
    
    /**
     * The contain groupParticipants
     */
    private List<EmployeeGroupSubType1DTO> groupParticipants;

    /**
     * The contain searchConditions
     */
    private List<EmployeeGroupSubType2DTO> searchConditions;

}
