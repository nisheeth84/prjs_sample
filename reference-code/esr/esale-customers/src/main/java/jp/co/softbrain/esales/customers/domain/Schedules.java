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
 * Entities for Schedules
 *
 * @author tinhbv
 */
@Entity
@Table(name = "schedules_view")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Schedules extends AbstractAuditingEntity implements Serializable {
    /**
     *serialVersionUID
     */
    private static final long serialVersionUID = 1210466134576237804L;

    /**
     * The schedule Id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schedules_sequence_generator")
    @SequenceGenerator(name = "schedules_sequence_generator", allocationSize = 1)
    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;
    /**
     * The schedule repeat id
     */
    @Column(name = "schedule_repeat_id")
    private Long scheduleRepeatId;
    /**
     * The calendar id
     */
    @Column(name = "calendar_id", nullable = false)
    private Long calendarId;
    /**
     * The schedule type id
     */
    @Column(name = "schedule_type_id", nullable = false)
    private Long scheduleTypeId;
    /**
     * The schedule name
     */
    @Column(name = "schedule_name", length = 1000, nullable = false)
    private String scheduleName;
    /**
     * The is full day
     */
    @Column(name = "is_full_day")
    private Boolean isFullDay;
    /**
     * The is repeated
     */
    @Column(name = "is_repeated")
    private Boolean isRepeated;
    /**
     * The is all attended
     */
    @Column(name = "is_all_attended")
    private Boolean isAllAttended;
    /**
     * The customter Id
     */
    @Column(name = "customer_id")
    private Long customerId;
    /**
     * The zip code
     */
    @Column(name = "zip_code", length = 16)
    private String zipCode;
    /**
     * The building Name
     */
    @Column(name = "building_name")
    private String buildingName;
    /**
     * The address
     */
    @Column(name = "address", length = 1000)
    private String address;
    /**
     * The note
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "note", columnDefinition = "text")
    private String note;
    /**
     * The can modify
     */
    @Column(name = "can_modify")
    private Boolean canModify;
}
