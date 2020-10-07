/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

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
public class InitializeNetworkMapSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2694768288518775874L;

    /**
     * departmentId
     */
    private Long departmentId;
    
    /**
     * departmentName
     */
    private String departmentName;
    
    /**
     * parentId
     */
    private Long parentId;
    
    /**
     * networkStands
     */
    private List<InitializeNetworkMapSubType10DTO> networkStands;

}
