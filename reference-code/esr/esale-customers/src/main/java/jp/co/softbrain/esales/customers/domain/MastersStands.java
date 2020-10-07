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
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * MastersStands entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "masters_stands")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersStands extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -4903018336346284211L;

    /**
     * masterStandId
     */
    @Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "masters_stands_sequence_generator")
    @SequenceGenerator(name = "masters_stands_sequence_generator", allocationSize = 1)
    @Column(name = "master_stand_id", nullable = false, unique = true)
    private Long masterStandId;

    /**
     * masterStandName
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "master_stand_name", columnDefinition = "jsonb", nullable = false)
    private String masterStandName;

    /**
     * isAvailable
     */
    @NotNull
    @Column(name = "is_available")
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    @Column(name = "display_order")
    private Integer displayOrder;

}
