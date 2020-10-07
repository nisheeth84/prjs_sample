package jp.co.softbrain.esales.customers.domain;

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
 * ScenariosMilestones entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "masters_scenarios_details")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersScenariosDetails extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2512337351200783814L;

    /**
     * scenarioMilestoneId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "masters_scenarios_details_sequence_generator")
    @SequenceGenerator(name = "masters_scenarios_details_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "scenario_detail_id", nullable = false, unique = true)
    private Long scenarioDetailId;

    /**
     * scenarioId
     */
    @NotNull
    @Column(name = "scenario_id", nullable = false)
    private Long scenarioId;

    /**
     * milestoneName
     */
    @Size(max = 255)
    @Column(name = "milestone_name", length = 255)
    private String milestoneName;

    /**
     * The displayOrder
     */
    @Column(name = "display_order")
    private Integer displayOrder;

}
