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
public class InitializeNetworkMapSubType4DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4924330113884520438L;

    /**
     * motivationId
     */
    private Long motivationId;
    
    /**
     * motivationName
     */
    private String motivationName;
    
    /**
     * motivationIcon
     */
    private InitializeNetworkMapSubType8DTO motivationIcon;

}
