package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.NotificationEmail;

/**
 * Spring Data  repository for the NotificationEmail entity.
 */
@Repository
@XRayEnabled
public interface NotificationEmailRepository extends JpaRepository<NotificationEmail, Long> {

    /**
     * Find by employeeId
     *
     * @param employeeId employeeId
     * @return {@link NotificationEmail}
     */
    NotificationEmail findByEmployeeId(Long employeeId);
}
