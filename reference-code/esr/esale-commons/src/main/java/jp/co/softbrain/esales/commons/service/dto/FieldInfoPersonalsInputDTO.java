package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Search condition dto
 *
 * @author nghianv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class FieldInfoPersonalsInputDTO implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4954407396876528109L;

	/**
	 * employee Id
	 */
	private Long employeeId;

	/**
	 * 使用機能
	 */
	private Integer fieldBelong;

	/**
	 * extension Belong
	 */
	private Integer extensionBelong;

	/**
	 * selectedTargetType
	 */
	private Integer selectedTargetType;

	/**
	 * selectedTargetId
	 */
	private Long selectedTargetId;
}
