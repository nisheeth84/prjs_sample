package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Response entity for API get-all-product-trading-id
 *
 * @author phamhoainam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllProductTradingIdResponse implements Serializable {

    private static final long serialVersionUID = -8469162768297030382L;
    private List<Long> productTradingIds;
}
