package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.sales.domain.ProductTradings}
 * entity.
 *
 * @author LocVX
 */
@Data
@EqualsAndHashCode
public class ProgressesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3644141339786260530L;

    /**
     * productTradingProgressId
     */
    private Long productTradingProgressId;

    /**
     * progressName
     */
    private String progressName;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * progressOrder
     */
    private Long progressOrder;
}
