package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.Data;

/**
 * UpdateGeocodingCustomerRequest
 */
@Data
public class UpdateGeocodingCustomerRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7920452911943334722L;

    private Long customerId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Instant updatedDate;

}
