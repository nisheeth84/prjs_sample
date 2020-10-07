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
public class InitializeNetworkMapSubType5DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5727067420810432266L;

    /**
     * tradingProductId
     */
    private Long tradingProductId;
    
    /**
     * tradingProductName
     */
    private String tradingProductName;
}
