package jp.co.softbrain.esales.customers.service.dto.sales;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Request for API CountProductTrading
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class GetProgressesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7788775223777444478L;

    /**
     * isOnlyUsableData
     */
    private Boolean isOnlyUsableData;

    /**
     * productTradingProgressIds
     */
    private List<Long> productTradingProgressIds;
}
