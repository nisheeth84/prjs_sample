package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateLicensePackageDTO;

/**
 * Service interface for managing Licence
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface LicenseService {

    /**
     * Get available license by tenant name
     *
     * @param tenantName The name of tenant target
     * @return object contains information of subscriptions and options
     */
    ContractSiteResponseDTO getAvailableLicense(String tenantName);

    /**
     * Get used license by contract id
     *
     * @param contractTenantId The id of contract
     * @return object contains information of subscriptions and options
     */
    ContractSiteResponseDTO getUsedLicense(String contractTenantId);

    /**
     * Update license
     *
     * @param contractTenantId The id of Contract
     * @param updatePackages List of license packages
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO updateLicenses(String contractTenantId, List<UpdateLicensePackageDTO> updatePackages);
}
