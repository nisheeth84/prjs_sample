package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for API [GetFieldRelationItem]
 *
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
public class FieldRelationItemDetailDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldLabel
     */
    private String fieldLabel;
}
