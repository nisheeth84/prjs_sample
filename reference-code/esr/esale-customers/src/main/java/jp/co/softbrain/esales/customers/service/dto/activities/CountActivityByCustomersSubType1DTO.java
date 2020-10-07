package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO output for API countActivityByCustomers
 * 
 * @author TinhBV
 */
@Data
@EqualsAndHashCode
public class CountActivityByCustomersSubType1DTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2935526938848994237L;

    /**
     * The customerId
     */
    private Long customerId;

    /**
     * The quantityActivity
     */
    private Integer quantityActivity;
}
