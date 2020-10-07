package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.web.rest.vm.response.SettingEnvironmentResponse;

/**
 * Service interface for managing SettingEnvironment
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface SettingEnvironmentService {

    /**
     * Initiate environment when created a tenant
     *
     * @param tenantId The id of Tenant
     * @param languageId The id of language
     * @return message after setting {@link SettingEnvironmentResponse}
     */
    SettingEnvironmentResponse settingEnvironment(Long tenantId, Long languageId, boolean isSettingQuickSight);
}
