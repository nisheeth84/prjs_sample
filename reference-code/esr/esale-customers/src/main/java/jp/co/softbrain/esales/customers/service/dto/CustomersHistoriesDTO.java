package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link CustomersHistories}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersHistoriesDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -3073784824617066773L;

    /**
     * customerHistoryId
     */
    private Long customerHistoryId;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * contentChange
     */
    private String contentChange;

    /**
     * mergedCustomerId format: { "customer_id" : [1, 2, 3, 4] }
     */
    private String mergedCustomerId;

    /**
     * customerName
     */
    private String customerName;
}
