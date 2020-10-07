package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import jp.co.softbrain.esales.errors.CustomRestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.util.CollectionUtils;
import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.domain.LicensePackages;
import jp.co.softbrain.esales.tenants.repository.LicensePackagesRepository;
import jp.co.softbrain.esales.tenants.repository.MPackagesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.LicenseService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.UsedLicensePackageDTO;
import jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.LicensePackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateLicensePackageDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CountUsedLicensesPackageDTO;
import jp.co.softbrain.esales.tenants.service.mapper.LicensePackagesMapper;
import jp.co.softbrain.esales.tenants.util.TenantRestOperationUtil;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetAvailableLicenseResponse;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetUsedLicenseResponse;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.UpdateLicenseOutResponse;

/**
 * Service implementation for managing Licence.
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class LicenseServiceImpl extends AbstractTenantService implements LicenseService {

    private final Logger log = LoggerFactory.getLogger(LicenseServiceImpl.class);

    private static final String TENANT_NAME = "tenantName";

    private static final String CONTRACT_ID_PARAMETER_NAME = "contractTenantId";

    private static final String PACKAGES_PARAMETER_NAME = "packages";

    @Autowired
    private TenantRestOperationUtil tenantRestOperationUtil;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private LicensePackagesRepository licensePackagesRepository;

    @Autowired
    private MPackagesRepository mPackagesRepository;

    @Autowired
    private LicensePackagesMapper licensePackagesMapper;

    /**
     * @see LicenseService#getAvailableLicense(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public ContractSiteResponseDTO getAvailableLicense(String tenantName) {
        // 1. Validate parameter
        if (StringUtils.isNullOrEmpty(tenantName)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, TENANT_NAME));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 2. Get number of available license
        List<AvailableLicensePackage> availableLicensePackages = tenantService.getTenantLicensePackage(tenantName);
        if (CollectionUtils.isNullOrEmpty(availableLicensePackages)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, tenantName));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 3. Create response API
        GetAvailableLicenseResponse getAvailableLicenseOut = new GetAvailableLicenseResponse();
        getAvailableLicenseOut.setPackages(availableLicensePackages);
        return new ContractSiteResponseDTO(SUCCESS.getValue(), getAvailableLicenseOut, null /* errors */);
    }

    /**
     * @see LicenseService#getUsedLicense(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public ContractSiteResponseDTO getUsedLicense(String contractTenantId) {
        // 1. Validate parameter
        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_ID_PARAMETER_NAME));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 2. Get tenant data
        String tenantName = tenantService.getTenantNameByContractId(contractTenantId);
        if (tenantName == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 3. Call API countUsedLicense
        List<CountUsedLicensesPackageDTO> countLicensePackageList;
        try {
            countLicensePackageList = tenantRestOperationUtil.countUsedLicenses(tenantName);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API countUsedLicenses failed. Message: {}", e.getMessage());
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                    getMessage(Constants.INTERRUPT_API));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // ============== 4. Create response ==============
        // create List of package_id
        List<Long> packageIds = countLicensePackageList.stream()
                .map(CountUsedLicensesPackageDTO::getPackageId)
                .collect(Collectors.toList());

        // make map: package_id -> package_name
        List<PackagesDTO> mPackagesDTOList = mPackagesRepository.getPackages(packageIds);
        Map<Long, String> packageIdAndPackageNameMap = mPackagesDTOList.stream()
                .collect(Collectors.toMap(PackagesDTO::getMPackageId, PackagesDTO::getPackageName));

        // build response
        List<UsedLicensePackageDTO> usedLicensePackageList = countLicensePackageList.stream()
                .map(countLicensePackage -> {
                    UsedLicensePackageDTO usedLicensePackage = new UsedLicensePackageDTO();
                    usedLicensePackage.setPackageName(packageIdAndPackageNameMap.get(countLicensePackage.getPackageId()));
                    usedLicensePackage.setUsedPackage(countLicensePackage.getUsedPackages());
                    return usedLicensePackage;
                }).collect(Collectors.toList());

        return new ContractSiteResponseDTO(SUCCESS.getValue(),
                new GetUsedLicenseResponse(usedLicensePackageList), null /* errors */);
    }

    /**
     * @see LicenseService#updateLicenses(String, List)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO updateLicenses(String contractTenantId, List<UpdateLicensePackageDTO> updatePackageList) {

        // ============== 1. Validate parameter ==============
        List<ContractSiteErrorDataDTO> errors = validateUpdateLicenseParameter(contractTenantId, updatePackageList);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // ============== 2. Get data to update ==============
        // 2.1 Get Tenant's information
        TenantNameDTO tenant = tenantService.getTenantContractByContractId(contractTenantId)
                .orElse(null);
        if (tenant == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 2.2 Make package_id from request
        List<Long> requestPackageIdList = updatePackageList.stream()
                .map(UpdateLicensePackageDTO::getPackageId)
                .collect(Collectors.toList());

        Long tenantId = tenant.getTenantId();
        Long employeeId = getUserIdFromToken();

        try {
            // ============== 3. Update data packages ==============
            updateLicensePackages(updatePackageList, tenantId, employeeId);

        } catch (RuntimeException e) { // unknown error
            log.error("Unexpected error occurred. Message: {}", e.getMessage(), e);
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getMessage());

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // ============== 6. Delete account permission ==============
        Boolean isRevokeEmployeeSuccess;
        try {
            isRevokeEmployeeSuccess = tenantRestOperationUtil.revokeEmployeeAccess(tenant.getTenantName(),
                    requestPackageIdList);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API revokeEmployeeAccess failed. Message: {}", e.getMessage());
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                getMessage(Constants.INTERRUPT_API));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        if (!isRevokeEmployeeSuccess) {
            throw new CustomException(getMessage(Constants.DELETE_FAILED),
                    ConstantsTenants.TENANT_ITEM, Constants.DELETE_FAILED);
        }

        return new ContractSiteResponseDTO(SUCCESS.getValue(),
                new UpdateLicenseOutResponse(contractTenantId, getMessage(Constants.UPDATED)), null /* errors */);
    }

    /**
     * Validate request for update license
     *
     * @param contractTenantId contractTenantId
     * @param updatePackageList updatePackageList
     * @return error list
     */
    private List<ContractSiteErrorDataDTO> validateUpdateLicenseParameter(String contractTenantId,
            List<UpdateLicensePackageDTO> updatePackageList) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_ID_PARAMETER_NAME)));
        }
        if (CollectionUtils.isNullOrEmpty(updatePackageList)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, PACKAGES_PARAMETER_NAME)));

        } else {
            if (updatePackageList.stream().map(UpdateLicensePackageDTO::getPackageId).anyMatch(Objects::isNull)) {
                errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, "packageId")));
            }
            if (updatePackageList.stream().map(UpdateLicensePackageDTO::getAvailablePackageNumber).anyMatch(Objects::isNull)) {
                errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, "availablePackageNumber")));
            }
        }
        return errors;
    }

    /**
     * Insert list of license_packages
     *
     * @param licensePackagesDTOList List of {@link LicensePackagesDTO}
     */
    private void insertListLicencePackages(List<LicensePackagesDTO> licensePackagesDTOList) {
        List<LicensePackages> licensePackagesList = licensePackagesMapper.toEntity(licensePackagesDTOList);
        licensePackagesRepository.saveAll(licensePackagesList);
    }

    /**
     * Update license subscription when update license
     *
     * @param updatePackageList updatePackageList
     * @param tenantId Id of tenant
     * @param employeeId employeeId
     */
    private void updateLicensePackages(List<UpdateLicensePackageDTO> updatePackageList,
            Long tenantId, Long employeeId) {

        // 4.1 Delete old license packages
        licensePackagesRepository.deleteByTenantId(tenantId);

        // 4.2 Insert new license packages
        List<LicensePackagesDTO> licensePackagesDTOList = updatePackageList.stream()
                .map(updatePackage -> {
                    LicensePackagesDTO licensePackagesDTO = new LicensePackagesDTO();
                    licensePackagesDTO.setMPackageId(updatePackage.getPackageId());
                    licensePackagesDTO.setTenantId(tenantId);
                    licensePackagesDTO.setAvailableLicenseNumber(updatePackage.getAvailablePackageNumber());
                    // update metadata before insert
                    licensePackagesDTO.setCreatedUser(employeeId);
                    licensePackagesDTO.setUpdatedUser(employeeId);

                    return licensePackagesDTO;
                }).collect(Collectors.toList());

        insertListLicencePackages(licensePackagesDTOList);
    }
}
