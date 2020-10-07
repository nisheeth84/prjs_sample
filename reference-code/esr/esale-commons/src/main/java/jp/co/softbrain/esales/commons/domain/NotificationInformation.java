package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *NotificationInformation
 *
 * @author lequyphuc
 *
 */
@Entity
@Table(name = "notification_information")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class NotificationInformation extends AbstractAuditingEntity implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 14734742576256L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_information_sequence_generator")
    @SequenceGenerator(name = "notification_information_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "notification_id", nullable = false)
    private Long notificationId;

    @Column(name = "notification_type", nullable = false)
    private Long notificationType;

    @Column(name = "notification_subtype", nullable = false)
    private Long notificationSubtype;


    @Column(name = "timeline_id")
    private Long timelineId;

    @Column(name = "activity_id")
    private Long activityId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "business_card_id")
    private Long businessCardId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "milestone_id")
    private Long milestoneId;

    @Column(name = "import_id")
    private Long importId;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "message",nullable = false,columnDefinition = "jsonb")
    private String message;

    @Column(name = "icon",length = 255)
    private String icon;

    @Column(name = "notification_sender",length = 255)
    private String notificationSender;
    
}
