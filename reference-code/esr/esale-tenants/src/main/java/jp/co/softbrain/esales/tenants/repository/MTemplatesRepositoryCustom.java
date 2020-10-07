package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.TemplateMicroServiceDTO;

/**
 * Custom query for MTemplates repository
 *
 * @author nguyenvietloi
 *
 */
@Repository
@XRayEnabled
public interface MTemplatesRepositoryCustom {

    /**
     * Get list template of microservice by industry type.
     *
     * @param mIndustryId id of industry.
     * @param microServiceNames ids of services.
     * @return list of {@link TemplateMicroServiceDTO}.
     */
    List<TemplateMicroServiceDTO> getTemplateMicroServices(Long mIndustryId, List<String> microServiceNames);
}
