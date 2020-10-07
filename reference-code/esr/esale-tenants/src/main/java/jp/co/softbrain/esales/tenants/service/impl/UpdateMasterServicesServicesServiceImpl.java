package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jp.co.softbrain.esales.tenants.service.dto.MessageDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.domain.MServices;
import jp.co.softbrain.esales.tenants.repository.MServicesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.UpdateMasterServicesService;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterServicesRequestDTO;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

/**
 * Service for update master services API
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class UpdateMasterServicesServicesServiceImpl extends AbstractTenantService
        implements UpdateMasterServicesService {

    @Autowired
    private MServicesRepository mServicesRepository;

    public static final String PARAM_SERVICES = "services";
    public static final String PARAM_SERVICE_ID = "serviceId";
    public static final String PARAM_SERVICE_NAME = "packageName";
    public static final String PARAM_IS_ACTIVE = "isActive";

    /**
     * @see UpdateMasterServicesService#updateMasterServices(List)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO updateMasterServices(List<UpdateMasterServicesRequestDTO> services) {
        // 1. Validate parameter
        List<ContractSiteErrorDataDTO> errors = validateServices(services);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        try {
            // 2. Update master MService
            List<MServices> mServices = new ArrayList<>();
            for (UpdateMasterServicesRequestDTO requestDTO : services) {
                // Get data DB
                Optional<MServices> mServicesOptional = mServicesRepository.findById(requestDTO.getServiceId());
                MServices mService = mServicesOptional.orElse(new MServices());
                if (mService.getMServiceId() == null) {
                    // Insert
                    mService.setMServiceId(requestDTO.getServiceId());
                }

                mService.setServiceName(requestDTO.getServiceName());
                mService.setMicroServiceName(requestDTO.getMicroServiceName());
                Long userIdInsert = getUserIdFromToken();
                mService.setIsActive(requestDTO.getIsActive());
                mService.setCreatedUser(userIdInsert);
                mService.setUpdatedUser(userIdInsert);
                mServices.add(mService);
            }

            mServicesRepository.saveAll(mServices);

            return new ContractSiteResponseDTO(SUCCESS.getValue(),
                new MessageDTO(getMessage(Constants.UPDATED)), null /* errors */);
        } catch (Exception e) {
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "", Constants.INTERRUPT_API);
        }
    }

    /**
     * Validate services not null
     *
     * @param services List data service update.
     */
    private List<ContractSiteErrorDataDTO> validateServices(List<UpdateMasterServicesRequestDTO> services) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (services == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_SERVICES)));
        } else {
            for (UpdateMasterServicesRequestDTO servicesRequestDTO : services) {
                // サービスID
                if (servicesRequestDTO.getServiceId() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_SERVICE_ID)));
                }

                // サービス名
                if (StringUtils.isEmpty(servicesRequestDTO.getServiceName())) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_SERVICE_NAME)));
                }

                if (servicesRequestDTO.getIsActive() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_IS_ACTIVE)));
                }

            }
        }
        return errors;
    }
}
