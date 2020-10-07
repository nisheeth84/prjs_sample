package jp.co.softbrain.esales.tenants.repository;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;

/**
 * Repository interface for {@link CognitoSettingInfoDTO}
 *
 * @author tongminhcuong
 */
@Repository
@XRayEnabled
public interface CognitoSettingsRepositoryCustom {

    /**
     * Find cognito setting info
     *
     * @param tenantName Name of Tenant
     * @param contractTenantId Id of contract
     * @return {@link CognitoSettingInfoDTO}
     */
    CognitoSettingInfoDTO findCognitoSettingTenant(String tenantName, String contractTenantId);
}
