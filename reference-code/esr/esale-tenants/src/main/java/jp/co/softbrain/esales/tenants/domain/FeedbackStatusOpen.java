package jp.co.softbrain.esales.tenants.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * FeedbackStatusOpen
 *
 * @author DatDV
 */
@Entity
@Table(name = "feedback_status_open")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class FeedbackStatusOpen extends AbstractAuditingEntity implements Serializable {

    /**
     * Feedback
     */
    private static final long serialVersionUID = 7988945247676003239L;

    /**
     * employeeId
     */
    @Id
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    /**
     * tenantName
     */
    @Column(name = "tenant_name")
    private String tenantName;
}
