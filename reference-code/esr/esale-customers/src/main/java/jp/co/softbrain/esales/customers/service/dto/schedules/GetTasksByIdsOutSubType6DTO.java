package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType6DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType6DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 526272574576571L;
    /**
     * customerId
     */
    private Long customerId;
    /**
     * parentCustomerName
     */
    private String parentCustomerName;
    /**
     * customerName
     */
    private String customerName;
    /**
     * customerAddress
     */
    private String customerAddress;

}
