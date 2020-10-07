package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetServiceOrderSubTypeDTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class GetServiceOrderSubTypeDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4827867867429895262L;

    /**
     * serviceId
     */
    private Long serviceId;

}
