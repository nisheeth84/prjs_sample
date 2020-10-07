package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.MTemplates;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateIndustryDTO;

/**
 * Service Interface for managing {@link MTemplates}.
 */
@XRayEnabled
public interface MasterTemplateService {

    /**
     * Update templates matching microservice
     *
     * @param industryTypeName name of industry type.
     * @param microServiceNames ids of services.
     * @return message result.
     */
    String updateMasterTemplates(String industryTypeName, List<String> microServiceNames);

    /**
     * Rollback templates matching microservice
     *
     * @param industryTypeName name of industry type.
     * @param microServiceNames names of services.
     * @return message result.
     */
    String rollbackMasterTemplates(String industryTypeName, List<String> microServiceNames);

    /**
     * Get list templates
     *
     * @return List industry type name
     */
    List<MTemplateIndustryDTO> getListTemplates();
}
