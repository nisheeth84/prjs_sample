package jp.co.softbrain.esales.customers.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Tasks entity.
 */
@Entity
@Table(name = "tasks_view")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Tasks extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3238280489459968481L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tasks_sequence_generator")
    @SequenceGenerator(name = "tasks_sequence_generator", allocationSize = 1)
    @Column(name = "task_id", nullable = false)
    private Long taskId;

    /**
     * The Tasks Name
     */
    @Column(name = "task_name")
    private String taskName;

    /**
     * The Tasks Status
     */
    @Column(name = "status")
    private Integer status;

    /**
     * The parent ID
     */
    @Column(name = "parent_id")
    private Long parentId;

    /**
     * The Customer ID
     */
    @Column(name = "customer_id")
    private Long customerId;

    /**
     * The milestone ID
     */
    @Column(name = "milestone_id")
    private Long milestoneId;

    /**
     * The memo
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "memo", columnDefinition = "text")
    private String memo;

    /**
     * The calendar id
     */
    @Column(name = "calendar_id")
    private Long calendarId;

    /**
     * The Tasks Data
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "task_data", columnDefinition="jsonb")
    private String taskData;

}
