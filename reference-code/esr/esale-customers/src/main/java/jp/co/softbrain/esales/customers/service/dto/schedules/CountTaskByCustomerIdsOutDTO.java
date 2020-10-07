package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CountTaskByCustomerIdsOutDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CountTaskByCustomerIdsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 162637484846L;
    /**
     * customerIds
     */
    private Long customerId;
    /**
     * countTask
     */
    private Integer countTask;

}
