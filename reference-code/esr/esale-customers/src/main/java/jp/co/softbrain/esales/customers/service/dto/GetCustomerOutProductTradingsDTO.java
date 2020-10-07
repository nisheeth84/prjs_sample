package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutProductTradingsDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomerOutProductTradingsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1447996208961290290L;

    /**
     * productId
     */
    private Long productId;

    /**
     * productName
     */
    private String productName;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * businessCardName
     */
    private String businessCardName;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * progressName
     */
    private String progressName;

    /**
     * tradingDate
     */
    private String tradingDate;

    /**
     * quantity
     */
    private int quantity;

    /**
     * amount
     */
    private int amount;

}
