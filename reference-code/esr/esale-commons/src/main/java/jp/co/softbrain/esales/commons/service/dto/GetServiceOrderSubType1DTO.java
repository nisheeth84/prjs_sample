package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * GetServiceOrderSubType1DTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class GetServiceOrderSubType1DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4827866967429895262L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * data
     */
    private List<ServiceOrderSubTypesDTO> data;
}
