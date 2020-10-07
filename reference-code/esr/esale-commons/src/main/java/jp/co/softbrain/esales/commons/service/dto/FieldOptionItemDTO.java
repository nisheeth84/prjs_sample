package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for API [getFieldOptionsItem]
 *
 * @author Trungnd
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldOptionItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2978898567104867472L;

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
     * fieldOptions
     */
    private List<FieldOptionDTO> fieldOptions;
}
