/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response id for Network Stands
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class NetworksStandsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8409935095900030889L;

    private Long networkStandId;
}
