package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.tenants.domain.AuthenticationSaml}
 *
 * @author TuanLV
 */
@Data
@EqualsAndHashCode
public class GetAuthenticationSamlOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2164719876141093605L;

    /**
     * saml
     */
    private GetAuthenticationSamlResponseDTO saml;

    /**
     * referenceField
     */
    private List<ReferenceFieldDTO> referenceField;
}
