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
 * The ImportSetting entity.
 *
 * @author dohuyhai
 */
@Entity
@Table(name = "import_setting")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class ImportSetting extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5550353904883237279L;

    /**
     * import Id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_setting_sequence_generator")
    @SequenceGenerator(name = "import_setting_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "import_id", nullable = false, unique = true)
    private Long importId;

    /**
     * service Id
     */
    @NotNull
    @Column(name = "service_id", nullable = false)
    private Integer serviceId;

    /**
     * import File Name
     */
    @NotNull
    @Column(name = "import_file_name")
    private String importFileName;

    /**
     * import File Path
     */
    @Column(name = "import_file_path")
    private String importFilePath;

    /**
     * is Simulation Mode
     */
    @NotNull
    @Column(name = "is_simulation_mode")
    private Boolean isSimulationMode;

    /**
     * import Action
     */
    @NotNull
    @Column(name = "import_action")
    private Integer importAction;

    /**
     * is Duplicate Allowed
     */
    @NotNull
    @Column(name = "is_duplicate_allowed")
    private Boolean isDuplicateAllowed;

    /**
     * mapping Item
     */
    @Column(name = "mapping_item", columnDefinition = "jsonb")
    private String mappingItem;

    /**
     * matching Key
     */
    @NotNull
    @Column(name = "matching_key", columnDefinition = "jsonb")
    private String matchingKey;

    /**
     * matching Relation
     */
    @Column(name = "matching_relation", columnDefinition = "jsonb")
    private String matchingRelation;
    
    /**
     * notice List
     */
    @Column(name = "notice_list", columnDefinition = "jsonb")
    private String noticeList;
    
    /**
     * is Auto Post Timeline
     */
    @Column(name = "is_auto_post_timeline")
    private Boolean isAutoPostTimeline;
    
    /**
     * list Id
     */
    @Column(name = "list_id")
    private Long listId;

    /**
     * language Code
     */
    @Column(name = "language_code")
    private String languageCode;

}
