package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutSubType17DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class DataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9202601444549398940L;

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
     * updatedDate
     */
    private Instant updatedDate;

}
