package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CustomerNameDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CustomerNameDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4616061917925006316L;

    private Long customerId;

    private String customerName;

}
