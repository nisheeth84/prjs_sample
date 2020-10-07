package jp.co.softbrain.esales.tenants.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.CognitoSettings;

/**
 * Spring Data repository for the CognitoSettings entity.
 */
@Repository
@XRayEnabled
public interface CognitoSettingsRepository extends JpaRepository<CognitoSettings, Long>, CognitoSettingsRepositoryCustom {

    Optional<CognitoSettings> findByCognitoSettingsId(Long id);

    void deleteByCognitoSettingsId(Long id);

    List<CognitoSettings> findByTenantIdOrderByCognitoSettingsIdDesc(Long tenantId);
}
