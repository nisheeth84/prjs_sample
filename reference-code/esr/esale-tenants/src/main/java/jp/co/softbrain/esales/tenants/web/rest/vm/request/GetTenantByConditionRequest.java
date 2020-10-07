package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API get-tenant-by-condition
 */
@Data
public class GetTenantByConditionRequest implements Serializable {
    private static final long serialVersionUID = -3091262608037570455L;

    private String tenantName;

    private String companyName;

}
