package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * CustomerIdInputRequest
 */
@Data
public class CustomerIdInputRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9202831731427938388L;

    /**
     * customerId
     */
    private Long customerId;

}
