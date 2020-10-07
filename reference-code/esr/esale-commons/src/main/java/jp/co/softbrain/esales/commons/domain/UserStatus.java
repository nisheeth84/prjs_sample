package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

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
import lombok.EqualsAndHashCode;

/**
 * A UserStatus.
 */
@Entity
@Table(name = "user_status")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class UserStatus extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_status_sequence_generator")
    @SequenceGenerator(name = "user_status_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Column(name = "status")
    private Integer status;

    @Column(name = "last_activity_time")
    private Instant lastActivityTime;
}
