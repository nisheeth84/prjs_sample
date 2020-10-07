package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.LicensePackages;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for the {@link LicensePackages} entity
 *
 * @author tongminhcuong
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LicensePackagesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 6776170184836525335L;

    /**
     * The id of License packages
     */
    private Long licenseId;

    /**
     * The is of master package
     */
    private Long mPackageId;

    /**
     * The id of Tenant
     */
    private Long tenantId;

    /**
     * The number of available license
     */
    private Integer availableLicenseNumber;
}
