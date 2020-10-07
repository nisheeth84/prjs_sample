package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomerHistorySubType1DTO customersHistory
 *
 * @author nguyenhaiduong
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomerHistorySubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 509072322837342362L;

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * createdUserId
     */
    private Long createdUserId;

    /**
     * contentChange
     */
    private String contentChange;

    /**
     * createdUserName
     */
    private String createdUserName;

    /**
     * createdUserImage
     */
    private String createdUserImage;

    /**
     * mergedCustomerId
     */
    private String mergedCustomerId;
}
