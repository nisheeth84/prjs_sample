package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * AddCustomersToListRequest
 */
@Data
public class AddCustomersToListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9126228176634737503L;

    private Long customerListId;
    private List<Long> customerIds;
}
