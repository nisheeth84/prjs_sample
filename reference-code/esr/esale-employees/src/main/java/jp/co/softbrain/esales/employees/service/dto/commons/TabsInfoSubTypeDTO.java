package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.BaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.TabsInfoSubTypeDTO} entity.
 *
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TabsInfoSubTypeDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -5153552894028059402L;
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

    /**
     * summaryFilterValue
     */
    private List<SummaryFilterValueDTO> summaryFilterValue;

    /**
     * summaryOrderBy
     */
    private List<SummaryOrderByDTO> summaryOrderBy;

    /**
     * tabOrderBy
     */
    private List<TabOrderByDTO> tabOrderBy;

}
