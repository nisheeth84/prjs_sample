package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateFeedBackInDTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class CreateFeedBackInDTO implements Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5096756243308421166L;

	/**
	 * tenantName
	 */
	private String tenantName;

	/**
	 * companyName
	 */
	private String companyName;

	/**
	 * feedbackType
	 */
	private String feedbackType;

	/**
	 * feedbackContent
	 */
	private String feedbackContent;

	/**
	 * displayType
	 */
	private String displayType;

	/**
	 * terminalType
	 */
	private String terminalType;

	/**
	 * content
	 */
	private String content;
}
