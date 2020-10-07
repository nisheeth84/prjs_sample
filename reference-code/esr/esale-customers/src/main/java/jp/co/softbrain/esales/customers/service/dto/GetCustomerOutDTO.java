package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.TabsInfoDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomerOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 881055362335597086L;

    /**
     * fields
     */
    private List<CustomerLayoutCustomFieldInfoDTO> fields;

    /**
     * Data detail customer
     */
    private GetCustomerOutDetailsDTO customer;

    /**
     * tabInfo
     */
    private List<TabsInfoDTO> tabsInfo;

    /**
     * dataWatchs
     */
    private GetCustomerOutDataWatchDTO dataWatchs;

    /**
     * dataTabs
     */
    private List<CustomersDataTabsDTO> dataTabs = new ArrayList<>();

    /**
     * business
     */
    private List<CustomersBusinessDTO> business;

}
