/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Stand DTO for response API initializeNetWorkMap
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType14DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8165416476092483584L;

    /**
     * networkStandId
     */
    private Long networkStandId;

    /**
     * standId
     */
    private Long masterStandId;

    /**
     * motivationId
     */
    private Long motivationId;

    /**
     * comment
     */
    private String comment;
}
