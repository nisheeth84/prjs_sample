package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class DTO input sub type for API createCustomer - productTradingDetails
 */
@Data
@EqualsAndHashCode
public class CreateUpdateCustomerInSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8589149774991140771L;

    /**
     * productId
     */
    private Long productId;

    /**
     * quantity
     */
    private Integer quantity;

    /**
     * price
     */
    private Long price;

    /**
     * amount
     */
    private Long amount;

    /**
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * endPlanDate
     */
    private Instant endPlanDate;

    /**
     * orderPlanDate
     */
    private Instant orderPlanDate;

    /**
     * memo
     */
    private String memo;

    /**
     * productTradingDetailData
     */
    private List<CustomerDataTypeDTO> productTradingDetailData;
}
