package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesSubscriptions} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesSubscriptionsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 4068007556278727109L;
    
    private Long employeeSubscriptionId;

    /**
     * The EmployeesSubscriptions employeeId
     */
    private Long employeeId;

    /**
     * The EmployeesSubscriptions subscriptionId
     */
    private Long subscriptionId;

}
