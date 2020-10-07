package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * CountLicensePackageDTO for response API countUsedLicenses
 *
 * @author tongminhcuong
 */
@Data
public class CountLicensePackageDTO implements Serializable {

    private static final long serialVersionUID = -6465612797407172343L;

    private Long packageId;

    private Integer usedPackages;
}
