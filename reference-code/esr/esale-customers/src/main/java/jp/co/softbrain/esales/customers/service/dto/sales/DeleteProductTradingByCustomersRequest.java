package jp.co.softbrain.esales.customers.service.dto.sales;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Request for API deleteProductTradingByCustomers
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class DeleteProductTradingByCustomersRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1528678758112720565L;

    /**
     * list Id Customer
     */
    private List<Long> customerIds;

}
