package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetPackagesServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesByPackageIdDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;

/**
 * Service interface for packages services.
 *
 * @author nguyenvietloi
 */
@XRayEnabled
public interface MPackagesServicesService {

    /**
     * Find packageIds of tenant by tenant id
     *
     * @param tenantId id of tenant
     * @return list packageId
     */
    List<Long> findPackageIdsOfTenant(Long tenantId);

    /**
     * Find services by package ids
     *
     * @param packageIds ids of package
     * @return list {@link ServicesPackagesDTO}
     */
    List<ServicesPackagesDTO> findServicesByPackageIds(List<Long> packageIds);

    /**
     * Find micro service name of tenant by packageIds
     *
     * @param packageIds ids of package
     * @return list micro service name
     */
    List<String> findMicroServiceNameOfTenant(List<Long> packageIds);

    /**
     * Get a list of service names according to the specified id package.
     *
     * @param packageIds ids of package
     * @return list {@link ServicesByPackageIdDataDTO}
     */
    List<ServicesByPackageIdDataDTO> getServicesByPackageIds(List<Long> packageIds);

    /**
     * Get all the information about package services.
     * 
     * @param packageServiceIds List id package Services
     * @return {@link GetPackagesServicesDataDTO}
     */
    List<GetPackagesServicesDataDTO> getPackagesServices(List<Long> packageServiceIds);
}
