package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerHistoryDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetCustomerHistoryDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1028931331631786550L;

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * createdUser
     */
    private Long createdUser;

    /**
     * contentChange
     */
    private String contentChange;

}
