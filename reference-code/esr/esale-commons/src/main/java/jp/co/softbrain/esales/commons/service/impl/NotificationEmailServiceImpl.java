package jp.co.softbrain.esales.commons.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.NotificationEmail;
import jp.co.softbrain.esales.commons.repository.NotificationEmailRepository;
import jp.co.softbrain.esales.commons.service.NotificationEmailService;

/**
 * Service Implementation for managing {@link NotificationEmail}.
 */
@Service
@Transactional
public class NotificationEmailServiceImpl implements NotificationEmailService {

    private final Logger log = LoggerFactory.getLogger(NotificationEmailServiceImpl.class);

    private final NotificationEmailRepository notificationEmailRepository;

    public NotificationEmailServiceImpl(NotificationEmailRepository notificationEmailRepository) {
        this.notificationEmailRepository = notificationEmailRepository;
    }

    /**
     * Save a notificationEmail.
     *
     * @param notificationEmail the entity to save.
     * @return the persisted entity.
     */
    @Override
    @Transactional
    public NotificationEmail save(NotificationEmail notificationEmail) {
        log.debug("Request to save NotificationEmail : {}", notificationEmail);
        return notificationEmailRepository.save(notificationEmail);
    }

    /**
     * Get all the notificationEmails.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationEmail> findAll() {
        log.debug("Request to get all NotificationEmails");
        return notificationEmailRepository.findAll();
    }


    /**
     * Get one notificationEmail by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationEmail> findOne(Long id) {
        log.debug("Request to get NotificationEmail : {}", id);
        return notificationEmailRepository.findById(id);
    }

    /**
     * Delete the notificationEmail by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete NotificationEmail : {}", id);
        notificationEmailRepository.deleteById(id);
    }

    @Override
    public Optional<NotificationEmail> findByEmployeeId(Long employeeId) {
        return Optional.ofNullable(notificationEmailRepository.findByEmployeeId(employeeId));
    }
}
