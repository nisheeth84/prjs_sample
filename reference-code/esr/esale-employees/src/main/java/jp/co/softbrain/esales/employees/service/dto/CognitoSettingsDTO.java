package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link CognitoSettings}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CognitoSettingsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 4125803430933131344L;

    /**
     * The CognitoSettings cognito_settings_id
     */
    private Long cognitoSettingsId;

    /**
     * The CognitoSettings tenant_id
     */
    private Long tenantId;

    /**
     * clientId
     */
    private String clientId;

    /**
     * userPoolId
     */
    private String userPoolId;

    /**
     * Is PC
     */
    private Boolean isPc;

    /**
     * Is App
     */
    private Boolean isApp;

    /**
     * Name of Provider
     */
    private String providerName;

    /**
     * Reference Value
     */
    private String referenceValue;

    /**
     * Meta data path
     */
    private String metaDataPath;

    /**
     * Meta data name
     */
    private String metaDataName;
}
