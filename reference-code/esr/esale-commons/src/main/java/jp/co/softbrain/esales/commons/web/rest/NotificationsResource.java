package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.NotificationsService;
import jp.co.softbrain.esales.commons.service.dto.CountUnreadNotificationOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetNotificationsRequest;

/**
 * Notifications Resource
 *
 * @author DatDV
 */
@RestController
@RequestMapping("/api")
public class NotificationsResource {

    /**
     * jwtTokenUtil
     */
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * notificationService
     */
    @Autowired
    private NotificationsService notificationService;

    /**
     * get Notifications :
     *
     * @param employeeId : employeeId form getNotifications
     * @param limit : limit for getNotifications
     * @param textSearch : textSearch for getNotifications
     * @return GetNotificationsOutDTO : DTO out of API getNotifications
     */
    @PostMapping(path = "/get-notifications", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetNotificationsOutDTO> getNotifications(@RequestBody GetNotificationsRequest request) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        Long limit = request.getLimit();
        String textSearch = request.getTextSearch();
        return ResponseEntity.ok(notificationService.getNotifications(employeeId, limit, textSearch));
    }

    /**
     * count unread notification
     * 
     * @return CountUnreadNotificationOutDTO : DTO out of API count unread
     *         notification
     */
    @PostMapping(path = "/count-unread-notification", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CountUnreadNotificationOutDTO> countUnreadNotification() {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        return ResponseEntity.ok(notificationService.countUnreadNotification(employeeId));
    }
}
