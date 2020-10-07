package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfoItemLabelDTO}
 * entity.
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoItemLabelDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 2971851513547296698L;

    /**
     * 選択肢コード
     */
    private Long itemId;

    /**
     * The fieldId
     */
    private Long fieldId;

    /**
     * 項目名
     */
    private String fieldName;

    /**
     * 選択肢名
     */
    private String itemLabel;

}
