package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveSettingResDTO;

/**
 * Service interface for Receive Setting
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface ReceiveSettingRequestService {

    /**
     * Receive the tenant environment setting request based on the specified parameters.
     *
     * @param request {@link ReceiveSettingResDTO}
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO receiveSettingRequest(ReceiveSettingResDTO request);

}
