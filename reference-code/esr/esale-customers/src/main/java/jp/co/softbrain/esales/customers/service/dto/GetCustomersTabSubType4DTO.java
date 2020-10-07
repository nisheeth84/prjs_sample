package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api getCustomersTab
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomersTabSubType4DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400595026838591451L;

    /**
     * itemId
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
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * fieldItem
     */
    private List<FieldItemDTO> fieldItem;

}
