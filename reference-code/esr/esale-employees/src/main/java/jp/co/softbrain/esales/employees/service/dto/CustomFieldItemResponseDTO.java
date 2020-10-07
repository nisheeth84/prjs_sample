package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO use to customize response fields getting from field_info_tem entity
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class CustomFieldItemResponseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2862932621896841548L;

    private Long itemId;
    private Boolean isAvailable;
    private Integer itemOrder;
    private Boolean isDefault;
    private String itemLabel;
}
