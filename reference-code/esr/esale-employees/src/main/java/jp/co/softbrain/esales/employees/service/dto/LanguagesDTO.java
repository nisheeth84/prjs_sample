package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LanguagesDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -780078921737044818L;

    /**
     * languageId
     */
    private Long languageId;

    /**
     * languageName
     */
    private String languageName;

    /**
     * languageCode
     */
    private String languageCode;

    /**
     * The Language displayOrder
     */
    private Integer displayOrder;
}
