package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.tenants.domain.AuthenticationSaml}
 *
 * @author TuanLV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AuthenticationSamlDTO extends BaseDTO implements Serializable {
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
     * isPc
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
     * certificatePath
     */
    private String certificatePath;
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
     * certificateData
     */
    private String certificateData;
}
