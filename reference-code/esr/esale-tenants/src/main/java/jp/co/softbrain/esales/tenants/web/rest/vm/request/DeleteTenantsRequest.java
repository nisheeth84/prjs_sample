package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request entity for API delete-tenants
 */
@Data
public class DeleteTenantsRequest implements Serializable {
    private static final long serialVersionUID = 6695894924968410434L;

    private List<Long> tenantIds;
}
