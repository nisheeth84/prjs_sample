package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.tenants.domain.AuthenticationSaml}
 *
 * @author TuanLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class AuthenticationSamlInDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2164719876141093605L;
    /**
     * samlId
     */
    private Long samlId;
    /**
     * tenantId
     */
    private Long tenantId;
    /**
     * isPC
     */
    private Boolean isPc;
    /**
     * isApp
     */
    private Boolean isApp;
    /**
     * referenceFieldId
     */
    private Long referenceFieldId;
    /**
     * referenceType
     */
    private Long referenceType;
    /**
     * referenceValue
     */
    private String referenceValue;
    /**
     * issuer
     */
    private String issuer;
    /**
     * certificateData
     */
    private String certificateData;
    /**
     * certificateName
     */
    private String certificateName;
    /**
     * urlLogin
     */
    private String urlLogin;
    /**
     * urLogout
     */
    private String urLogout;
    /**
     * isDeleteImage
     */
    private Boolean isDeleteImage;
}
