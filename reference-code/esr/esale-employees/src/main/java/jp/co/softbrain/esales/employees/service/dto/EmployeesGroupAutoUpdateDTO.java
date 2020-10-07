package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A EmployeesGroupsAutoUpdate.
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeesGroupAutoUpdateDTO implements Serializable {

    private static final long serialVersionUID = -4276071729361458791L;

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
     * The EmployeesGroupSearchConditions searchContentId
     */
    private Long searchContentId;

    /**
     * The EmployeesGroupSearchConditions fieldId
     */
    private Long fieldId;

    /**
     * The EmployeesGroupSearchConditions searchType
     */
    private Integer searchType;

    /**
     * The EmployeesGroupSearchConditions searchOption
     */
    private Integer searchOption;

    /**
     * The EmployeesGroupSearchConditions searchValue
     */
    private String searchValue;

    /**
     * timeZoneOffset
     */
    private Integer timeZoneOffset;
}
