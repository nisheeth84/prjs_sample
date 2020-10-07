package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * DeleteCustomerOutOfListRequest
 */
@Data
public class DeleteCustomerOutOfListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6441011334017518782L;

    private Long customerListId;
    private List<Long> customerIds;

}
