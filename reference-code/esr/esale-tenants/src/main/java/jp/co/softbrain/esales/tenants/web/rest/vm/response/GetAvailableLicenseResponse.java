package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage;
import lombok.Data;

/**
 * DTO response from API get-available-license
 *
 * @author tongminhcuong
 */
@Data
public class GetAvailableLicenseResponse implements Serializable {

    private static final long serialVersionUID = 1590189150624458567L;

    /**
     * List of package
     */
    private List<AvailableLicensePackage> packages;
}
