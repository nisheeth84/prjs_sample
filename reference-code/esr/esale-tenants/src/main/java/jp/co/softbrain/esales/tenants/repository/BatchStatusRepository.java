package jp.co.softbrain.esales.tenants.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.BatchStatus;

/**
 * Spring Data repository for the BatchStatus entity.
 * @author phamhoainam
 */
@Repository
@XRayEnabled
public interface BatchStatusRepository extends JpaRepository<BatchStatus, Long> {

    @Query(value = " SELECT * "
        + " FROM  batch_status "
        + " WHERE id = (Select MAX(id) FROM batch_status)"
        + " FOR UPDATE ;", nativeQuery = true)
    Optional<BatchStatus> findForUpdate();
}
