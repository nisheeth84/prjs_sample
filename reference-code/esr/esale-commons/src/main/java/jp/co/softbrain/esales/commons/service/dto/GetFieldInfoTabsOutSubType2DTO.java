package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The Field Info Tabs
 * @author phamdongdong
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetFieldInfoTabsOutSubType2DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -7398861740927883063L;
    
    /**
     * fieldId
     */
    private Long fieldId;
    
    /**
     * fieldInfoTabId
     */
    private Long fieldInfoTabId;
    
    /**
     * fieldInfoTabPersonalId
     */
    private Long fieldInfoTabPersonalId;
    
    /**
     * fieldOrder
     */
    private Integer fieldOrder;
    
    /**
     * fieldName
     */
    private String fieldName;
    
    /**
     * fieldLabel
     */
    private String fieldLabel;
    
    /**
     * fieldType
     */
    private Integer fieldType;
    
    /**
     * isColumnFixed
     */
    private Boolean isColumnFixed;
    
    /**
     * columnWidth
     */
    private Integer columnWidth;
    
    /**
     * itemId
     */
    private Long itemId;
    
    /**
     * itemLabel
     */
    private String itemLabel;
    
    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
