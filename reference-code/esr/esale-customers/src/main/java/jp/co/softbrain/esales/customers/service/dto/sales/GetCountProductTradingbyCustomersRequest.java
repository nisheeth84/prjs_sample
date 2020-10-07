package jp.co.softbrain.esales.customers.service.dto.sales;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Request for API GetCountProductTradingbyCustomers
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class GetCountProductTradingbyCustomersRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5566422222227433478L;

    /**
     * customerIds
     */
    private List<Long> customerIds;
}
