package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.GetNotificationsResultDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * NotificationAddress
 *
 * @author lequyphuc
 */
@Entity
@Table(name = "notification_address")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@IdClass(NotificationAddressKey.class)
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetNotificationResult", classes = {
        @ConstructorResult(targetClass = GetNotificationsResultDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "created_notification_date", type = Instant.class),
                @ColumnResult(name = "confirm_notification_date", type = Instant.class),
                @ColumnResult(name = "notification_id", type = Long.class),
                @ColumnResult(name = "message", type = String.class),
                @ColumnResult(name = "icon", type = String.class),
                @ColumnResult(name = "timeline_id", type = Long.class),
                @ColumnResult(name = "activity_id", type = Long.class),
                @ColumnResult(name = "customer_id", type = Long.class),
                @ColumnResult(name = "business_card_id", type = Long.class),
                @ColumnResult(name = "schedule_id", type = Long.class),
                @ColumnResult(name = "task_id", type = Long.class),
                @ColumnResult(name = "milestone_id", type = Long.class),
                @ColumnResult(name = "import_id", type = Long.class),
                @ColumnResult(name = "notification_sender", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})
public class NotificationAddress extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 18458648964734L;

    @Id
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Id
    @NotNull
    @Column(name = "notification_id", nullable = false)
    private Long notificationId;

    @Column(name = "created_notification_date", nullable = false)
    private Instant createdNotificationDate;

    @Column(name = "confirm_notification_date")
    private Instant confirmNotificationDate;
}
