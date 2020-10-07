package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.PushNotificationService;
import jp.co.softbrain.esales.commons.web.rest.vm.request.SavePushNotificationRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.SavePushNotificationResponse;

/**
 * Push Notification Resource
 * 
 * @author Admin
 *
 */
@RestController
@RequestMapping("/api")
public class PushNotificationResource {

    @Autowired
    private PushNotificationService savePushNotificationService;

    @PostMapping(path = "/update-push-notification", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SavePushNotificationResponse> SavePushNotificationData(
            @RequestBody SavePushNotificationRequest request) {
        SavePushNotificationResponse res = new SavePushNotificationResponse();
        res.setSuccess(savePushNotificationService.savePushNotification(request.getEmployeeId(),
                request.getDeviceUniqueId(), request.getDeviceToken(), request.getTenantId(), request.getIsLogged()));
        return ResponseEntity.ok(res);
    }
}
