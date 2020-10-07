package jp.co.softbrain.esales.tenants.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.repository.MServicesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.MServiceService;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;

/**
 * MService Service Impl
 * 
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MServiceServiceImpl extends AbstractTenantService implements MServiceService {

    @Autowired
    private MServicesRepository mServicesRepository;

    /**
     * @see MServiceService#getMasterServices(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetMasterServicesDataDTO> getMasterServices(List<Long> serviceIds) {
        try {
            return mServicesRepository.getMasterServices(serviceIds);
        } catch (Exception e) {
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "getMasterServices",
                    Constants.INTERRUPT_API);
        }
    }

}
