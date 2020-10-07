package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutTabsInfoDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomerOutTabsInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 342245452798620432L;

    /**
     * tabId
     */
    private Long tabId;

    /**
     * tabLabel
     */
    private String tabLabel;

    /**
     * isDisplay
     */
    private Boolean isDisplay;

    /**
     * isDisplaySumary
     */
    private Boolean isDisplaySummary;

    /**
     * maxRecord
     */
    private int maxRecord;

    /**
     * tabOrder
     */
    private int tabOrder;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
