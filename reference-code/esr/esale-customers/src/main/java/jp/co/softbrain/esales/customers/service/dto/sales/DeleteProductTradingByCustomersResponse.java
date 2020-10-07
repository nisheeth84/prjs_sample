package jp.co.softbrain.esales.customers.service.dto.sales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Response for API deleteProductTradingByCustomers
 * @author huandv
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteProductTradingByCustomersResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1450671030112222317L;

    /**
     * list Id productTradingIds
     */
    private List<Long> productTradingIds;
}
