package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO for API [GetFieldRelationItem]
 *
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
public class FieldRelationItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldLabel
     */
    private String fieldLabel;

    /**
     * fieldBelong
     */
    private Long fieldBelong;

    /**
     * relationMatching
     */
    private List<FieldRelationItemDetailDTO> relationMatching;
}
