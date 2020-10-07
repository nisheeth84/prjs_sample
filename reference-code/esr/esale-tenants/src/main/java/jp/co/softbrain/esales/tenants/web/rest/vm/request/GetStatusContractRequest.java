package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 *  Data request for GetStatusContract API.
 *
 * @author lehuuhoa
 */
@Data
public class GetStatusContractRequest implements Serializable {

    private static final long serialVersionUID = 195205558100998704L;
    /**
     * テナント名
     */
    private  String tenantName;
}
