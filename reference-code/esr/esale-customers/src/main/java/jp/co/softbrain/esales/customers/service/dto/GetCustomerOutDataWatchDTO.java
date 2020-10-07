package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutDataWatchDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomerOutDataWatchDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2730892125142208541L;

    /**
     * timelineFollowedType
     */
    private Integer followTargetType;

    /**
     * timelineFollowedId
     */
    private Long followTargetId;

}
