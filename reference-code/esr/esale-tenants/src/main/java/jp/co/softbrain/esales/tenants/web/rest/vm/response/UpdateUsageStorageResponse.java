package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import jp.co.softbrain.esales.tenants.service.dto.UpdateUsageStorageResponseDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Response for UpdateUsageStorage api
 *
 * @author nguyenvietloi
 */
@Data
public class UpdateUsageStorageResponse implements Serializable {

    private static final long serialVersionUID = 1777768758091720465L;

    private List<UpdateUsageStorageResponseDTO> updateUsageStorageResponses;
}
