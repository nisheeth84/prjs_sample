package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.service.dto.BaseDTO;
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
