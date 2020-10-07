package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.MPackages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the MPackages entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MPackagesRepository extends JpaRepository<MPackages, Long>, MPackagesRepositoryCustom {
}
