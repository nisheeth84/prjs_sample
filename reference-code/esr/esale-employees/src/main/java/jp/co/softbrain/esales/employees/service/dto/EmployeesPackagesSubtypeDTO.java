package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for node data.employeesPackages in response from API getEmployee
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class EmployeesPackagesSubtypeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -9204462451546538297L;

    /**
     * The EmployeesSubscriptions subscriptionsName
     */
    private String packagesName;

    /**
     * The EmployeesSubscriptions subscriptionId
     */
    private Long packagesId;

    /**
     * The Employees employeeId
     */
    private Long employeeId;
}
