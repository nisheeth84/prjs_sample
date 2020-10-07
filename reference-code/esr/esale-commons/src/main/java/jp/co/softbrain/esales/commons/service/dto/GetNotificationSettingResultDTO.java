package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Get Notification Setting Result DTO
 *
 * @author DatDV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetNotificationSettingResultDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6476010634314603464L;

    /**
     * notificationType
     */
    private Long notificationType;

    /**
     * notificationSubtype
     */
    private Long notificationSubtype;

    /**
     * isNotification
     */
    private Boolean isNotification;

    /**
     * notificationSubtypeName
     */
    private String notificationSubtypeName;

    /**
     * notificationTypeName
     */
    private String notificationTypeName;

    /**
     * email
     */
    private String email;

    /**
     * notificationTime
     */
    private Long notificationTime;

    /**
     * employeeId
     */
    private Long employeeId;
}
