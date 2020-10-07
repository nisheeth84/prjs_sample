package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API getCustomersByIds
 */
@Data
@EqualsAndHashCode
public class GetCustomersByIdsRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3365319635678761322L;
    /**
     * list id of customer
     */
    private List<Long> customerIds;

}
