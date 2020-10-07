package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.SettingQuickSightResult;

/**
 * Service implementation for set up Amazon quick sight
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface QuickSightSettingProvider {

    /**
     * Setting Amazon quick sight
     *
     * @param tenantId The id of tenant target
     * @param tenantName The name of tenant target
     * @return {@link SettingQuickSightResult}
     */
    SettingQuickSightResult settingQuickSight(Long tenantId, String tenantName);

    /**
     * Get QuickSightSetting info by tenant name
     *
     * @param tenantName The name of tenant
     * @return {@link GetQuickSightSettingDTO}
     */
    GetQuickSightSettingDTO getQuickSightSetting(String tenantName);
}
