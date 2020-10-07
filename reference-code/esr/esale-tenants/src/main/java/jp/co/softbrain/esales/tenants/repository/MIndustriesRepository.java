package jp.co.softbrain.esales.tenants.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.MIndustries;

/**
 * Spring Data repository for the MIndustries entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MIndustriesRepository extends JpaRepository<MIndustries, Long>, MIndustriesRepositoryCustom {

}
