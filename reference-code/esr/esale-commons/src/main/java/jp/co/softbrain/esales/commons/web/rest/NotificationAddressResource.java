package jp.co.softbrain.esales.commons.web.rest;

import java.time.Instant;

import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.NotificationAddressService;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationAddressOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateNotificationsAddressRequest;

@RestController
@RequestMapping("/api")
public class NotificationAddressResource {

    /**
     * jwtTokenUtil
     */
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * notificationAddressService
     */
    @Autowired
    private NotificationAddressService notificationAddressService;

    /**
     * updateNotificationAddress : update notification address
     *
     * @param request : request of API updateNotificationAddress
     * @return UpdateNotificationAddressOutDTO : employee id
     */
    @PostMapping(path = "/update-notification-address" , consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateNotificationAddressOutDTO> updateNotificationAddress(@RequestBody UpdateNotificationsAddressRequest request) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        Long notificationId = request.getNotificationId();
        Instant updatedDate = request.getUpdatedDate();
        return ResponseEntity.ok(notificationAddressService.updateNotificationAddress(employeeId, notificationId, updatedDate));
    }
}
