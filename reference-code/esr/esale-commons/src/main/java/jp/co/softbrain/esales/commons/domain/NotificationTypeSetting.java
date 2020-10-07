package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;

/**
 * A NotificationTypeSetting.
 */
@Entity
@Table(name = "notification_type_setting")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class NotificationTypeSetting extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "notification_type_setting_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_type_setting_sequence_generator")
    @SequenceGenerator(name = "notification_type_setting_sequence_generator", allocationSize = 1)
    private Long notificationTypeSettingId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @NotNull
    @Column(name = "notification_type", nullable = false)
    private Long notificationType;

    @Column(name = "notification_type_name")
    private String notificationTypeName;
}
