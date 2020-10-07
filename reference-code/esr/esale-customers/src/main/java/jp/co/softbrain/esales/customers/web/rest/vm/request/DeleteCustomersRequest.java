package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * DeleteCustomersRequest
 */
@Data
public class DeleteCustomersRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1134448422044088486L;

    private List<Long> customerIds;

}
