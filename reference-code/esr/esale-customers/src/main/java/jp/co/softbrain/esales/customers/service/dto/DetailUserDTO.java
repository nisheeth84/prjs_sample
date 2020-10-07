package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DetailUserDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class DetailUserDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5029850203958219123L;

    /**
     * mode
     */
    private String mode;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * tabId
     */
    private Integer tabId;

    /**
     * isGetChildCustomer
     */
    private Boolean isGetChildCustomer;

    /**
     * isGetDataOfEmployee
     */
    private Boolean isGetDataOfEmployee;

    /**
     * tabFilter
     */
    private GetCustomerInDTO tabFilter;

    /**
     * hasTimeLine
     */
    private Boolean hasTimeLine;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * languageKey
     */
    private String languageKey;

    /**
     * languageCode
     */
    private String languageCode;

}
