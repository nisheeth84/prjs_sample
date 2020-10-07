package jp.co.softbrain.esales.commons.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class FieldItemResponse {
    private Long itemId;
    private String itemLabel;
    private Integer itemOrder;
    private Boolean isDefault;

    public FieldItemResponse(Long itemId, String itemLabel, Integer itemOrder, Boolean isDefault) {
        super();
        this.itemId = itemId;
        this.itemLabel = itemLabel;
        this.itemOrder = itemOrder;
        this.isDefault = isDefault;
    }

    public FieldItemResponse() {

    }
}
