package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.util.StringUtils;
import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.repository.CognitoSettingsRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;

/**
 * Repository implementation for {@link CognitoSettingsRepositoryCustom}
 *
 * @author tongminhcuong
 */
@Repository
@XRayEnabled
public class CognitoSettingsRepositoryCustomImpl extends RepositoryCustomUtils implements CognitoSettingsRepositoryCustom {

    /**
     * @see CognitoSettingsRepositoryCustom#findCognitoSettingTenant(String, String)
     */
    @Override
    public CognitoSettingInfoDTO findCognitoSettingTenant(String tenantName, String contractTenantId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT cs.user_pool_id ");
        sqlBuilder.append("     , cs.client_id ");
        if (StringUtils.isNullOrEmpty(tenantName)) {
            sqlBuilder.append("     , te.tenant_name ");
        }
        sqlBuilder.append("     , cs.is_pc ");
        sqlBuilder.append("     , cs.is_app ");
        sqlBuilder.append("     , cs.provider_name ");
        sqlBuilder.append("     , cs.reference_value ");
        sqlBuilder.append("     , cs.meta_data_path ");
        sqlBuilder.append("     , cs.meta_data_name ");
        sqlBuilder.append("     , cs.cognito_settings_id ");
        sqlBuilder.append("     , cs.updated_date ");
        sqlBuilder.append("FROM cognito_settings cs ");
        sqlBuilder.append("    INNER JOIN tenants te ON cs.tenant_id = te.tenant_id ");
        sqlBuilder.append("WHERE 1 = 1 ");

        Map<String, Object> parameters = new HashMap<>();
        if (!StringUtils.isNullOrEmpty(tenantName)) {
            sqlBuilder.append("AND te.tenant_name = :tenantName ");
            parameters.put("tenantName", tenantName);
        }

        if (!StringUtils.isNullOrEmpty(contractTenantId)) {
            sqlBuilder.append("AND te.contract_id = :contractTenantId ");
            parameters.put("contractTenantId", contractTenantId);
        }

        sqlBuilder.append("LIMIT 1;");

        String resultSetMappingName = StringUtils.isNullOrEmpty(tenantName)
                ? "CognitoSettingInfoMapping"
                : "CognitoSettingWithoutTenantMapping";

        return getSingleResult(sqlBuilder.toString(), resultSetMappingName, parameters);
    }
}
