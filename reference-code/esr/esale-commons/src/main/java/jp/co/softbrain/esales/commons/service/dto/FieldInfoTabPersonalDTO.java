package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.commons.domain.FieldInfoTabPersonal} entity.
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoTabPersonalDTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 4759831222055080607L;

    /**
     * The fieldInfoTabPersonalId
     */
    private Long fieldInfoTabPersonalId;

    /**
     * The fieldInfoTabId
     */
    private Long fieldInfoTabId;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The isColumnFixed
     */
    private boolean isColumnFixed;

    /**
     * The columnWidth
     */
    private Integer columnWidth;

}
