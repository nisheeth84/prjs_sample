package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateServiceOrderOutDTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class ServiceOrderOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284645354153201719L;

    /**
     * employeeId
     */
    private Long employeeId;
}
