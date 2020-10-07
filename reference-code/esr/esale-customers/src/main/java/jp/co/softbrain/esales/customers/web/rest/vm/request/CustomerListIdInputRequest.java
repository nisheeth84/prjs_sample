package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * CustomerListIdInputRequest
 */
@Data
public class CustomerListIdInputRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5528699634806904331L;

    private List<Long> customerIds;

}
