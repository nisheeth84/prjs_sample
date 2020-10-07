package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * ScheduleCountByCustomerDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleCountByCustomerDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 325665626910420365L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * number of schedule
     */
    private Integer numberOfSchedule;

}
