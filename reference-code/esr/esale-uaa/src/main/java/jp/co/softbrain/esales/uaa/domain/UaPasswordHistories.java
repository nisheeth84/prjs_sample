package jp.co.softbrain.esales.uaa.domain;
import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The UaPasswordHistories entity.
 */
@Entity
@Table(name = "ua_password_histories")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswordHistories extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * The UaPasswordHistories uaPasswordHistoryId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ua_password_histories_sequence_generator")
    @SequenceGenerator(name = "ua_password_histories_sequence_generator", allocationSize = 1)
    @Column(name = "ua_password_history_id")
    private Long uaPasswordHistoryId;

    /**
     * The UaPasswordHistories employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The UaPasswordHistories password
     */
    @Column(name = "password")
    private String password;

    /**
     * The UaPasswordHistories refixDate
     */
    @Column(name = "refix_date")
    private LocalDate refixDate;
}
