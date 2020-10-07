package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomerIdOutDTO
 *
 * @author buicongminh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomerIdOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 509072322837342362L;

    /**
     * getCustomerIdOutDTO
     */
    private List<CustomerIdOutDTO> customerNames;

}
