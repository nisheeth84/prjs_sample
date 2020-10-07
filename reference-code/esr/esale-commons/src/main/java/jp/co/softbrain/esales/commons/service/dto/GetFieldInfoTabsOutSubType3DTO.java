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
public class GetFieldInfoTabsOutSubType3DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2194568089630059235L;
    
    /**
     * itemId
     */
    private Long fieldId;
    
    /**
     * fieldLabel
     */
    private String fieldLabel;
    
    /**
     * fieldType
     */
    private Integer fieldType;
    
    /**
     * fieldOrder
     */
    private Integer fieldOrder;
    
    /**
     * fieldName
     */
    private String fieldName;

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
