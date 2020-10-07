/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType9DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8905962752321162605L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

}
