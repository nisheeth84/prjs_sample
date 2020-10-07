package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Push Notification Service
 * 
 * @author Admin
 *
 */
@XRayEnabled
public interface PushNotificationService {
    public boolean savePushNotification(Long employeeId, String deviceUniqueId, String deviceToken, String tenantId, Boolean isLogged);
}
