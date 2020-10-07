package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * CustomerIdOutResponse
 */
@Data
public class CustomerIdOutResponse  implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1798512164810555414L;

    /**
     * customerId
     */
    private Long customerId;

}
