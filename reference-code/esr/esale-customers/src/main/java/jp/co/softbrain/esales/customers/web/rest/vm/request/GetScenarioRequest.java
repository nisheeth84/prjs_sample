/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Get scenario request
 * 
 * @author phamminhphu
 */
@Data
public class GetScenarioRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -279423507601644117L;

    /**
     * customerId
     */
    private Long customerId;
}
