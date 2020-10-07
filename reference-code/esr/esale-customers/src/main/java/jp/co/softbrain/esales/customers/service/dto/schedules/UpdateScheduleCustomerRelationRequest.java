package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * UpdateScheduleCustomerRelationRequest
 */
@Data
public class UpdateScheduleCustomerRelationRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1909279771423360353L;

    private List<Long> customerIds;

    private Long customerIdUpdate;

}
