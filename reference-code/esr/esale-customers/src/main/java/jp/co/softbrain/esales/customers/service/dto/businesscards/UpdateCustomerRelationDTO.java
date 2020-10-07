package jp.co.softbrain.esales.customers.service.dto.businesscards;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * UpdateCustomerRelationDTO
 * @author vuvietdung
 */
@Data
@EqualsAndHashCode
public class UpdateCustomerRelationDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1694605928937762752L;

    /**
     * productTradingIds
     */
    private List<Long> productTradingIds;
}
