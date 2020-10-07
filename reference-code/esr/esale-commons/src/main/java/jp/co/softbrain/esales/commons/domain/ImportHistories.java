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
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.SqlResultSetMapping;
import jp.co.softbrain.esales.commons.service.dto.GetImportHistoriesDTO;

/**
 * The ImportHistories entity.
 *
 * @author chungochai
 */
@Entity
@Table(name = "import_histories")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetImportHistoriesMapping", classes = {
        @ConstructorResult(targetClass = GetImportHistoriesDTO.class, columns = {
                @ColumnResult(name = "import_file_name", type = String.class),
                @ColumnResult(name = "import_file_path", type = String.class),
                @ColumnResult(name = "import_id", type = Long.class),
                @ColumnResult(name = "error_count", type = Long.class),
                @ColumnResult(name = "inserted_count", type = Long.class),
                @ColumnResult(name = "updated_count", type = Long.class),
                @ColumnResult(name = "import_error_file_path", type = String.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class),
                }) })
public class ImportHistories extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -4918225702247585393L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_histories_sequence_generator")
    @SequenceGenerator(name = "import_histories_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "import_history_id", nullable = false, unique = true)
    private Long importHistoryId;
    
    @NotNull
    @Column(name = "import_id", nullable = false)
    private Long importId;

    @Column(name = "is_import_succeed")
    private Boolean isImportSucceed;

    @Column(name = "error_count")
    private Long errorCount;

    @Column(name = "inserted_count")
    private Long insertedCount;

    @Column(name = "updated_count")
    private Long updatedCount;

    @Column(name = "import_error_file_path")
    private String importErrorFilePath;

}
