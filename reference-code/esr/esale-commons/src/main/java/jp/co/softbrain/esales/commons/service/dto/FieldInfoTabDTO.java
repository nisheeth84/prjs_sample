package jp.co.softbrain.esales.commons.service.dto;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfoTab}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoTabDTO extends BaseDTO implements Serializable {
    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = -2550865548173568610L;

    private Long fieldInfoTabId;

    /**
     * The fieldId
     */
    private Long fieldId;

    /**
     * The tabBelong
     */
    private Integer tabBelong;

    /**
     * the fieldOrder
     */
    private Integer fieldOrder;

    /**
     * the tabId
     */
    private Integer tabId;
}
