/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Save network map response
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3886871943046005149L;

    /**
     * networkStandId
     */
    private List<Long> networkStandId;
}
