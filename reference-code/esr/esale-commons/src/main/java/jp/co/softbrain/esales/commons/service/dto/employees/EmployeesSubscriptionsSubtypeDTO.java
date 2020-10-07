package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node data.employeesSubscriptions in response from API getEmployee
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class EmployeesSubscriptionsSubtypeDTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -9204462451546538297L;

    /**
     * The EmployeesSubscriptions subscriptionsName
     */
    private Long subscriptionsName;

    /**
     * The EmployeesSubscriptions subscriptionId
     */
    private Long subscriptionsId;
}
