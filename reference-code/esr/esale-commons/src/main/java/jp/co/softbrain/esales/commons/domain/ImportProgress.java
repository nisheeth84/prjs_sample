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
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The ImportProgress entity.
 *
 * @author dohuyhai
 */
@Entity
@Table(name = "import_progress")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class ImportProgress extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7229887217261231446L;

    /**
     * import Progress Id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_progress_sequence_generator")
    @SequenceGenerator(name = "import_progress_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "import_progress_id", nullable = false, unique = true)
    private Long importProgressId;

    /**
     * import Id
     */
    @NotNull
    @Column(name = "import_id", nullable = false)
    private Long importId;
    
    /**
     * import Status
     */
    @NotNull
    @Column(name = "import_status", nullable = false)
    private Integer importStatus;
    
    /**
     * import Row Finish
     */
    @NotNull
    @Column(name = "import_row_finish", nullable = false)
    private Integer importRowFinish;

    /**
     * import Batch Start Time
     */
    @Column(name = "import_batch_start_time")
    private Instant importBatchStartTime;

    /**
     * import Batch Finish Time
     */
    @Column(name = "import_batch_finish_time")
    private Instant importBatchFinishTime;

}
