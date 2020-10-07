package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request of CountBusinessCardsByCustomer API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CountBusinessCardsByCustomerRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2917201078822111261L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

}
