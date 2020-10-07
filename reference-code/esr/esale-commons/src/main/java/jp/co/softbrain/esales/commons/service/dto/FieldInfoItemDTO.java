package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfoItem}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoItemDTO extends BaseDTO implements Serializable {
    private static final long serialVersionUID = 3440530387144521098L;

    private Long itemId;
    
    private Long fieldId;

    private Boolean isAvailable;

    private Integer itemOrder;

    private Boolean isDefault;

    private String itemLabel;

    private Long itemParentId;
}
