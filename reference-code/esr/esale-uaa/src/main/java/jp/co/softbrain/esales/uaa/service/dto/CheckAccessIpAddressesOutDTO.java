package jp.co.softbrain.esales.uaa.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * The DTO for API
 */
@Data
@EqualsAndHashCode
public class CheckAccessIpAddressesOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 6060066750323281981L;

    /**
     * The isAccept
     */
    private Boolean isAccept;
}
