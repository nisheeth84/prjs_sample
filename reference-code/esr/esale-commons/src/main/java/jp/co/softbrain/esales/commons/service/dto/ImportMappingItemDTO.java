package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response for get-import-mapping-item API
 * @author dohuyhai
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ImportMappingItemDTO implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1164010354669922315L;

    /**
     * fieldName
     */
    private String fieldName;
    
    /**
     * columnCsv
     */
    private Integer columnCsv;
    
    /**
     * isDefault
     */
    private Boolean isDefault;
    
    /**
     * fieldType
     */
    private Integer fieldType;
    /**
     * 
     */
    private String fieldLabel;
    
    /**
     * matchingFieldId
     */
    private Long matchingFieldId;
    
    /**
     * fieldLabel
     */
    private Integer modifyFlag;
}
