package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jp.co.softbrain.esales.tenants.service.dto.MessageDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.domain.MPackagesServices;
import jp.co.softbrain.esales.tenants.repository.MPackagesServicesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.UpdatePackagesServicesService;
import jp.co.softbrain.esales.tenants.service.dto.UpdatePackagesServicesRequestDTO;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

/**
 * Service for update master package service API
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class UpdatePackagesServicesServiceImpl extends AbstractTenantService implements UpdatePackagesServicesService {

    @Autowired
    MPackagesServicesRepository mPackagesServicesRepository;

    public static final String PARAM_PACKAGES_SERVICES = "packagesServices";
    public static final String PARAM_PACKAGE_ID = "packageId";
    public static final String PARAM_PACKAGE_SERVICE_ID = "packageServiceId";
    public static final String PARAM_IS_ACTIVE = "isActive";

    /**
     * @see UpdatePackagesServicesService#updatePackagesServices(java.util.List)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO updatePackagesServices(List<UpdatePackagesServicesRequestDTO> packagesServices) {
        // 1. Validate parameter
        List<ContractSiteErrorDataDTO> errors = validatePackages(packagesServices);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        try {
            // 2. Update master package service
            List<MPackagesServices> mPackagesServices = new ArrayList<>();
            for (UpdatePackagesServicesRequestDTO requestDTO : packagesServices) {
                // Get data DB
                Optional<MPackagesServices> packagesEntity = mPackagesServicesRepository
                        .findById(requestDTO.getPackageServiceId());
                MPackagesServices mPackagesService = packagesEntity.orElse(new MPackagesServices());
                if (mPackagesService.getMPackageServiceId() == null) {
                    // Insert
                    mPackagesService.setMPackageServiceId(requestDTO.getPackageServiceId());
                }
                mPackagesService.setMPackageId(requestDTO.getPackageId());
                mPackagesService.setMServiceId(requestDTO.getServiceId());
                mPackagesService.setChildId(requestDTO.getChildId());
                Long userIdInsert = getUserIdFromToken();
                mPackagesService.setIsActive(requestDTO.getIsActive());
                mPackagesService.setCreatedUser(userIdInsert);
                mPackagesService.setUpdatedUser(userIdInsert);
                mPackagesServices.add(mPackagesService);
            }

            mPackagesServicesRepository.saveAll(mPackagesServices);

            return new ContractSiteResponseDTO(SUCCESS.getValue(),
                new MessageDTO(getMessage(Constants.UPDATED)), null /* errors */);
        } catch (Exception e) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */,
                List.of(new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getLocalizedMessage())));
        }
    }

    /**
     * Validate parameter not null
     *
     * @param packagesServices List data package service update.
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validatePackages(List<UpdatePackagesServicesRequestDTO> packagesServices) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (packagesServices == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGES_SERVICES)));
        } else {
            for (UpdatePackagesServicesRequestDTO packagesRequestDTO : packagesServices) {
                // サービスID
                if (packagesRequestDTO.getPackageServiceId() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE_SERVICE_ID)));
                }

                // パッケージID
                if (packagesRequestDTO.getPackageId() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE_ID)));
                }

                // 有効・無効判断フラグ
                if (packagesRequestDTO.getIsActive() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_IS_ACTIVE)));
                }
            }
        }

        return errors;
    }

}
