package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Notification Detail Setting DTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationDetailSettingDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8645330624808007199L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * notificationType
     */
    private Long notificationType;

    /**
     * notificationSubtype
     */
    private Long notificationSubtype;

    /**
     * notificationSubtypeName
     */
    private String notificationSubtypeName;

    /**
     * isNotification
     */
    private Boolean isNotification;

    /**
     * settingNotificationDate
     */
    private Instant settingNotificationDate;
}
