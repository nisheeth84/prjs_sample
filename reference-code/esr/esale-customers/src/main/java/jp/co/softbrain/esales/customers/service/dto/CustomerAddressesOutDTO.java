package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class DTO out for API getCustomerAddresses
 */
@Data
@EqualsAndHashCode
public class CustomerAddressesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3617442251921971034L;

    /**
     * customerAddress
     */
    private List<CustomerAddressesOutSubTypeDTO> customerAddresses;

}
