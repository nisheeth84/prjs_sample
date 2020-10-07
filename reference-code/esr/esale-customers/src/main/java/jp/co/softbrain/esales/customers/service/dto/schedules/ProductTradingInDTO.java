package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * ProductTradingIdsInput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ProductTradingInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1191148824144698442L;

    /**
     * productTradingId
     */
    private Long productTradingId;

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
     * amount
     */
    private Long amount;

    /**
     * tradingDate
     */
    private Instant tradingDate;
}
