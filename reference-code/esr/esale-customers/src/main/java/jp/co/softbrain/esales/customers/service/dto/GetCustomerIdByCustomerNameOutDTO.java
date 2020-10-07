package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomerIdByCustomerNameOutDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomerIdByCustomerNameOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4835315811526139177L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
