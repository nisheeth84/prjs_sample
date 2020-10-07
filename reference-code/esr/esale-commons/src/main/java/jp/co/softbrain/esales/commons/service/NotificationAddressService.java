package jp.co.softbrain.esales.commons.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.NotificationAddressDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationAddressOutDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.NotificationAddress}.
 *
 * @author QuangLV
 */
@XRayEnabled
public interface NotificationAddressService {

    /**
     * save : Save a notificationAddress.
     *
     * @param notificationAddressDTO : the entity to save.
     * @return NotificationAddressDTO : the persisted entity.
     */
    NotificationAddressDTO save(NotificationAddressDTO notificationAddressDTO);

    /**
     * findAll : Get all the notificationAddresses.
     *
     * @return List<NotificationAddressDTO> : the list of entities.
     */
    List<NotificationAddressDTO> findAll();

    /**
     * findOne : Get the "id" notificationAddress.
     *
     * @param id : the id of the entity.
     * @return Optional<NotificationAddressDTO> : the entity.
     */
    Optional<NotificationAddressDTO> findOne(Long id);

    /**
     * delete : Delete the "id" notificationAddress.
     *
     * @param id : the id of the entity.
     */
    void delete(Long id);

    /**
     * updateNotificationAddress : update notification address
     *
     * @param employeeId : employee id
     * @param notificationId : notification id
     * @param updatedDate : updated date
     * @return UpdateNotificationAddressOutDTO : employee id
     */
    UpdateNotificationAddressOutDTO updateNotificationAddress(Long employeeId, Long notificationId,
             Instant updatedDate);
}
