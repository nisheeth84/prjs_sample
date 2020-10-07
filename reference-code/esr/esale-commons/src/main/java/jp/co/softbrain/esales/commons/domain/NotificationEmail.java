package jp.co.softbrain.esales.commons.domain;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A NotificationEmail.
 */
@Entity
@Table(name = "notification_email")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class NotificationEmail extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "notification_email_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_email_sequence_generator")
    @SequenceGenerator(name = "notification_email_sequence_generator", allocationSize = 1)
    private Long notificationEmailId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "email")
    private String email;

}
