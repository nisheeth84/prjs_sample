package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 *  Data request for GetCompanyName API
 *
 * @author lehuuhoa
 */
@Data
public class GetCompanyNameRequest implements Serializable {

    private static final long serialVersionUID = 9127291839489640022L;
    
    /**
     * テナント名
     */
    private  String tenantName;
}
