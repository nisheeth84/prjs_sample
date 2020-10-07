package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ImportSetting}
 * entity.
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ImportSettingDTO extends BaseDTO{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3387252918829050341L;

    /**
     * ImportSetting importId
     */
    private Long importId;
    
    /**
     * ImportSetting serviceId
     */
    private Integer serviceId;
    
    /**
     * ImportSetting importFileName
     */
    private String importFileName;
    
    /**
     * ImportSetting importFilePath
     */
    private String importFilePath;
    
    /**
     * ImportSetting isSimulationMode
     */
    private Boolean isSimulationMode;
    
    /**
     * ImportSetting importAction
     */
    private Integer importAction;
    
    /**
     * ImportSetting isDuplicateAllowed
     */
    private Boolean isDuplicateAllowed;
    
    /**
     * ImportSetting mappingItem
     */
    private String mappingItem;
    
    /**
     * ImportSetting matchingKey
     */
    private String matchingKey;
    
    /**
     * ImportSetting matchingRelation
     */
    private String matchingRelation;
    
    /**
     * ImportSetting noticeList
     */
    private String noticeList;
    
    /**
     * ImportSetting isAutoPostTimeline
     */
    private Boolean isAutoPostTimeline;
    
    /**
     * ImportSetting listId
     */
    private Long listId;
    
    /**
     * ImportSetting languageCode
     */
    private String languageCode;
}
