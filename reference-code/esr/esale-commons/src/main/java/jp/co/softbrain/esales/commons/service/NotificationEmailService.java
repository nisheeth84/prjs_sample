package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.NotificationEmail;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link NotificationEmail}.
 */
@XRayEnabled
public interface NotificationEmailService {

    /**
     * Save a notificationEmail.
     *
     * @param notificationEmail the entity to save.
     * @return the persisted entity.
     */
    NotificationEmail save(NotificationEmail notificationEmail);

    /**
     * Get all the notificationEmails.
     *
     * @return the list of entities.
     */
    List<NotificationEmail> findAll();


    /**
     * Get the "id" notificationEmail.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<NotificationEmail> findOne(Long id);

    /**
     * Delete the "id" notificationEmail.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Find by employeeId
     *
     * @param employeeId employeeId
     * @return {@link NotificationEmail}
     */
    Optional<NotificationEmail> findByEmployeeId(Long employeeId);
}
