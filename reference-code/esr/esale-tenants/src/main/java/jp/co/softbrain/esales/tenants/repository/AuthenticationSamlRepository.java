package jp.co.softbrain.esales.tenants.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.AuthenticationSaml;

/**
 * Spring Data repository for the AuthenticationSaml entity.
 */
@Repository
@XRayEnabled
public interface AuthenticationSamlRepository extends JpaRepository<AuthenticationSaml, Long> {
    void deleteBySamlId(Long id);

    AuthenticationSaml findByTenantId(Long tenantId);

    /**
     * findAll
     *
     * @param sort
     * @return
     */
    List<AuthenticationSaml> findAll(Sort sort);

    /**
     * findCertificatePathBySamlId
     *
     * @param SamlID
     * @return
     */
    String findCertificatePathBySamlId(Long samId);

    /**
     * findBySamlId : find By SamId
     *
     * @param samId
     * @return AuthenticationSaml
     */
    Optional<AuthenticationSaml> findBySamlId(Long samId);
}
