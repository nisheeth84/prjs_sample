package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesPackages} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesPackagesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -1898823450214090510L;

    /**
     * The EmployeesPackages employeePackageId
     */
    private Long employeePackageId;

    /**
     * The EmployeesPackages employeeId
     */
    private Long employeeId;

    /**
     * The EmployeesPackages packageId
     */
    private Long packageId;
}
