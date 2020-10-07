package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.NotificationDetailSettingService;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationDetailSettingOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateNotificationDetailSettingRequest;

@RestController
@RequestMapping("/api")
public class NotificationDetailSettingResource {

    /**
     * notificationSettingService
     */
    @Autowired
    private NotificationDetailSettingService notificationDetailSettingService;

    /**
     * update notification detail setting
     *
     * @param request : request body of API updateNotificationDetailSetting
     * @return UpdateNotificationDetailSettingOutDTO : DTO out of API
     *         updateNotificationDetailSetting
     */
    @PostMapping(path = "/update-notification-detail-setting", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateNotificationDetailSettingOutDTO> updateNotificationDetailSetting(
            @RequestBody UpdateNotificationDetailSettingRequest request) {
        return ResponseEntity.ok(notificationDetailSettingService.updateNotificationDetailSetting(request.getEmployeeId(),
            request.getDataSettingNotifications(), request.getNotificationTime(), request.getEmails()));
    }
}
