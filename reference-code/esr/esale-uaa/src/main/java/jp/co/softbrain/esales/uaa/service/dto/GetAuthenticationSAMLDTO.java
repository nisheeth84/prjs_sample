package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.AuthenticationSaml}
 * entity.
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GetAuthenticationSAMLDTO extends BaseDTO implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 229873510648000242L;
    /**
     * serialVersionUID
     */
    /**
     * saml
     */
    private AuthenticationSamlDTO saml;
    /**
     * referenceField
     */
    private List<ReferenceFieldDTO> referenceField;

}
