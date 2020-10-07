package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for UpdateFieldInfoPersonal
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFieldInfoPersonalInDTO implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4602312314710928053L;

	/**
	 * field Id
	 */
	private Long fieldId;

	/**
	 * field Order
	 */
	private Integer fieldOrder;

	/**
	 * isColumnFixed
	 */
	private Boolean isColumnFixed;

	/**
	 * columnWidth
	 */
	private Integer columnWidth;

	/**
	 * updateDate
	 */
	private Instant updatedDate;

	/**
	 * relationFieldId
	 */
	private Long relationFieldId;

}
