package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * CustomerListIdOutResponse
 */
@Data
public class CustomerListIdOutResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3390312495063910148L;

    private List<Long> customerIds;

}
