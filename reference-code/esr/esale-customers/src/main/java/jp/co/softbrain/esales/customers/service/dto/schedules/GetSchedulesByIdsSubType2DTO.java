package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author trungbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType2DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -4325035281869713154L;
    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerName
     */
    private String customerName;
    /**
     * parentCustomerName
     */
    private String parentCustomerName;
    /**
     * customerAddress
     */
    private String customerAddress;
}
