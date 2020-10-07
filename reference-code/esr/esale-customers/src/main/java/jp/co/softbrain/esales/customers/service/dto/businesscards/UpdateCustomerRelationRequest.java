package jp.co.softbrain.esales.customers.service.dto.businesscards;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * request of UpdateCustomerRelation API
 *
 * @author thanhDv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomerRelationRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5197704691302433748L;

    /**
     * the list of customerId
     */
    private List<Long> customerIds;

    /**
     * the update of customerId
     */
    private Long customerIdUpdate;

    /**
     * the update of customerName
     */
    private String customerNameUpdate;
}
