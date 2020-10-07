package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.NetworksStands;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link NetworksStands}
 * 
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class StandsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5915847923760840828L;

    /**
     * networkStandId
     */
    private Long networkStandId;

    /**
     * standId
     */
    private Long standId;

    /**
     * motivationId
     */
    private Long motivationId;

    /**
     * comment
     */
    private String comment;
}
