package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.NotificationInformationService;
import jp.co.softbrain.esales.commons.service.dto.CreateNotificationResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateNotificationRequest;

/**
 * CreateNotificationResource
 *
 * @author lequyphuc
 */
@RestController
@RequestMapping("/api")
public class CreateNotificationResource {

    @Autowired
    private NotificationInformationService notificationInformationService;

    /**
     * create Notification
     *
     * @param request value get from request
     * @return response
     */
    @PostMapping(path = "/create-notification", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateNotificationResponse> createNotification(
            @RequestBody CreateNotificationRequest request) {
        CreateNotificationResponse response = new CreateNotificationResponse();
        response.setNotificationIds(notificationInformationService.createNotification(request.getDataNotification(),
                request.getDateTimelines(), request.getActivite(), request.getCustomer(), request.getBusinessCards(),
                request.getDataCalendar(), request.getImports()));
        return ResponseEntity.ok(response);
    }

}
