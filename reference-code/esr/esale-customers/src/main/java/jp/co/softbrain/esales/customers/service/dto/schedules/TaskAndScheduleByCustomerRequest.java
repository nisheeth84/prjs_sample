package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request for API getTasksAndSchedulesByCustomerIds
 */
@Data
public class TaskAndScheduleByCustomerRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7427333437456126601L;

    private List<Long> customerIds;

}
