package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomesDataTabsDTO
 */
@Data
@EqualsAndHashCode
public class CustomersDataTabsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7068089487790518117L;

    /**
     * timelineId
     */
    private Integer tabId;

    /**
     * parentId
     */
    private Object data;

}
