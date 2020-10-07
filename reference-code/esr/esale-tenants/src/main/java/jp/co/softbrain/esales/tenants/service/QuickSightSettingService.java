package jp.co.softbrain.esales.tenants.service;

import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.QuickSightSettings;
import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;
import jp.co.softbrain.esales.tenants.service.dto.QuickSightSettingsDTO;

/**
 * QuickSightSettingService
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface QuickSightSettingService {

    /**
     * Insert new record {@link QuickSightSettings}
     *
     * @param quickSightSettingsDTO quickSightSettingsDTO
     * @return QuickSightSettingsDTO
     */
    QuickSightSettingsDTO save(QuickSightSettingsDTO quickSightSettingsDTO);

    /**
     * Get quick sight info by tenant name
     *
     * @param tenantName Tenant name
     * @return {@linl GetQuickSightSettingDTO}
     */
    Optional<GetQuickSightSettingDTO> findQuickSightSettingByTenantName(String tenantName);
}
