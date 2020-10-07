package jp.co.softbrain.esales.tenants.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.Feedback;

/**
 * FeedbackRepository
 * 
 * @author DatDV
 */
@Repository
@XRayEnabled
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    /**
     * deleteByFeedbackid
     * 
     * @param id : feedback id for delete
     */
    void deleteByFeedbackId(Long id);

    /**
     * findByFeedbackId
     * 
     * @param id : feedback id for find
     * @return
     */
    Optional<Feedback> findByFeedbackId(Long id);
}
