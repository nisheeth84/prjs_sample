package jp.co.softbrain.esales.tenants.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
import jp.co.softbrain.esales.tenants.domain.MPackages;
import jp.co.softbrain.esales.tenants.repository.MPackagesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.UpdateMasterPackagesService;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterPackagesRequestDTO;
import jp.co.softbrain.esales.utils.DateUtil;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

/**
 * Service for update master packages API
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class UpdateMasterPackagesServiceImpl extends AbstractTenantService implements UpdateMasterPackagesService {

    @Autowired
    private MPackagesRepository mPackagesRepository;

    public static final String PARAM_PACKAGES = "packages";
    public static final String PARAM_PACKAGE_ID = "packageId";
    public static final String PARAM_PACKAGE_NAME = "packageName";
    public static final String PARAM_TYPE = "type";
    public static final String PARAM_EXPIRATION_DATE = "expirationDate";

    /**
     * @see UpdateMasterPackagesService#updateMasterPackages(List)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO updateMasterPackages(List<UpdateMasterPackagesRequestDTO> packagesRequestDTOs) {

        // 1. Validate parameter
        List<ContractSiteErrorDataDTO> errors = validateMasterPackages(packagesRequestDTOs);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        try {
            // 2. Update master package
            List<MPackages> mPackages = new ArrayList<>();
            for (UpdateMasterPackagesRequestDTO requestDTO : packagesRequestDTOs) {
                // Get data DB
                Optional<MPackages> packagesEntity = mPackagesRepository.findById(requestDTO.getPackageId());
                MPackages mPackage = packagesEntity.orElse(new MPackages());
                if (mPackage.getMPackageId() == null) {
                    // Insert
                    mPackage.setMPackageId(requestDTO.getPackageId());
                }

                Long userIdFromToken = getUserIdFromToken();
                mPackage.setPackageName(requestDTO.getPackageName());
                mPackage.setType(requestDTO.getType());
                mPackage.setExpirationDate(
                        DateUtil.stringToInstant(requestDTO.getExpirationDate(), DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH));
                mPackage.setCreatedUser(userIdFromToken);
                mPackage.setUpdatedUser(userIdFromToken);
                mPackages.add(mPackage);
            }

            mPackagesRepository.saveAll(mPackages);

            return new ContractSiteResponseDTO(SUCCESS.getValue(),
                    new MessageDTO(getMessage(Constants.UPDATED)), null /* errors */);

        } catch (Exception e) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */,
                    List.of(new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getLocalizedMessage())));
        }
    }

    /**
     * Validate parameter master packages not null.
     *
     * @param packagesRequestDTOs List data packages update.
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validateMasterPackages(List<UpdateMasterPackagesRequestDTO> packagesRequestDTOs) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (packagesRequestDTOs.isEmpty()) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGES)));
        } else {
            for (UpdateMasterPackagesRequestDTO packagesRequestDTO : packagesRequestDTOs) {
                // パッケージID
                if (packagesRequestDTO.getPackageId() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE_ID)));
                }

                // パッケージ名
                if (StringUtils.isEmpty(packagesRequestDTO.getPackageName())) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE_NAME)));
                }

                // タイプ
                if (packagesRequestDTO.getType() == null) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_TYPE)));
                }

                // 有効期限
                if (StringUtils.isEmpty(packagesRequestDTO.getExpirationDate())) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                        getMessage(Constants.REQUIRED_PARAMETER, PARAM_EXPIRATION_DATE)));
                }

                // format YYYY/MM/DD
                if (!isDateFormat(packagesRequestDTO.getExpirationDate(), DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH)) {
                    errors.add(new ContractSiteErrorDataDTO(Constants.DATE_INVALID_CODE,
                        getMessage(Constants.DATE_INVALID_CODE)));
                }
            }
        }

        return errors;
    }

    /**
     * Check validate Datetime
     *
     * @param target String format
     * @param formatter yyyy/MM/dd
     * @return Correct format yyyy/MM/dd true, otherwise False
     */
    private boolean isDateFormat(String target, String formatter) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        try {
            sdf.parse(target);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

}
