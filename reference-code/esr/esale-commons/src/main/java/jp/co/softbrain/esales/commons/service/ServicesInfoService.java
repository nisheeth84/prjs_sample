package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.ServicesInfoOutDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.ServicesInfo}.
 *
 * @author chungochai
 */
@XRayEnabled
public interface ServicesInfoService {
    /**
     * getServicesInfo API
     *
     * @param serviceType type of service to get
     * @return list of services from search condition
     */
    public List<ServicesInfoOutDTO> getServicesInfo(Integer serviceType);
}
