package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * Get Notifications Result DTO
 *
 * @author DatDV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetNotificationsResultDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6770076746159035391L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * createdNotificationDate
     */
    private Instant createdNotificationDate;

    /**
     * confirmNotificationDate
     */
    private Instant confirmNotificationDate;

    /**
     * notificationId
     */
    private Long notificationId;

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
