package jp.co.softbrain.esales.uaa.repository;
import jp.co.softbrain.esales.uaa.domain.EmpAuthority;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;


/**
 * Spring Data  repository for the EmpAuthority entity.
 */
@SuppressWarnings("unused")
@Repository
@XRayEnabled
public interface EmpAuthorityRepository extends JpaRepository<EmpAuthority, Long> {

}
