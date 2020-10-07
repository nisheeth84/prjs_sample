package jp.co.softbrain.esales.tenants.repository;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetAuthenticationSamlResponseDTO;

@XRayEnabled
@Repository
public interface AuthenticationSamlRepositoryCustom {
    GetAuthenticationSamlResponseDTO getAuthenticationSaml(String tenantName);
}
