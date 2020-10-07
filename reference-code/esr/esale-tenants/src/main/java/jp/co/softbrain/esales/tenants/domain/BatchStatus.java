package jp.co.softbrain.esales.tenants.domain;

import java.io.Serializable;
import java.time.Instant;

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

/**
 * The BatchStatus entity.
 * @author phamhoainam
 */
@Entity
@Table(name = "batch_status")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
public class BatchStatus implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_status_sequence_generator")
    @SequenceGenerator(name = "batch_status_sequence_generator", allocationSize = 1)
    private Long id;

    @Column(name = "update_time")
    private Instant updateTime;
}
