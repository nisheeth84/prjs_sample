package jp.co.softbrain.esales.customers.domain;

import jp.co.softbrain.esales.customers.service.dto.GetMasterScenarioResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.hibernate.type.TextType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;

/**
 * Scenarios entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "masters_scenarios")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetMasterScenariosMapper",
    classes = @ConstructorResult(targetClass = GetMasterScenariosResponseDTO.class, columns = {
        @ColumnResult(name = "scenario_id", type = Long.class),
        @ColumnResult(name = "scenario_name", type = TextType.class),
        @ColumnResult(name = "updated_date", type = Instant.class),
        @ColumnResult(name = "scenario_detail_id", type = Long.class),
        @ColumnResult(name = "milestone_name", type = String.class),
        @ColumnResult(name = "updated_date_detail", type = Instant.class)}))

@SqlResultSetMapping(name = "GetMasterScenarioMapper", classes = {
    @ConstructorResult(targetClass = GetMasterScenarioResponseDTO.class, columns = {
        @ColumnResult(name = "scenario_id", type = Long.class),
        @ColumnResult(name = "scenario_name", type = String.class),
        @ColumnResult(name = "updated_date", type = Instant.class),
        @ColumnResult(name = "scenario_detail_id", type = Long.class),
        @ColumnResult(name = "milestone_name", type = String.class),
        @ColumnResult(name = "display_order", type = Integer.class),
        @ColumnResult(name = "updated_date_detail", type = Instant.class)
    })
})
public class MastersScenarios extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2845076788875370203L;

    /**
     * scenarioId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "masters_scenarios_sequence_generator")
    @SequenceGenerator(name = "masters_scenarios_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "scenario_id", nullable = false, unique = true)
    private Long scenarioId;

    /**
     * scenarioName
     */
    @NotNull
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "scenario_name", columnDefinition = "jsonb")
    private String scenarioName;

}
