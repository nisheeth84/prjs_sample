package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Notification Setting DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationSettingDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3844749411467156564L;

    /**
     * notificationSettingId
     */
    private Long notificationSettingId;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * displayNotificationSetting
     */
    private Long displayNotificationSetting;

    /**
     * saveNotificationSetting
     */
    private Long saveNotificationSetting;

    /**
     * isNotificationMail
     */
    private Boolean isNotificationMail;

    /**
     * notificationTime
     */
    private Long notificationTime;
}
