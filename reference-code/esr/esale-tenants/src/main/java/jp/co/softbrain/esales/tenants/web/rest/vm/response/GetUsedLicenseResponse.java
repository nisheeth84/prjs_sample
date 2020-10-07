package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.UsedLicensePackageDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API get-used-license
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class GetUsedLicenseResponse implements Serializable {

    private static final long serialVersionUID = 4689966337069315007L;

    /**
     * List of subscriptions
     */
    private List<UsedLicensePackageDTO> packages;
}
