package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Notification Type Setting DTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationTypeSettingDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -476439895051175148L;

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
     * notificationTypeName
     */
    private String notificationTypeName;

    /**
     * isNotification
     */
    private Boolean isNotification;

    /**
     * settingNotificationDate
     */
    private Instant settingNotificationDate;
}
