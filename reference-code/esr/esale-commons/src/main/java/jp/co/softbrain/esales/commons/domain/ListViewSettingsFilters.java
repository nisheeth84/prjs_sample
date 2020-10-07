package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.hibernate.type.TextType;

import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity mapping table list_view_settings_filters
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "list_view_settings_filters")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetInformationFilterListDTOMapping", classes = {
        @ConstructorResult(targetClass = ListViewSettingsFiltersDTO.class,
                columns = {
                        @ColumnResult(name = "list_view_setting_filter_id", type = Long.class),
                        @ColumnResult(name = "list_view_setting_id", type = Long.class),
                        @ColumnResult(name = "target_type", type = Integer.class),
                        @ColumnResult(name = "target_id", type = Long.class),
                        @ColumnResult(name = "filter_value", type = TextType.class)
        })
})
public class ListViewSettingsFilters extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -555123431063823475L;

    /**
     * listViewSettingsFiltersId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "list_view_settings_filters_sequence_generator")
    @SequenceGenerator(name = "list_view_settings_filters_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "list_view_setting_filter_id", nullable = false, unique = true)
    private Long listViewSettingFilterId;

    /**
     * listViewSettingId
     */
    @NotNull
    @Column(name = "list_view_setting_id", nullable = false)
    private Long listViewSettingId;

    /**
     * targetType
     */
    @NotNull
    @Column(name = "target_type", nullable = false)
    private Integer targetType;

    /**
     * targetId
     */
    @NotNull
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    /**
     * searchValue
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "filter_value", columnDefinition = "jsonb")
    private String filterValue;
}
