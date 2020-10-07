package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.NotificationDetailSetting;
import jp.co.softbrain.esales.commons.service.dto.DataSettingNotificationDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationDetailSettingOutDTO;

/**
 * Service Interface for managing {@link NotificationDetailSetting}.
 */
@XRayEnabled
public interface NotificationDetailSettingService {

    /**
     * save : Save a notificationDetailSetting.
     *
     * @param notificationDetailSetting : the entity to save.
     * @return NotificationDetailSetting : the persisted entity.
     */
    NotificationDetailSetting save(NotificationDetailSetting notificationDetailSetting);

    /**
     * findAll : Get all the notificationDetailSettings.
     *
     * @return List<NotificationDetailSetting> : the list of entities.
     */
    List<NotificationDetailSetting> findAll();

    /**
     * findOne : Get the "id" notificationDetailSetting.
     *
     * @param id : the id of the entity.
     * @return Optional<NotificationDetailSetting> : the entity.
     */
    Optional<NotificationDetailSetting> findOne(Long id);

    /**
     * delete : Delete the "id" notificationDetailSetting.
     *
     * @param id : the id of the entity.
     */
    void delete(Long id);

    /**
     * updateNotificationDetailSetting : update notification detail setting
     *
     * @param employeeId : employee id
     * @param dataSettingNotifications : List {@link DataSettingNotificationDTO}
     * @param notificationTime : notification time
     * @param emails : List email
     * @return UpdateNotificationDetailSettingOutDTO : DTO out for API
     *         updateNotificationDetailSetting
     */
    UpdateNotificationDetailSettingOutDTO updateNotificationDetailSetting(Long employeeId,
        List<DataSettingNotificationDTO> dataSettingNotifications, Long notificationTime, List<String> emails);
}
