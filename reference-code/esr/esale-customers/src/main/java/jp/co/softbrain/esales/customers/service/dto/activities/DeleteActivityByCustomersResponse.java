package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API deleteActivityByCustomers
 * 
 * @author TinhBV
 */
@Data
@EqualsAndHashCode
public class DeleteActivityByCustomersResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2451887290168607026L;

    /**
     * customerIds
     */
    private List<Long> activityIds;
    
    public DeleteActivityByCustomersResponse(List<Long> activityIds) {
        this.activityIds = activityIds;
    }
}
