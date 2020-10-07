package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param API updateDetailScreenLayout
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class UpdateDetailScreenLayoutIn3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    private Long fieldInfoTabId;

    private Long fieldId;

    private Integer tabId;

    private Integer fieldOrder;

    private Boolean isColumnFixed;

    private Integer columnWidth;

}
