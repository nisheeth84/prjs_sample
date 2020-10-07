package jp.co.softbrain.esales.uaa.service.dto.commons;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO use to customize response fields getting from field_info_tem entity
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomFieldsItemResponseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6474782657816422234L;

    /**
     * itemId
     */
    private Long itemId;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * itemOrder
     */
    private Integer itemOrder;

    /**
     * isDefault
     */
    private Boolean isDefault;

    /**
     * itemLabel
     */
    private String itemLabel;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
