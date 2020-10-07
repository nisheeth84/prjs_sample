package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.TenantServicesResDTO;
import lombok.Data;

/**
 * Response entity for API get-tenant-services
 */
@Data
public class GetTenantServicesResponse implements Serializable {

    private static final long serialVersionUID = 5006750505406730393L;

    private List<TenantServicesResDTO> tenantServices;

}
