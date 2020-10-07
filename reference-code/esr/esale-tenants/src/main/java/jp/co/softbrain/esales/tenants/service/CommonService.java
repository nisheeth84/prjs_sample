package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;

/**
 * Service interface for process common.
 *
 * @author nguyenvietloi
 */
@XRayEnabled
public interface CommonService {

    /**
     * Check exist Tenant by tenantName and contractId.
     *
     * @param tenantName name of tenant
     * @param contractId id of contract
     * @return true if exist tenant matching conditions.
     */
    boolean isExistTenant(String tenantName, String contractId);

    /**
     * Get m_package_id and child_id of packages_services by tenant id
     *
     * @param tenantId id of tenant
     * @return list packageId
     */
    List<PackagesTenantDTO> getPackagesTenant(Long tenantId);

    /**
     * Get services by package ids
     *
     * @param packageIds ids of package
     * @return list {@link ServicesPackagesDTO}
     */
    List<ServicesPackagesDTO> getServicesByPackage(List<Long> packageIds);

    /**
     * Get info industry by name.
     *
     * @param industryTypeName name of industry type.
     * @return {@link IndustryDTO}
     */
    IndustryDTO getIndustry(String industryTypeName);

    /**
     * Get all packages with specified package_id list
     *
     * @param packageIds List of package_id
     * @return List of {@link PackagesDTO}
     */
    List<PackagesDTO> getPackages(List<Long> packageIds);

    /**
     * Find cognito setting info
     *
     * @param tenantName Name of Tenant
     * @param contractTenantId Id of contract
     * @return {@link CognitoSettingInfoDTO}
     */
    Optional<CognitoSettingInfoDTO> getCognitoSettingTenant(String tenantName, String contractTenantId);

    /**
     * Get all of micro service name
     *
     * @return List name of micro service
     */
    List<String> getAllSellServices();
}
