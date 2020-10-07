package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node data.tabInfo of response from API getEmployee
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class TabsInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7544257186433679489L;

    /**
     * tabInfoId
     */
    private Long tabInfoId;

    /**
     * tabId
     */
    private Integer tabId;
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
     * labelName
     */
    private String tabLabel;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
