package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.Timezones;

/**
 * Spring Data  repository for the Timezones entity.
 * 
 * @author phamminhphu
 *
 */
@Repository
@XRayEnabled
public interface TimezonesRepository extends JpaRepository<Timezones, Long> {

    /**
     * Get timezones order by display order
     * 
     * @return the list entity Timezones
     */
    @Query(value = "SELECT * FROM timezones ORDER BY display_order ASC", nativeQuery = true)
    List<Timezones> findAllByOrderByDisplayOrderAsc();
}
