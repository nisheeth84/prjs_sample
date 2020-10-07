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
