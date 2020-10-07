package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class DTO input sub type for API createCustomer - productTradings
 */
@Data
@EqualsAndHashCode
public class CreateUpdateCustomerInSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5365789819209575513L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * amountTotal
     */
    private Long amountTotal;

    /**
     * tradingDate
     */
    private Instant tradingDate;

}
