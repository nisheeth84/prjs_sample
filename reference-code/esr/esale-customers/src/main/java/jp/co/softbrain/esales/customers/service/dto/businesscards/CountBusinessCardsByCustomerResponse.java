package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response of CountBusinessCardsByCustomer API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CountBusinessCardsByCustomerResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5150944593444301296L;

    /**
     * businessCardsByCustomer
     */
    private String businessCardsByCustomer;
}
