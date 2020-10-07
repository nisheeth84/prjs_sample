package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO subtype class for API deleteCustomers
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class DeleteCustomersOutSubTypeDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 9123473499271895922L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * errorCodes
     */
    private List<String> errorCodes;

}
