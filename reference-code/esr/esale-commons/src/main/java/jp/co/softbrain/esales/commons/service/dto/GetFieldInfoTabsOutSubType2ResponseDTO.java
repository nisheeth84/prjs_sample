package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Field Info Tabs
 *
 * @author phamdongdong
 */
@Data
@EqualsAndHashCode
public class GetFieldInfoTabsOutSubType2ResponseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2583139091383997499L;

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
     * The updatedDate
     */
    private Instant updatedDate;

}
