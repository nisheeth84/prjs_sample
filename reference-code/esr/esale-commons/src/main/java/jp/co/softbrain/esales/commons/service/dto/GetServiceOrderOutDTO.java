package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetServiceOrderOutDTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class GetServiceOrderOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4827866967429895262L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * getServiceOrder
     */
    private List<ServiceOrderSubTypesDTO> data;
}
