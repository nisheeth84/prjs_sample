package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO use to customize response fields getting from field_info_tem entity
 */
@Data
@EqualsAndHashCode
public class CustomFieldItemDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8035355389405965249L;

    private Long itemId;
    private Boolean isAvailable;
    private Integer itemOrder;
    private Boolean isDefault;
    private String itemLabel;
    private Long itemParentId;
    private Instant updatedDate;
}
