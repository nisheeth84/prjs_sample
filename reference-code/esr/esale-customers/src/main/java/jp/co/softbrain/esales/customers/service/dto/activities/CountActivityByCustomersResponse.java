package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for API countActivityByCustomers
 * 
 * @author TinhBV
 */
@Data
@EqualsAndHashCode
public class CountActivityByCustomersResponse implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -3010640663212703705L;

    /**
     * The quantityActivityByCustomers is an array of customer with number of activity
     */
    private List<CountActivityByCustomersSubType1DTO> quantityActivityByCustomers;
}
