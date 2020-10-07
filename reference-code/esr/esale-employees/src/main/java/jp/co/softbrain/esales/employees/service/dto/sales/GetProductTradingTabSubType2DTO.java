package jp.co.softbrain.esales.employees.service.dto.sales;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetProductTradingTabSubType2DTO
 *
 * @author ngant
 */
@Data
@EqualsAndHashCode
public class GetProductTradingTabSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4151450446851320441L;

    /**
     * totalRecord
     */
    private Long totalRecord;

    /**
     * productTradingBadge
     */
    private Long productTradingBadge;

    /**
     * productTradings
     */
    private List<ProductTradingsOutDTO> productTradings;
}
