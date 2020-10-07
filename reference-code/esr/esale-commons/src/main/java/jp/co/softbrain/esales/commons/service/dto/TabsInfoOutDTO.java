package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for getTabsInfo
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class TabsInfoOutDTO implements Serializable {

    private static final long serialVersionUID = 7363056044501183670L;

    /**
     * tabInfoId
     */
    private Long tabInfoId;
    
    /**
     * tabId
     */
    private Integer tabId;

    /**
     * tabLabel
     */
    private String tabLabel;

    /**
     * tabOrder
     */
    private Integer tabOrder;
    
    /**
     * isDisplay
     */
    private Boolean isDisplay;
    
    /**
     * isDisplaySummary
     */
    private Boolean isDisplaySummary;
    
    /**
     * maxRecord
     */
    private Integer maxRecord;
    
    /**
     * The updatedDate
     */
    private Instant updatedDate;

}
