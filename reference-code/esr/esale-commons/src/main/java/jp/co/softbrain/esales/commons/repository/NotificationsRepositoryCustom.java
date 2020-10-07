package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.service.dto.GetNotificationsResultDTO;

/**
 * Notifications Repositpry Custom
 *
 * @author DatDV
 */
@Repository
public interface NotificationsRepositoryCustom {
    /**
     * get Notifications
     *
     * @param employeeId
     * @param limit
     * @param textSearch
     * @param notificationType
     * @param notificationSubtype
     * @return List GetNotificationsResultDTO : List DTO out of API
     *         getNotifications
     */
    List<GetNotificationsResultDTO> getNotifications(Long employeeId, Long limit, String textSearch,
            List<Long> notificationType, List<Long> notificationSubtype);

    /**
     * countNotifications
     * 
     * @param employeeId
     * @return
     */
    Long countNotifications(Long employeeId);
}
