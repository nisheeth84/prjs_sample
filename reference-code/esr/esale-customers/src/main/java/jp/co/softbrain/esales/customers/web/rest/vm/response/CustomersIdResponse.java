/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CustomersIdResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5664853001813632514L;

    /**
     * customerId
     */
    private Long customerId;
}
