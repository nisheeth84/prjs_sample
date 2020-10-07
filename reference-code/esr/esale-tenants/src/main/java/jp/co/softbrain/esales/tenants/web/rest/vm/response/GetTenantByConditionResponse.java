package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;
import lombok.Data;

/**
 * Response entity for API get-tenant-by-condition
 */
@Data
public class GetTenantByConditionResponse implements Serializable {
    private static final long serialVersionUID = -6258219164764183646L;

    private List<TenantByConditionDTO> tenants;

}
