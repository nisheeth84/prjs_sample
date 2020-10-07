/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class InitializeNetworkMapCustomerDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8607891504226635664L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * parentCustomerId
     */
    private Long parentCustomerId;

    /**
     * parentCustomerName
     */
    private String parentCustomerName;

    /**
     * childCustomerId
     */
    private Long childCustomerId;
    
    /**
     * childCustomerName
     */
    private String childCustomerName;
}
