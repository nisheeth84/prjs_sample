package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfoPersonal}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoPersonalDTO extends BaseDTO implements Serializable {
	private static final long serialVersionUID = -2034763718517851386L;

	private Long fieldInfoPersonalId;

	private Long employeeId;

	private Long fieldId;

	private Integer extensionBelong;

	private Integer fieldOrder;

	private Boolean isColumnFixed;

	private Integer columnWidth;

	private Long relationFieldId;

}
