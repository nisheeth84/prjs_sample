package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import lombok.Data;

/**
 * GetCustomersIdRequest
 *
 * @author buicongminh
 */
@Data
public class GetCustomerIdRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8533833679867891486L;

    /**
     * customerName
     */
    private String customerName;

}
