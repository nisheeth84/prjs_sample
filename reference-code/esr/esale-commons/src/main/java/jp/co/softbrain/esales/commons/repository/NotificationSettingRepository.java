package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.NotificationSetting;

/**
 * Spring Data  repository for the NotificationSetting entity.
 */
@Repository
@XRayEnabled
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {

    /**
     * Find by employeeId
     *
     * @param employeeId employeeIdI
     * @return {@link NotificationSetting}
     */
   NotificationSetting findByEmployeeId(Long employeeId);
}
