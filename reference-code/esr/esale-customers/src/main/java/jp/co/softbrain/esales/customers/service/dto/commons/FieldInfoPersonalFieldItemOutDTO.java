package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Field items dto
 *
 * @author nghianv
 */
@Data
@EqualsAndHashCode
public class FieldInfoPersonalFieldItemOutDTO implements Serializable {

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = 2894691140731491038L;

    /**
     * 選択肢コード
     */
    private Long itemId;

    /**
     * 選択肢名
     */
    private String itemLabel;

    /**
     * 並び順
     */
    private Integer itemOrder;

    /**
     * デフォルト
     */
    private Boolean isDefault;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
