package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response DTO for API [GetFieldRelationItem]
 *
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class FieldRelationItem1DTO implements Serializable {

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
     * relationFieldBelong
     */
    private Long relationFieldBelong;

    /**
     * relationFieldId
     */
    private Long relationFieldId;

    /**
     * relationFieldLabel
     */
    private String relationFieldLabel;
}
