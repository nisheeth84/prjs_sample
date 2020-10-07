package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.MServices;

/**
 * Spring Data repository for the MServices entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MServicesRepository extends JpaRepository<MServices, Long>, MServiceRepositoryCustom {

    /**
     * Find all of record in database
     *
     * @return List of micro service name
     */
    @Query(value = "SELECT DISTINCT ms.micro_service_name "
            + "FROM m_services ms "
            + "WHERE ms.micro_service_name IS NOT NULL "
            + "      AND ms.micro_service_name != '' "
            + "      AND ms.micro_service_name NOT IN :ignoreMicroServiceNames", nativeQuery = true)
    List<String> findAllSellService(@Param("ignoreMicroServiceNames") List<String> ignoreMicroServiceNames);
}
