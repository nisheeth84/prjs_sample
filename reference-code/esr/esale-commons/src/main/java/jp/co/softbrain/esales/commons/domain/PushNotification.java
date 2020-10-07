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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Push Notification
 * 
 * @author Admin
 *
 */
@Entity
@Table(name = "push_notification")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PushNotification extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 4294060201468533275L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "push_notification_sequence_generator")
    @SequenceGenerator(name = "push_notification_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "push_notification_id", nullable = false, unique = true)
    private Long pushNotificationId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "device_unique_id", nullable = false)
    private String deviceUniqueId;

    @Column(name = "device_token", nullable = false)
    private String deviceToken;

    @Column(name = "endpoint", nullable = false)
    private String endpoint;
    
    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "is_logged", nullable = false)
    private Boolean isLogged;
}
