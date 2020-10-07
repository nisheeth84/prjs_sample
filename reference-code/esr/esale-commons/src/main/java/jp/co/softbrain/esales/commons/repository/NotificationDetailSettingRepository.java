package jp.co.softbrain.esales.commons.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.NotificationDetailSetting;

/**
 * Spring Data repository for the NotificationDetailSetting entity.
 *
 * @author QuangLV
 */
@Repository
@XRayEnabled
public interface NotificationDetailSettingRepository extends JpaRepository<NotificationDetailSetting, Long> {

    /**
     * findByEmployeeIdAndNotificationTypeAndNotificationSubtype : get entity by
     * employee id, notification type, notificationSubtype
     *
     * @param employeeId: employee id
     * @param notificationType : notification type
     * @param notificationSubtype : notificationSubtype
     * @return NotificationDetailSetting : the entity
     */
    Optional<NotificationDetailSetting> findByEmployeeIdAndNotificationTypeAndNotificationSubtype(Long employeeId,
            Long notificationType, Long notificationSubtype);
}
