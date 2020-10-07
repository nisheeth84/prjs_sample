package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.ServicesInfo;

/**
 * Spring Data repository for the ServicesInfo entity.
 */
@Repository
@XRayEnabled
public interface ServicesInfoRepository extends JpaRepository<ServicesInfo, Integer> {

    @Query(value = "SELECT * FROM services_info WHERE service_type = :serviceType "
            + "ORDER BY service_order ASC", nativeQuery = true)
    public List<ServicesInfo> getServicesInfo(@Param("serviceType") Integer serviceType);

    @Query(value = "SELECT * FROM services_info ORDER BY service_order ASC", nativeQuery = true)
    public List<ServicesInfo> getAllAvailableServicesInfo();

}
