package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API countActivityByCustomers
 * 
 * @author tinhbv
 */
@Data
@EqualsAndHashCode
public class CountActivityByCustomersRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -500024472903906486L;

    /**
     * customerIds
     */
    private List<Long> customerIds;
}
