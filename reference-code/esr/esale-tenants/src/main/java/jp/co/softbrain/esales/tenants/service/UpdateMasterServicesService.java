package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterServicesRequestDTO;

/**
 * Service interface for update master services
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface UpdateMasterServicesService {

    /**
     * Update services information.
     *
     * @param services List data services update
     * @return String message status update
     */
    ContractSiteResponseDTO updateMasterServices(List<UpdateMasterServicesRequestDTO> services);
}
