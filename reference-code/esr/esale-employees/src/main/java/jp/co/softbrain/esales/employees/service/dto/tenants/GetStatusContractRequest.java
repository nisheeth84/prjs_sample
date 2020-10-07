package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *  Data request for GetStatusContract API.
 *
 * @author lehuuhoa
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetStatusContractRequest implements Serializable {

    private static final long serialVersionUID = 195205558100998704L;
    /**
     * テナント名
     */
    private  String tenantName;
}
