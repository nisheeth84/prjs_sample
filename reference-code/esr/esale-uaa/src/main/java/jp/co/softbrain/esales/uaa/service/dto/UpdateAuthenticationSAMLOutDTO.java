package jp.co.softbrain.esales.uaa.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.AuthenticationSaml}
 *
 * @author TuanLV
 */
@Data
@EqualsAndHashCode
public class UpdateAuthenticationSAMLOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6179700228178187461L;
    /**
     * samlId
     */
    private Long samlId;
}
