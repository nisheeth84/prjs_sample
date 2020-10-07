package jp.co.softbrain.esales.uaa.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.uaa.domain.AuthenticationSaml;

/**
 * Spring Data repository for the AuthenticationSaml entity.
 */
@Repository
@XRayEnabled
public interface AuthenticationSamlRepository extends JpaRepository<AuthenticationSaml, Long> {
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
    AuthenticationSaml findBySamlId(Long samId);
}
