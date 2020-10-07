package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.MPackagesServices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the MPackagesServices entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MPackagesServicesRepository extends JpaRepository<MPackagesServices, Long>, MPackagesServicesRepositoryCustom {
}
