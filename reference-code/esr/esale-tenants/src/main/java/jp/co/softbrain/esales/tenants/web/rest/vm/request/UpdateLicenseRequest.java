package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import jp.co.softbrain.esales.tenants.service.dto.UpdateLicensePackageDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Request DTO for API update-license
 *
 * @author tongminhcuong
 */
@Data
public class UpdateLicenseRequest implements Serializable {

    private static final long serialVersionUID = -3378501593352396847L;

    /**
     * The id of contract
     */
    private String contractTenantId;

    /**
     * List of Package
     */
    private List<UpdateLicensePackageDTO> packages;
}
