package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * UpdateScheduleCustomerRelationResponse
 */
@Data
public class UpdateScheduleCustomerRelationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1722558400938497327L;

    private List<Long> scheduleIds;

}
