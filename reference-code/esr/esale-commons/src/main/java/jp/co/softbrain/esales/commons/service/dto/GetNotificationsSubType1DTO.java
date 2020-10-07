package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Get Notifications SubType1 DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetNotificationsSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1842625130262072172L;

    /**
     * notificationId
     */
    private Long notificationId;

    /**
     * createdNotificationDate
     */
    private Instant createdNotificationDate;

    /**
     * confirmNotificationDate
     */
    private Instant confirmNotificationDate;

    /**
     * message
     */
    private String message;

    /**
     * icon
     */
    private String icon;

    /**
     * timelineId
     */
    private Long timelineId;

    /**
     * activity_id
     */
    private Long activityId;

    /**
     * customer_id
     */
    private Long customerId;

    /**
     * business_card_id
     */
    private Long businessCardId;

    /**
     * schedule_id
     */
    private Long scheduleId;

    /**
     * task_id
     */
    private Long taskId;

    /**
     * milestone_id
     */
    private Long milestoneId;

    /**
     * import_id
     */
    private Long importId;

    /**
     * notificationSender
     */
    private String notificationSender;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
