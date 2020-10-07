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
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType12DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1791470405382482800L;

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
    private List<InitializeNetworkMapSubType11DTO> networkStands;

}
