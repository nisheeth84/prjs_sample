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

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DataChange entity.
 * 
 * @author chungochai
 */
@Entity
@Table(name = "data_change")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class DataChange extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 3874768500817458318L;

    /**
     * The DataChange serviceId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "data_change_sequence_generator")
    @SequenceGenerator(name = "data_change_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "data_change_id", nullable = false)
    private Long dataChangeId;

    /**
     * The DataChange dataId
     */
    @NotNull
    @Column(name = "data_id", nullable = false)
    private Long dataId;

    /**
     * The DataChange extensionBelong
     */
    @NotNull
    @Column(name = "extension_belong", nullable = false)
    private Integer extensionBelong;

    /**
     * The DataChange extensionBelong
     */
    @NotNull
    @Column(name = "action", nullable = false)
    private Integer action;

}
