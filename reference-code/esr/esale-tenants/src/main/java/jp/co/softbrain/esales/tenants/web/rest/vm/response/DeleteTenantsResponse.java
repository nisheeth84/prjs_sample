package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.TenantDeleteResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API delete-tenants
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteTenantsResponse implements Serializable {
    private static final long serialVersionUID = -4508680990819042593L;

    private List<TenantDeleteResponseDTO> deleteResponses;
}
