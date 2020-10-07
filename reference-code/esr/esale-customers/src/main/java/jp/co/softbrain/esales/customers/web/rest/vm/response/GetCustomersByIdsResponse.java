package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsInfoCustomerDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for API getCustomersByIds
 */
@Data
@EqualsAndHashCode
public class GetCustomersByIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1057811637818221696L;
    /**
     * list customer information
     */
    private List<GetCustomersByIdsInfoCustomerDTO> customers;

}
