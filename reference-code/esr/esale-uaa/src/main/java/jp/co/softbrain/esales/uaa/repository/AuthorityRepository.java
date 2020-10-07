package jp.co.softbrain.esales.uaa.repository;
import jp.co.softbrain.esales.uaa.domain.Authority;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;


/**
 * Spring Data  repository for the Authority entity.
 */
@SuppressWarnings("unused")
@Repository
@XRayEnabled
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

}
