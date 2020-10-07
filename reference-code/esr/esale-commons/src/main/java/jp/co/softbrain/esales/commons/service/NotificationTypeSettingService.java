package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.NotificationTypeSetting;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link NotificationTypeSetting}.
 */
@XRayEnabled
public interface NotificationTypeSettingService {

    /**
     * Save a notificationTypeSetting.
     *
     * @param notificationTypeSetting the entity to save.
     * @return the persisted entity.
     */
    NotificationTypeSetting save(NotificationTypeSetting notificationTypeSetting);

    /**
     * Get all the notificationTypeSettings.
     *
     * @return the list of entities.
     */
    List<NotificationTypeSetting> findAll();


    /**
     * Get the "id" notificationTypeSetting.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<NotificationTypeSetting> findOne(Long id);

    /**
     * Delete the "id" notificationTypeSetting.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
