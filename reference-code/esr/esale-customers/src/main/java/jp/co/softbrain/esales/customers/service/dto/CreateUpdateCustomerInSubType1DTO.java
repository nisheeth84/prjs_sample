package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class DTO input sub type for API createCustomer - dataProductTradings
 */
@Data
@EqualsAndHashCode
public class CreateUpdateCustomerInSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6325610394589234246L;

    /**
     * mode
     */
    private String mode;

    /**
     * productTradingId
     */
    private Long productTradingId;

    /**
     * productTradings
     */
    private CreateUpdateCustomerInSubType2DTO productTradings;

    /**
     * productTradingDetails
     */
    private List<CreateUpdateCustomerInSubType3DTO> productTradingDetails;
}
