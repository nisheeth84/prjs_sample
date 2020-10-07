package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetPackagesServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Query for micro service interface
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MPackagesServicesRepositoryCustom {

    /**
     * Find packages of tenant by tenant id
     *
     * @param tenantId id of tenant
     * @return list {@link PackagesTenantDTO}
     */
    List<PackagesTenantDTO> findPackagesTenant(Long tenantId);

    /**
     * Find services by package ids
     *
     * @param packageIds ids of package
     * @return list {@link ServicesPackagesDTO}
     */
    List<ServicesPackagesDTO> findServicesByPackage(List<Long> packageIds);
    
    /**
     * Get all the information about packages services.
     * @param packageServiceIds List id package services.
     * @return List {@link GetPackagesServicesDataDTO}
     */
    List<GetPackagesServicesDataDTO> getPackagesServices(List<Long> packageServiceIds);
    
}
