package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API deleteActivityByCustomers
 * 
 * @author tinhbv
 */
@Data
@EqualsAndHashCode
public class DeleteActivityByCustomersRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8951020238264304944L;

    /**
     * customerIds
     */
    private List<Long> customerIds;
}
