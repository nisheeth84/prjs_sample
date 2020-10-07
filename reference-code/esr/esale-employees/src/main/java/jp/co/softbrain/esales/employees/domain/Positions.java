package jp.co.softbrain.esales.employees.domain;

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

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Positions entity.
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Table(name = "positions")
@Data
@EqualsAndHashCode(callSuper = true)
public class Positions extends AbstractAuditingEntity implements Serializable {

    /**
     * The serialVersionUID
     */

    private static final long serialVersionUID = -4833271246443953392L;

    /**
     * The Positions ID
     */
    @Id
    @SequenceGenerator(name = "positions_sequence_generator", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "positions_sequence_generator")
    @Column(name = "position_id", nullable = false)
    @NotNull
    private Long positionId;

    /**
     * The Name
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "position_name", columnDefinition = "jsonb")
    private String positionName;

    /**
     * The position order
     */
    @Column(name = "position_order")
    private Integer positionOrder;

    /**
     * The use status
     */
    @Column(name = "is_available")
    private Boolean isAvailable;
}
