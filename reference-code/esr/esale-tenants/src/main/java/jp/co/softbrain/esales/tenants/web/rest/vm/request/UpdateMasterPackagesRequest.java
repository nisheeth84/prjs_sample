package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterPackagesRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A Data request UpdateMasterPackages API
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMasterPackagesRequest implements Serializable {

    private static final long serialVersionUID = -5398837842307854548L;
    /**
     * List data packages
     */
    private List<UpdateMasterPackagesRequestDTO> packages;
}
