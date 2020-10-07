package jp.co.softbrain.esales.customers.domain;

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
import lombok.EqualsAndHashCode;

/**
 * The Calendars entity.
 */
@Entity
@Table(name = "calendars_view")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Calendars extends AbstractAuditingEntity implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 4045283483028434100L;

    /**
     * The Calendar Id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "calendars_sequence_generator")
    @SequenceGenerator(name = "calendars_sequence_generator", allocationSize = 1)
    @Column(name = "calendar_id", nullable = false)
    private Long calendarId;

    /**
     * The Item Division
     */
    @Column(name = "item_division", nullable = false)
    private Integer itemDivision;

    /**
     * The Tasks Start Date
     */
    @Column(name = "start_date")
    private Instant startDate;

    /**
     * The Tasks finish Date
     */
    @Column(name = "finish_date")
    private Instant finishDate;

    /**
     * The milestone ID
     */
    @Column(name = "is_public")
    private Boolean isPublic;

}
