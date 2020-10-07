package jp.co.softbrain.esales.commons.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.PushNotification;
import jp.co.softbrain.esales.commons.repository.PushNotificationRepository;
import jp.co.softbrain.esales.commons.service.AmazonSNSPublisherService;
import jp.co.softbrain.esales.commons.service.PushNotificationService;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * Save Push Notification Service Impl
 * 
 * @author Admin
 *
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class PushNotificationServiceImpl implements PushNotificationService {

    private final Logger log = LoggerFactory.getLogger(PushNotificationServiceImpl.class);

    @Autowired
    private PushNotificationRepository pushNotificationRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

//    @Autowired
    private AmazonSNSPublisherService amazonSNSPublisherService;

    @Override
    public boolean savePushNotification(Long employeeId, String deviceUniqueId, String deviceToken, String tenantId, Boolean isLogged) {
        try {
            List<PushNotification> pushNotifications = pushNotificationRepository
                    .getPushNotificationFromDeviceUniqueId(deviceUniqueId);
            if (isLogged) {
                if (pushNotifications != null && pushNotifications.size() > 0) {
                    PushNotification pushNotification = pushNotifications.get(0);
                    if (pushNotification.getDeviceToken().equals(deviceToken)) {
                        pushNotificationRepository.updatePushNotification(employeeId, deviceUniqueId, deviceToken,
                                pushNotification.getEndpoint(), tenantId, true);
                    } else {
                        // delete old endpoint
                        amazonSNSPublisherService.deleteEndpoint(pushNotification.getEndpoint());
                        // create new endpoint
                        String endpoint = amazonSNSPublisherService.createEndpoint(deviceToken);
                        pushNotificationRepository.updatePushNotification(employeeId, deviceUniqueId, deviceToken,
                                endpoint, tenantId, true);
                    }
                } else {
                    // create endpoint
                    String endpoint = amazonSNSPublisherService.createEndpoint(deviceToken);
                    PushNotification pushNotification = new PushNotification();
                    pushNotification.setDeviceToken(deviceToken);
                    pushNotification.setDeviceUniqueId(deviceUniqueId);
                    pushNotification.setEmployeeId(employeeId);
                    pushNotification.setEndpoint(endpoint);
                    pushNotification.setTenantId(tenantId);
                    pushNotification.setIsLogged(true);
                    pushNotification.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                    pushNotification.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                    pushNotificationRepository.save(pushNotification);
                }
            } else {
                if (pushNotifications != null && pushNotifications.size() > 0) {
                    pushNotificationRepository.updatePushNotification(employeeId, tenantId, false);
                }
            }
            return true;
        } catch (Exception ex) {
            log.error("Save PushNotification Error", ex);
            return false;
        }
    }
}
