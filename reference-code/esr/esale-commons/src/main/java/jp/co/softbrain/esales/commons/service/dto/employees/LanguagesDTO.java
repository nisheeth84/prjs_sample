package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import jp.co.softbrain.esales.commons.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.Language} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class LanguagesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -4207423971582965755L;

    /**
     * The Language languageId
     */
    private Long languageId;

    /**
     * The Language languageName
     */
    private String languageName;

    /**
     * The Language languageCode
     */
    private String languageCode;

    /**
     * The Language displayOrder
     */
    private Long displayOrder;

}
