package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.repository.MPackagesServicesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.MPackagesServicesService;
import jp.co.softbrain.esales.tenants.service.dto.GetPackagesServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesByPackageIdDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;

@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MPackagesServicesServiceImpl extends AbstractTenantService implements MPackagesServicesService {
    private final Logger log = LoggerFactory.getLogger(MPackagesServicesServiceImpl.class);

    @Autowired
    private CommonService commonService;

    @Autowired
    MPackagesServicesRepository mPackagesServicesRepository;

    /**
     * @see MPackagesServicesService#findPackageIdsOfTenant(Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Long> findPackageIdsOfTenant(Long tenantId) {
        Set<Long> packageIds = new HashSet<>();
        commonService.getPackagesTenant(tenantId).forEach(packagesTenant -> {
            packageIds.add(packagesTenant.getMPackageId());
            if (packagesTenant.getChildId() != null) {
                packageIds.add(packagesTenant.getChildId());
            }
        });
        return new ArrayList<>(packageIds);
    }

    /**
     * @see MPackagesServicesService#findServicesByPackageIds(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<ServicesPackagesDTO> findServicesByPackageIds(List<Long> packageIds) {
        return commonService.getServicesByPackage(packageIds).stream()
                .filter(s -> s.getMServiceId() != null)
                .collect(Collectors.toList());
    }

    /**
     * @see MPackagesServicesService#findMicroServiceNameOfTenant(List)
     */
    @Override
    public List<String> findMicroServiceNameOfTenant(List<Long> packageIds) {
        return commonService.getServicesByPackage(packageIds).stream()
                .map(ServicesPackagesDTO::getMicroServiceName)
                .collect(Collectors.toList());
    }

    /**
     * @see MPackagesServicesService#getServicesByPackageIds(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<ServicesByPackageIdDataDTO> getServicesByPackageIds(List<Long> packageIds) {

        String message = null;

        // Values exist in packageIds
        if (packageIds == null || packageIds.isEmpty()) {
            message = getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.PACKAGE_ID);
            throw new CustomException(message, ConstantsTenants.PACKAGE_ID, Constants.REQUIRED_PARAMETER);
        }

        // Get a list of service names according to the specified id package.
        try {
            List<ServicesByPackageIdDataDTO> servicesByPackageIdDataDTOs = new ArrayList<>();
            // Get all master packages_services
            List<ServicesPackagesDTO> servicesPackagesDTOs = commonService.getServicesByPackage(null);

            // get PackageService without child
            List<ServicesPackagesDTO> servicesPackagesDTOWithoutChilds = servicesPackagesDTOs.stream()
                    .filter(packageService -> packageIds.contains(packageService.getMPackageId()))
                    .collect(Collectors.toList());

            // get child PackageService
            List<Long> childPackageIdList = servicesPackagesDTOWithoutChilds.stream()
                    .map(ServicesPackagesDTO::getChildId)
                    .filter(Objects::nonNull).collect(Collectors.toList());

            List<ServicesPackagesDTO> requestChildPackageServices = servicesPackagesDTOs.stream()
                    .filter(packageService -> childPackageIdList.contains(packageService.getMPackageId()))
                    .collect(Collectors.toList());

            requestChildPackageServices.forEach(packageService -> {
                if (!servicesPackagesDTOWithoutChilds.contains(packageService)) {
                    servicesPackagesDTOWithoutChilds.add(packageService);
                }
            });

            for (ServicesPackagesDTO servicesPackagesDTO : servicesPackagesDTOWithoutChilds) {
                ServicesByPackageIdDataDTO dataDTO = new ServicesByPackageIdDataDTO();
                dataDTO.setServiceId(servicesPackagesDTO.getMServiceId());
                dataDTO.setServiceName(servicesPackagesDTO.getServiceName());
                dataDTO.setMicroServiceName(servicesPackagesDTO.getMicroServiceName());
                servicesByPackageIdDataDTOs.add(dataDTO);
            }

            return servicesByPackageIdDataDTOs;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new CustomException("Get services package ids errors conected Database!");
        }
    }

    /**
     * @see MPackagesServicesService#getPackagesServices(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetPackagesServicesDataDTO> getPackagesServices(List<Long> packageServiceIds) {
        try {
            return mPackagesServicesRepository.getPackagesServices(packageServiceIds);
        } catch (Exception e) {
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "getPackagesServices",
                    Constants.INTERRUPT_API);
        }
    }
}
