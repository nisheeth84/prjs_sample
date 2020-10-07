package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.repository.MPackagesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.MPackagesService;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;

/**
 * MPackages Service Impl
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MPackagesServiceImpl extends AbstractTenantService implements MPackagesService {

    @Autowired
    private CommonService commonService;

    @Autowired
    private MPackagesRepository mPackagesRepository;

    /**
     * @see MPackagesService#getPackageNames(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetPackagesDataDTO> getPackageNames(List<Long> packageIds) {

        // Values exist in packageIds
        if (packageIds == null || packageIds.isEmpty()) {
            String message = getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.PACKAGE_ID);
            throw new CustomException(message, ConstantsTenants.PACKAGE_ID, Constants.REQUIRED_PARAMETER);
        }

        try {
            List<GetPackagesDataDTO> packagesDataDTOs = new ArrayList<>();
            List<PackagesDTO> packagesDTOs = commonService.getPackages(packageIds);
            if (packagesDTOs != null) {
                for (PackagesDTO packagesDTO : packagesDTOs) {
                    GetPackagesDataDTO dataDTO = new GetPackagesDataDTO(packagesDTO.getMPackageId(),
                            packagesDTO.getPackageName());
                    packagesDataDTOs.add(dataDTO);
                }
            }

            return packagesDataDTOs;
        } catch (Exception e) {
            throw new CustomException("Get packages name errors connected Database!");
        }

    }

    /**
     * @see MPackagesService#getMasterPackages(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetMasterPackagesDataDTO> getMasterPackages(List<Long> packageIds) {
        try {
            return mPackagesRepository.getMasterPackages(packageIds);
        } catch (Exception e) {
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "getMasterPackages",
                    Constants.INTERRUPT_API);
        }
    }

}
