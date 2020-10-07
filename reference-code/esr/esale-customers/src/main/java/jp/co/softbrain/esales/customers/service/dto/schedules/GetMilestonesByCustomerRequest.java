/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Get Milestones by customer requests
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetMilestonesByCustomerRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1819601284804440380L;

    /**
     * customerId
     */
    private Long customerId;
}
