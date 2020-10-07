package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.NotificationSettingService;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateNotificationSettingRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetNotificationsSettingRequest;

@RestController
@RequestMapping("/api")
public class NotificationsSettingResource {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * notificationSettingService
     */
    @Autowired
    private NotificationSettingService notificationSettingService;

    /**
     * get Notification Setting
     *
     * @param request : request body of API getNotificationSetting
     * @return GetNotificationSettingOutDTO : DTO out of API
     *         getNotificationSetting
     */
    @PostMapping(path = "/get-notification-setting", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetNotificationSettingOutDTO> getNotificationSetting(
            @RequestBody GetNotificationsSettingRequest request) {
        Long employeeId = request.getEmployeeId();
        Boolean isNotification = request.getIsNotification();
        return ResponseEntity.ok(notificationSettingService.getNotificationSetting(employeeId, isNotification));
    }

    /**
     * createNotificationSetting
     *
     * @param request : request of API createNotificationSetting
     * @return CreateNotificationSettingOutDTO : DTO out of API
     *         createNotificationSetting
     */
    @PostMapping(path = "/create-notification-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateNotificationSettingOutDTO> createNotificationSetting(
            @RequestBody CreateNotificationSettingRequest request) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        String email = request.getEmail();
        return ResponseEntity.ok(notificationSettingService.createNotificationSetting(employeeId, email));
    }
}
