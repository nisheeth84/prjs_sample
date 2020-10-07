package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoResponseDTO;

/**
 * Service for API
 * GetImportInitInfo
 * 
 * @author nguyenvanchien3
 */
@XRayEnabled
public interface GetImportInitInfoService {

    /**
     * Get Information mapping CSV
     * 
     * @param extensionBelong - Id feature be used
     * @return response info import
     */
    public GetImportInitInfoResponseDTO getImportInitInfo(Long extensionBelong);
}
