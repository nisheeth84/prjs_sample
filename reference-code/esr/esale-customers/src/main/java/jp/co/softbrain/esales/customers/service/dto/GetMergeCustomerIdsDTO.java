/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO response for API get
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetMergeCustomerIdsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -376103785033477163L;

    /**
     * mergedCustomerId
     */
    private Long mergedCustomerId;

    /**
     * customerId
     */
    private Long customerId;
}
