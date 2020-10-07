package jp.co.softbrain.esales.commons.service.dto;
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Department Position DTO class
 */
@Data
@EqualsAndHashCode
public class DepartmentPositionDTO implements Serializable {

    private static final long serialVersionUID = 5136958214496836763L;

    /**
     * The EmployeesDepartments departmentId
     */
    private Long departmentId;

    /**
     * The EmployeesDepartments departmentName
     */
    private String departmentName;

    /**
     * The EmployeesDepartments positionId
     */
    private Long positionId;

    /**
     * The EmployeesDepartments positionName
     */
    private String positionName;
    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The Employees employeeSurName
     */
    private String employeeSurName;

    /**
     * The Employees employeeName
     */
    private String employeeName;

    /**
     * The Employees employeeFullName
     */
    private String employeeFullName;
}
