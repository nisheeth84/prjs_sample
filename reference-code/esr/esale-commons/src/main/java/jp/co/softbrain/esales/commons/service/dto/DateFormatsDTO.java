package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.DateFormats} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DateFormatsDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2362830716184182791L;

    private Long id;

    private Long dateFormatId;

    private Long languageId;

    private String dateFormat;

    private Integer displayOrder;
}
