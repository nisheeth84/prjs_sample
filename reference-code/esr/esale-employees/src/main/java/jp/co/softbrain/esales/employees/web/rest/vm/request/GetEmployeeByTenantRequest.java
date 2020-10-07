package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API GetEmployeeByTenantRequest
 *
 * @author caotrandinhhuynh
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeByTenantRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1811875978440615606L;
    /**
     * The email
     */
    private String email;
}
