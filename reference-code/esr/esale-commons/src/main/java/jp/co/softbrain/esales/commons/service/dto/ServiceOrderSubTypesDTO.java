package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateServiceOrderDTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class ServiceOrderSubTypesDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284643454154201719L;

    /**
     * serviceId
     */
    private Long serviceId;

    /**
     * serviceName
     */
    private String serviceName;

    /**
     * serviceOrder
     */
    private Integer serviceOrder;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
