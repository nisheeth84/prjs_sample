package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.NotificationSetting;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.NotificationSettingDTO;

/**
 * Service Interface for managing {@link NotificationSetting}.
 */
@XRayEnabled
public interface NotificationSettingService {

    /**
     * Save a notificationSetting.
     *
     * @param notificationSettingDTO the DTO to save.
     * @return the persisted DTO.
     */
    NotificationSettingDTO save(NotificationSettingDTO notificationSettingDTO);

    /**
     * Get all the notificationSettings.
     *
     * @return the list of entities.
     */
    List<NotificationSetting> findAll();


    /**
     * Get the "id" notificationSetting.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<NotificationSetting> findOne(Long id);

    /**
     * Delete the "id" notificationSetting.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * get Notification Setting
     *
     * @param employeeId : employee id
     * @param isNotification : is notification
     * @return GetNotificationSettingOutDTO : DTO out of API getNotificationSetting
     */
    GetNotificationSettingOutDTO getNotificationSetting(Long employeeId , Boolean isNotification);

    /**
     * create Notification Setting
     *
     * @param employeeId
     * @param email
     * @return CreateNotificationSettingOutDTO : DTO out of API createNotificationSetting
     */
    CreateNotificationSettingOutDTO createNotificationSetting(Long employeeId , String email);

    /**
     * Find by employeeId
     *
     * @param employeeId employeeIdI
     * @return {@link NotificationSetting}
     */
    Optional<NotificationSettingDTO> findByEmployeeId(Long employeeId);
}
