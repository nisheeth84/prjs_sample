package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerRequestDTO
 */
@Data
@EqualsAndHashCode
public class GetCustomerRequestDTO implements Serializable {

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
     * childCustomerIds
     */
    private List<Long> childCustomerIds;

    /**
     * isGetDataOfEmployee
     */
    private Boolean isGetChildCustomer;

    /**
     * isGetDataOfEmployee
     */
    private Boolean isGetDataOfEmployee;

}
