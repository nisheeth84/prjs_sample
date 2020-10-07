package jp.co.softbrain.esales.tenants.service.impl;

import java.util.List;
import java.util.Optional;

import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.tenants.repository.CognitoSettingsRepository;
import jp.co.softbrain.esales.tenants.repository.MIndustriesRepository;
import jp.co.softbrain.esales.tenants.repository.MPackagesRepository;
import jp.co.softbrain.esales.tenants.repository.MPackagesServicesRepository;
import jp.co.softbrain.esales.tenants.repository.MServicesRepository;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;

/**
 * Service implementation for process common.
 *
 * @author nguyenvietloi
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CommonServiceImpl implements CommonService {

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private MPackagesServicesRepository mPackagesServicesRepository;

    @Autowired
    private MIndustriesRepository mIndustriesRepository;

    @Autowired
    private MPackagesRepository mPackagesRepository;

    @Autowired
    private CognitoSettingsRepository cognitoSettingsRepository;

    @Autowired
    private MServicesRepository mServicesRepository;

    /**
     * @see CommonService#isExistTenant(String, String)
     */
    @Override
    @Transactional(propagation= Propagation.SUPPORTS, readOnly = true)
    public boolean isExistTenant(String tenantName, String contractId) {
        return tenantsRepository.countTenantsByTenantNameAndContractId(tenantName, contractId) > 0;
    }

    /**
     * @see CommonService#getPackagesTenant(Long)
     */
    @Override
    @Transactional(propagation= Propagation.SUPPORTS, readOnly = true)
    public List<PackagesTenantDTO> getPackagesTenant(Long tenantId) {
        return mPackagesServicesRepository.findPackagesTenant(tenantId);
    }

    /**
     * @see CommonService#getServicesByPackage(List)
     */
    @Override
    @Transactional(propagation= Propagation.SUPPORTS, readOnly = true)
    public List<ServicesPackagesDTO> getServicesByPackage(List<Long> packageIds) {
        return mPackagesServicesRepository.findServicesByPackage(packageIds);
    }

    /**
     * @see CommonService#getIndustry(String)
     */
    @Override
    @Transactional(propagation= Propagation.SUPPORTS, readOnly = true)
    public IndustryDTO getIndustry(String industryTypeName) {
        return mIndustriesRepository.getIndustry(industryTypeName);
    }

    /**
     * @see CommonService#getPackages(List)
     */
    @Override
    @Transactional(propagation= Propagation.SUPPORTS, readOnly = true)
    public List<PackagesDTO> getPackages(List<Long> packageIds) {
        return mPackagesRepository.getPackages(packageIds);
    }

    /**
     * @see CommonService#getCognitoSettingTenant(String, String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CognitoSettingInfoDTO> getCognitoSettingTenant(String tenantName, String contractTenantId) {
        return Optional.ofNullable(cognitoSettingsRepository.findCognitoSettingTenant(tenantName, contractTenantId));
    }

    /**
     * @see CommonService#getAllSellServices()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<String> getAllSellServices() {
        return mServicesRepository.findAllSellService(ConstantsTenants.IGNORE_MICROSERVICE_NAME);
    }
}
