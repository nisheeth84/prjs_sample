package jp.co.softbrain.esales.commons.domain;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A NotificationSetting.
 */
@Entity
@Table(name = "notification_setting")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

public class NotificationSetting extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "notification_setting_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_setting_sequence_generator")
    @SequenceGenerator(name = "notification_setting_sequence_generator", allocationSize = 1)
    private Long notificationSettingId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "display_notification_setting")
    private Long displayNotificationSetting;

    @Column(name = "save_notification_setting")
    private Long saveNotificationSetting;

    @Column(name = "is_notification_mail")
    private Boolean isNotificationMail;

    @Column(name = "notification_time")
    private Long notificationTime;

}
