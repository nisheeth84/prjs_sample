package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerIdDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CustomerIdDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * customerId
     */
    private Long customerId;

}
