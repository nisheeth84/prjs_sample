package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * TargetDeliverDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class TargetDeliverDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -464095477567416783L;

    /**
     * targetType
     */
    private Integer targetType;
    /**
     * targetId
     */
    private Long targetId;
    /**
     * targetName
     */
    private String targetName;
}
