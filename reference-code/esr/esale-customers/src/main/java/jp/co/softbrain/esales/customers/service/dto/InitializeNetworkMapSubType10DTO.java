/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType10DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8217954003292941270L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * stands
     */
    private NetworksStandsDTO stands;

}
