package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * ProductTradingProgressOutDTO
 *
 * @author LOCVU
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ProductTradingProgressOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8862671335818900719L;

    /**
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * progressName
     */
    private String progressName;

    /**
     * progressOrder
     */
    private Long progressOrder;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * bookedOrderType
     */
    private Long bookedOrderType;

    /**
     * isEnd
     */
    private Boolean isEnd;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

}
