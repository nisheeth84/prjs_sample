package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.CountRelationCustomerOutDTO;
import lombok.Data;

/**
 * CountRelationCustomersResponse
 */
@Data
public class CountRelationCustomersResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5202456291730403720L;

    private List<CountRelationCustomerOutDTO> listCount;

}
