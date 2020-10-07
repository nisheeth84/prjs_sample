package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesDepartments} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesDepartmentsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 4384122767706651393L;

    /**
     * Id of EmployeesDepartments
     */
    private Long employeesDepartmentsId;

    /**
     * The EmployeesDepartments employeeId
     */
    private Long employeeId;

    /**
     * The EmployeesDepartments departmentId
     */
    private Long departmentId;

    /**
     * The EmployeesDepartments positionId
     */
    private Long positionId;

    /**
     * The EmployeesDepartmentsDTO managerId
     */
    private Long managerId;
}
