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
public class UpdateDetailScreenLayoutIn2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    private Long tabInfoId;

    private Integer tabId;

    private String labelJaJp;

    private String labelEnUs;

    private String labelZhCn;

    private String labelKoKr;

    private Integer tabOrder;

    private Boolean isDisplay;

    private Boolean isDisplaySummary;

    private Integer maxRecord;

}
