package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * GetFavouriteCustomersRequest
 */
@Data
public class GetFavouriteCustomersRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 197135840975852606L;

    private List<Long> customerListFavouriteIds;
    private Long employeeId;

}
