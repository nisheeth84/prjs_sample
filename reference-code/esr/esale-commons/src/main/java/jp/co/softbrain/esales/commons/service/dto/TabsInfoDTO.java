package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.TabsInfo} entity.
 *
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TabsInfoDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -4313054922383751663L;
    /**
     * tabInfoId
     */
    private Long tabInfoId;
    /**
     * tabBelong
     */
    private Integer tabBelong;
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

}
