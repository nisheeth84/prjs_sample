package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO out for API updateCognitiOut
 * 
 * @author QuangLV
 */
@Data
@EqualsAndHashCode
public class UpdateCognitoOutDTO implements Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8382600665902914781L;
	/**
	 * The cognitoSettingsId
	 */
	private Long cognitoSettingsId;
}
