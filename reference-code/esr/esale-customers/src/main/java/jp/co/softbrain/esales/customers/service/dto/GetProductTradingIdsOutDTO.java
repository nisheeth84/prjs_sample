/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for getProductTradingIds
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetProductTradingIdsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7249921560352915073L;

    /**
     * productTradingIds
     */
    private List<Long> productTradingIds;
}
