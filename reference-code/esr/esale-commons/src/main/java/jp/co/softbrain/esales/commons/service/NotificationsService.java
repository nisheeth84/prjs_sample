package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.CountUnreadNotificationOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsOutDTO;

/**
 * Notification Service
 *
 * @author DatDV
 */
@XRayEnabled
public interface NotificationsService {

    /**
     * get Notifications :
     *
     * @param employeeId : employeeId form getNotifications
     * @param limit : limit for getNotifications
     * @param textSearch : textSearch for getNotifications
     * @return GetNotificationsOutDTO : DTO out of API getNotifications
     */
    GetNotificationsOutDTO getNotifications(Long employeeId, Long limit, String textSearch);

    /**
     * count Unread Notification
     * 
     * @param employeeId of the entity
     * @return CountUnreadNotificationOutDTO : number Unread Notification
     */
    CountUnreadNotificationOutDTO countUnreadNotification(Long employeeId);
}
