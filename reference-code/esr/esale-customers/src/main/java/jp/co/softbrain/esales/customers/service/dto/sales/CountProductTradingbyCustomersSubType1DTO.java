package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CountProductTradingbyCustomersSubType1DTO DTO for
 * countProductTradingbyCustomers
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class CountProductTradingbyCustomersSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1133651312786260530L;

    /**
     * The customerId
     */
    private Long customerId;

    /**
     * The quantityProductTrading
     */
    private Integer quantityProductTrading;
}
