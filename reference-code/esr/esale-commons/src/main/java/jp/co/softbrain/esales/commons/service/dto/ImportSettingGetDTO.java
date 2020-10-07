package jp.co.softbrain.esales.commons.service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.ImportSetting}
 * entity. With jsonb data object
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ImportSettingGetDTO extends BaseDTO{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3588207603097361334L;

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
    private List<ImportMappingItemDTO> mappingItem;
    
    /**
     * ImportSetting matchingKey
     */
    private ImportMappingItemDTO matchingKey;
    
    /**
     * ImportSetting matchingRelation
     */
    private List<ImportMappingItemDTO> matchingRelation;
    
    /**
     * ImportSetting noticeList
     */
    private NoticeListToDTO noticeList;
    
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
