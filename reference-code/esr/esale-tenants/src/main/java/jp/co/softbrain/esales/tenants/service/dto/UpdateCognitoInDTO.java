package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO in for api updateCognito
 * 
 * @author QuangLV
 */
@Data
@EqualsAndHashCode
public class UpdateCognitoInDTO implements Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5508424440003483013L;

	/**
	 * The CognitoSettings cognito_settings_id
	 */
	private Long cognitoSettingsId;

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
	 * Meta data name
	 */
	private String metaDataName;

	/**
	 * updatedDate
	 */
	private Instant updatedDate;

	/**
	 * fileStatus
	 */
	private Boolean fileStatus;
}
