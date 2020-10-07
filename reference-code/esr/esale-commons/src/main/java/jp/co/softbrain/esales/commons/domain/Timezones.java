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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Timezone entity.
 */
@Entity
@Table(name = "timezones")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper=true)
public class Timezones extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5689932405845526675L;

    /**
     * The Timezone id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "timezone_sequence_generator")
    @SequenceGenerator(name = "timezone_sequence_generator")
    @NotNull
    @Column(name = "timezone_id", nullable = false)
    private Long timezoneId;

    /**
     * The Timezone shortName
     */
    @NotNull
    @Size(max = 20)
    @Column(name = "timezone_short_name", nullable = false, length = 20)
    private String timezoneShortName;

    /**
     * The Timezone name
     */
    @NotNull
    @Size(max = 100)
    @Column(name = "timezone_name", nullable = false, length = 100)
    private String timezoneName;

    /**
     * The Timezone displayOrder
     */
    @Column(name = "display_order")
    private Integer displayOrder;

}
