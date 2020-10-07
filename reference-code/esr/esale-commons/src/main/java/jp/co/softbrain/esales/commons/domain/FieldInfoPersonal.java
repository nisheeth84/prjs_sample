package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A FieldInfoPersonal.
 */
@Entity
@Table(name = "field_info_personal")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "FieldInfoPersonalMapping", classes = {
        @ConstructorResult(targetClass = FieldInfoPersonalResponseDTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "field_type", type = Integer.class),
                @ColumnResult(name = "field_order", type = Integer.class),
                @ColumnResult(name = "item_id", type = Long.class),
                @ColumnResult(name = "item_label", type = String.class),
                @ColumnResult(name = "item_order", type = Integer.class),
                @ColumnResult(name = "item_is_default", type = Boolean.class),
                @ColumnResult(name = "item_is_available", type = Boolean.class),
                @ColumnResult(name = "item_updated_date", type = Instant.class),
                @ColumnResult(name = "field_belong", type = Integer.class),
                @ColumnResult(name = "is_default", type = Boolean.class),
                @ColumnResult(name = "max_length", type = Integer.class),
                @ColumnResult(name = "modify_flag", type = Integer.class),
                @ColumnResult(name = "available_flag", type = Integer.class),
                @ColumnResult(name = "is_double_column", type = Boolean.class),
                @ColumnResult(name = "default_value", type = String.class),
                @ColumnResult(name = "currency_unit", type = String.class),
                @ColumnResult(name = "type_unit", type = Integer.class),
                @ColumnResult(name = "decimal_place", type = Integer.class),
                @ColumnResult(name = "url_type", type = Integer.class),
                @ColumnResult(name = "url_target", type = String.class),
                @ColumnResult(name = "url_text", type = String.class),
                @ColumnResult(name = "link_target", type = Integer.class),
                @ColumnResult(name = "iframe_height", type = Integer.class),
                @ColumnResult(name = "config_value", type = String.class),
                @ColumnResult(name = "is_linked_google_map", type = Boolean.class),
                @ColumnResult(name = "field_group", type = Long.class),
                @ColumnResult(name = "lookup_data", type = String.class),
                @ColumnResult(name = "relation_data", type = String.class),
                @ColumnResult(name = "select_organization_data", type = String.class),
                @ColumnResult(name = "tab_data", type = String.class),
                @ColumnResult(name = "lookup_field_id", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "is_column_fixed", type = Boolean.class),
                @ColumnResult(name = "column_width", type = Integer.class),
                @ColumnResult(name = "relation_field_id", type = Long.class),
                @ColumnResult(name = "difference_setting", type = String.class)
                }) })

@SqlResultSetMapping(name = "CustomFieldsInfoMapping", classes = {
        @ConstructorResult(targetClass = CustomFieldsInfoResponseDTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_belong", type = Integer.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "field_type", type = Integer.class),
                @ColumnResult(name = "field_order", type = Integer.class),
                @ColumnResult(name = "is_default", type = Boolean.class),
                @ColumnResult(name = "max_length", type = Integer.class),
                @ColumnResult(name = "modify_flag", type = Integer.class),
                @ColumnResult(name = "available_flag", type = Integer.class),
                @ColumnResult(name = "is_double_column", type = Boolean.class),
                @ColumnResult(name = "default_value", type = String.class),
                @ColumnResult(name = "currency_unit", type = String.class),
                @ColumnResult(name = "type_unit", type = Integer.class),
                @ColumnResult(name = "decimal_place", type = Integer.class),
                @ColumnResult(name = "url_type", type = Integer.class),
                @ColumnResult(name = "url_target", type = String.class),
                @ColumnResult(name = "url_text", type = String.class),
                @ColumnResult(name = "link_target", type = Integer.class),
                @ColumnResult(name = "iframe_height", type = Integer.class),
                @ColumnResult(name = "config_value", type = String.class),
                @ColumnResult(name = "is_linked_google_map", type = Boolean.class),
                @ColumnResult(name = "field_group", type = Long.class),
                @ColumnResult(name = "lookup_data", type = String.class),
                @ColumnResult(name = "relation_data", type = String.class),
                @ColumnResult(name = "select_organization_data", type = String.class),
                @ColumnResult(name = "tab_data", type = String.class),
                @ColumnResult(name = "lookup_field_id", type = Long.class),
                @ColumnResult(name = "created_date", type = Instant.class),
                @ColumnResult(name = "created_user", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class),
                @ColumnResult(name = "updated_user", type = Long.class),
                @ColumnResult(name = "item_item_id", type = Long.class),
                @ColumnResult(name = "item_is_available", type = Boolean.class),
                @ColumnResult(name = "item_item_order", type = Integer.class),
                @ColumnResult(name = "item_is_default", type = Boolean.class),
                @ColumnResult(name = "item_item_label", type = String.class),
                @ColumnResult(name = "difference_setting", type = String.class),
                @ColumnResult(name = "statistics_item_flag", type = Integer.class),
                @ColumnResult(name = "statistics_condition_flag", type = Integer.class),
                }) })
public class FieldInfoPersonal extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 7183745388524442657L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_info_personal_sequence_generator")
    @SequenceGenerator(name = "field_info_personal_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "field_info_personal_id", nullable = false)
    private Long fieldInfoPersonalId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @NotNull
    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @NotNull
    @Column(name = "extension_belong", nullable = false)
    private Integer extensionBelong;

    @NotNull
    @Column(name = "field_belong", nullable = false)
    private Integer fieldBelong;

    @Column(name = "field_order")
    private Integer fieldOrder;

    @Column(name = "is_column_fixed")
    private Boolean isColumnFixed;

    @Column(name = "column_width")
    private Integer columnWidth;

    @Column(name = "relation_field_id")
    private Long relationFieldId;

    @Column(name = "selected_target_type")
    private Integer selectedTargetType;

    @Column(name = "selected_target_id")
    private Long selectedTargetId;
}
