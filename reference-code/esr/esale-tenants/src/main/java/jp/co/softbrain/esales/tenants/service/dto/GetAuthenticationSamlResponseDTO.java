package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The DTO response for API getAuthenticationSaml
 * 
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetAuthenticationSamlResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1444272799701061710L;
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
     * updatedDate
     */
    private Instant updatedDate;
}
