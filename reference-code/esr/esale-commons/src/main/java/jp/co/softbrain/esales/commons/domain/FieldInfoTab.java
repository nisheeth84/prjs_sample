package jp.co.softbrain.esales.commons.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType2DTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A FieldInfoTab.
 */
@Entity
@Table(name = "field_info_tab")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetFieldInfoTabsSubType2Mapping", classes = {
        @ConstructorResult(targetClass = GetFieldInfoTabsOutSubType2DTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_info_tab_id", type = Long.class),
                @ColumnResult(name = "field_info_tab_personal_id", type = Long.class),
                @ColumnResult(name = "field_order", type = Integer.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "field_type", type = Integer.class),
                @ColumnResult(name = "is_column_fixed", type = Boolean.class),
                @ColumnResult(name = "column_width", type = Integer.class),
                @ColumnResult(name = "item_id", type = Long.class),
                @ColumnResult(name = "item_label", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
public class FieldInfoTab extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 4235879124002363539L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_info_tab_sequence_generator")
    @SequenceGenerator(name = "field_info_tab_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "field_info_tab_id", nullable = false)
    private Long fieldInfoTabId;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @NotNull
    @Column(name = "tab_belong", nullable = false)
    private Integer tabBelong;

    @Column(name = "field_order")
    private Integer fieldOrder;

    @NotNull
    @Column(name = "tab_id", nullable = false)
    private Integer tabId;
}
