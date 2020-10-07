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
public class InitializeNetworkMapSubType6DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2241551723055823204L;

    /**
     * businessCardImageName
     */
    private String businessCardImageName;

    /**
     * businessCardImagePath
     */
    private String businessCardImagePath;

}
