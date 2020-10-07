package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * UsedLicensePackageDTO for response of API getUsedLicense
 *
 * @author tongminhcuong
 */
@Data
public class UsedLicensePackageDTO implements Serializable {

    private static final long serialVersionUID = -8726771427312292181L;

    private String packageName;

    private Long usedPackage;
}
