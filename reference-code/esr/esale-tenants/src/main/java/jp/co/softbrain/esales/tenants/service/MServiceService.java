package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;

/**
 * Service interface for MService services.
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface MServiceService {

    /**
     * Get list data Service master.
     * 
     * @param serviceIds List id services
     * @return {@link GetMasterServicesDataDTO}
     */
    List<GetMasterServicesDataDTO> getMasterServices(List<Long> serviceIds);
}
