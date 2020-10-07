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
 * @author buicongminh
 *
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType11DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4845962014625877184L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * stands
     */
    private InitializeNetworkMapSubType14DTO stands;

}
