package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupSearchConditions}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupSearchConditionsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -6474266276993248633L;

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
     * The EmployeesGroupSearchConditions searchValue
     */
    private String searchValue;

    /**
     * timeZoneOffset
     */
    private Integer timeZoneOffset;
}
