/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Customer Id By Name Request
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetCustomerIdByNameRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2819322127401108333L;

    private String customerName;
}
