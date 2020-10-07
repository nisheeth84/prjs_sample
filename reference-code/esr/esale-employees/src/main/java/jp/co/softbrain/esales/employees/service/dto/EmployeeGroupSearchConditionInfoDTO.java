/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for api getGroupSearchCondition
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeGroupSearchConditionInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6954887754397678678L;

    /**
     * The EmployeesGroupSearchConditions searchContentId
     */
    private Long searchContentId;

    /**
     * The EmployeesGroupSearchConditions groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroupSearchConditions fieldId
     */
    private Long fieldId;

    /**
     * The EmployeesGroupSearchConditions searchType
     */
    private Integer searchType;

    /**
     * The EmployeesGroupSearchConditions fieldOrder
     */
    private Integer fieldOrder;

    /**
     * The EmployeesGroupSearchConditions searchOption
     */
    private Integer searchOption;

    /**
     * The EmployeesGroupSearchConditions fieldValue
     */
    private String fieldValue;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * field label
     */
    private String fieldLabel;
    /**
     * fieldType
     */
    private Integer fieldType;
}
