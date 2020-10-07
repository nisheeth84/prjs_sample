package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetProductTradingIdsRequest
 * 
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class GetProductTradingIdsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3058121219101343877L;
    /**
     * networkStandIds
     */
    private List<Long> businessCardIds;

}
