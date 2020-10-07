package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Notification Information DTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationInformationDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -772677931359693311L;

    /**
     * notificationId
     */
    private Long notificationId;

    /**
     * notificationType
     */
    private Long notificationType;

    /**
     * notificationSubtype
     */
    private Long notificationSubtype;

    /**
     * activityId
     */
    private Long activityId;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * timelineId
     */
    private Long timelineId;

    /**
     * scheduleId
     */
    private Long scheduleId;

    /**
     * taskId
     */
    private Long taskId;

    /**
     * milestoneId
     */
    private Long milestoneId;

    /**
     * importId
     */
    private Long importId;

    /**
     * message
     */
    private String message;

    /**
     * icon
     */
    private String icon;

    /**
     * notificationSender
     */
    private String notificationSender;
}
