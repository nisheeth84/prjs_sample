package jp.co.softbrain.esales.commons.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.NotificationTypeSetting;
import jp.co.softbrain.esales.commons.repository.NotificationTypeSettingRepository;
import jp.co.softbrain.esales.commons.service.NotificationTypeSettingService;

/**
 * Service Implementation for managing {@link NotificationTypeSetting}.
 */
@Service
@Transactional
public class NotificationTypeSettingServiceImpl implements NotificationTypeSettingService {

    private final NotificationTypeSettingRepository notificationTypeSettingRepository;

    public NotificationTypeSettingServiceImpl(NotificationTypeSettingRepository notificationTypeSettingRepository) {
        this.notificationTypeSettingRepository = notificationTypeSettingRepository;
    }

    /**
     * Save a notificationTypeSetting.
     *
     * @param notificationTypeSetting the entity to save.
     * @return the persisted entity.
     */
    @Override
    public NotificationTypeSetting save(NotificationTypeSetting notificationTypeSetting) {
        return notificationTypeSettingRepository.save(notificationTypeSetting);
    }

    /**
     * Get all the notificationTypeSettings.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationTypeSetting> findAll() {
        return notificationTypeSettingRepository.findAll();
    }

    /**
     * Get one notificationTypeSetting by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationTypeSetting> findOne(Long id) {
        return notificationTypeSettingRepository.findById(id);
    }

    /**
     * Delete the notificationTypeSetting by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        notificationTypeSettingRepository.deleteById(id);
    }
}
