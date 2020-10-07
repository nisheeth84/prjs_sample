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
public class GetImportMappingItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1049594025887435093L;

    /**
     * fieldName
     */
    private String fieldName;
    
    /**
     * field Label
     */
    private String fieldLabel;

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
}
