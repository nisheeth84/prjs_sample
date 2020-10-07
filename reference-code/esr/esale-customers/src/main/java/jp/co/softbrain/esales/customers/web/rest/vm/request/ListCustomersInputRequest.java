package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;
import lombok.Data;

/**
 * ListCustomersInputRequest
 */
@Data
public class ListCustomersInputRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3232500634178956764L;

    private List<CustomersInputDTO> customers;
}
