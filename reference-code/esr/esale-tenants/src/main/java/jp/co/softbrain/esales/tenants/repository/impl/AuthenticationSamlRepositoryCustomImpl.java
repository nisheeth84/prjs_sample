package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.tenants.repository.AuthenticationSamlRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetAuthenticationSamlResponseDTO;

@Repository
public class AuthenticationSamlRepositoryCustomImpl extends RepositoryCustomUtils
        implements AuthenticationSamlRepositoryCustom {

    @Override
    public GetAuthenticationSamlResponseDTO getAuthenticationSaml(String tenantName) {
        Map<String, Object> parameter = new HashMap<>();
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT   s.saml_id ");
        sqlBuilder.append("       , s.is_pc ");
        sqlBuilder.append("       , s.is_app ");
        sqlBuilder.append("       , s.reference_field_id ");
        sqlBuilder.append("       , s.reference_type ");
        sqlBuilder.append("       , s.reference_value ");
        sqlBuilder.append("       , s.issuer ");
        sqlBuilder.append("       , s.certificate_path ");
        sqlBuilder.append("       , s.certificate_name ");
        sqlBuilder.append("       , s.url_login ");
        sqlBuilder.append("       , s.ur_logout ");
        sqlBuilder.append("       , s.updated_date ");
        sqlBuilder.append("FROM authentication_saml s ");
        sqlBuilder.append("INNER JOIN tenants t ");
        sqlBuilder.append("ON s.tenant_id = t.tenant_id ");
        sqlBuilder.append("WHERE t.tenant_name = :tenantName ");
        sqlBuilder.append("LIMIT 1");

        parameter.put("tenantName", tenantName);
        return this.getSingleResult(sqlBuilder.toString(), "authenticationSamlMapping", parameter);
    }
}
