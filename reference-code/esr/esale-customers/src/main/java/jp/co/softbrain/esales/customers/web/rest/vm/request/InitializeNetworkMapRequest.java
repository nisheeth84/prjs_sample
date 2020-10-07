/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * @author phamminhphu
 *
 */
@Data
public class InitializeNetworkMapRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * customerId
     */
    private Long customerId;
}
