package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetSettingEmployeesResultDTO;
import lombok.Data;

/**
 * A NotificationDetailSetting.
 */
@Entity
@Table(name = "notification_detail_setting")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@SqlResultSetMapping(name = "GetNotificationSettingResult" , classes = {
    @ConstructorResult(targetClass = GetNotificationSettingResultDTO.class,
        columns = {
            @ColumnResult(name = "notification_type",type = Long.class),
            @ColumnResult(name = "notification_subtype" , type = Long.class),
            @ColumnResult(name = "is_notification" , type = Boolean.class),
            @ColumnResult(name = "notification_subtype_name" , type = String.class),
            @ColumnResult(name = "notification_type_name" , type = String.class),
            @ColumnResult(name = "email" , type = String.class),
            @ColumnResult(name = "notification_time" , type = Long.class),
            @ColumnResult(name = "employee_id" , type = Long.class)
        })
})

@SqlResultSetMapping(name = "getSettingEmployeesResult" , classes = {
        @ConstructorResult(targetClass = GetSettingEmployeesResultDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "notification_type", type = Long.class),
                @ColumnResult(name = "notification_subtype", type = Long.class),
                @ColumnResult(name = "is_notification", type = Boolean.class),
                @ColumnResult(name = "notification_subtype_name", type = String.class),
                @ColumnResult(name = "notification_type_name", type = String.class),
                @ColumnResult(name = "email", type = String.class),
                @ColumnResult(name = "notification_time", type = Long.class) }) })
public class NotificationDetailSetting extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "notification_detail_setting_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_detail_setting_sequence_generator")
    @SequenceGenerator(name = "notification_detail_setting_sequence_generator", allocationSize = 1)
    private Long notificationDetailSettingId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "notification_type")
    private Long notificationType;

    @Column(name = "notification_subtype")
    private Long notificationSubtype;

    @Column(name = "notification_subtype_name")
    private String notificationSubtypeName;

    @Column(name = "is_notification")
    private Boolean isNotification;

    @Column(name = "setting_notification_date")
    private Instant settingNotificationDate;

}
