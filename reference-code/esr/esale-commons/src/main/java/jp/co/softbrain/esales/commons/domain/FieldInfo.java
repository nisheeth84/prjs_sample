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
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import jp.co.softbrain.esales.commons.service.dto.FieldRelationItem1DTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoQueryDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType2DTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A FieldInfo.
 */
@Entity
@Table(name = "field_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "getFieldRelationByFieldBelong", classes = {
        @ConstructorResult(targetClass = FieldRelationItem1DTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "relationFieldBelong", type = Long.class),
                @ColumnResult(name = "relationFieldId", type = Long.class),
                @ColumnResult(name = "relationFieldLabel", type = String.class) }) })
@SqlResultSetMapping(name = "FieldObjectMapping", classes = {
        @ConstructorResult(targetClass = GetImportInitInfoSubType2DTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
@SqlResultSetMapping(name = "FieldsInfoMapping", classes = {
        @ConstructorResult(targetClass = FieldsInfoQueryDTO.class, columns = {
                @ColumnResult(name = "fieldBelong", type = Integer.class),
                @ColumnResult(name = "maxLength", type = Integer.class),
                @ColumnResult(name = "modifyFlag", type = Integer.class),
                @ColumnResult(name = "availableFlag", type = Integer.class),
                @ColumnResult(name = "isDoubleColumn", type = Boolean.class),
                @ColumnResult(name = "defaultValue", type = String.class),
                @ColumnResult(name = "currencyUnit", type = String.class),
                @ColumnResult(name = "typeUnit", type = Integer.class),
                @ColumnResult(name = "decimalPlace", type = Integer.class),
                @ColumnResult(name = "urlType", type = Integer.class),
                @ColumnResult(name = "urlTarget", type = String.class),
                @ColumnResult(name = "urlText", type = String.class),
                @ColumnResult(name = "linkTarget", type = Integer.class),
                @ColumnResult(name = "iframeHeight", type = Integer.class),
                @ColumnResult(name = "isLinkedGoogleMap", type = Boolean.class),
                @ColumnResult(name = "fieldGroup", type = Long.class),
                @ColumnResult(name = "fieldId", type = Long.class),
                @ColumnResult(name = "fieldName", type = String.class),
                @ColumnResult(name = "fieldLabel", type = String.class),
                @ColumnResult(name = "fieldType", type = Integer.class),
                @ColumnResult(name = "fieldOrder", type = Integer.class),
                @ColumnResult(name = "isDefault", type = Boolean.class),
                @ColumnResult(name = "lookupFieldId", type = Long.class),
                @ColumnResult(name = "configValue", type = String.class),
                @ColumnResult(name = "lookupData", type = String.class),
                @ColumnResult(name = "relationData", type = String.class),
                @ColumnResult(name = "selectOrganizationData", type = String.class),
                @ColumnResult(name = "tabData", type = String.class),
                @ColumnResult(name = "updatedDate", type = Instant.class),
                @ColumnResult(name = "createdUser", type = Long.class),
                @ColumnResult(name = "updatedUser", type = Long.class),
                @ColumnResult(name = "createdDate", type = Instant.class) }) })
@SqlResultSetMapping(name = "ListFieldOfFunctionMapping", classes = {
        @ConstructorResult(targetClass = GetFieldInfoTabsOutSubType3DTO.class, columns = {
                @ColumnResult(name = "field_id", type = Long.class),
                @ColumnResult(name = "field_label", type = String.class),
                @ColumnResult(name = "field_type", type = Integer.class),
                @ColumnResult(name = "field_order", type = Integer.class),
                @ColumnResult(name = "field_name", type = String.class),
                @ColumnResult(name = "item_id", type = Long.class),
                @ColumnResult(name = "item_label", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
public class FieldInfo extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 4025987879026105587L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_info_sequence_generator")
    @SequenceGenerator(name = "field_info_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "field_id", nullable = false, unique = true)
    private Long fieldId;

    @NotNull
    @Column(name = "field_belong", nullable = false)
    private Integer fieldBelong;

    @Size(max = 60)
    @Column(name = "field_name", length = 60)
    private String fieldName;

    /**
     * The FieldInfo fieldLabel
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @NotNull
    @Column(name = "field_label", columnDefinition = "jsonb", nullable = false)
    private String fieldLabel;

    @Column(name = "modify_flag")
    private Integer modifyFlag;

    @Column(name = "field_order")
    private Integer fieldOrder;

    @Column(name = "field_type")
    private Integer fieldType;

    @Column(name = "is_double_column")
    private Boolean isDoubleColumn;

    @Column(name = "available_flag")
    private Integer availableFlag;

    @Size(max = 1000)
    @Column(name = "url_target", length = 1000)
    private String urlTarget;

    @Column(name = "url_type")
    private Integer urlType;

    @Size(max = 500)
    @Column(name = "url_text", length = 500)
    private String urlText;

    @Column(name = "config_value")
    private String configValue;

    @Column(name = "decimal_place")
    private Integer decimalPlace;

    @Column(name = "link_target")
    private Integer linkTarget;

    @Column(name = "is_linked_google_map")
    private Boolean isLinkedGoogleMap;

    @Size(max = 1000)
    @Column(name = "default_value", length = 1000)
    private String defaultValue;

    @Column(name = "field_group")
    private Long fieldGroup;

    @Size(max = 50)
    @Column(name = "currency_unit", length = 50)
    private String currencyUnit;

    /**
     * The FieldInfo lookupData
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "lookup_data", columnDefinition = "jsonb")
    private String lookupData;

    /**
     * The FieldInfo relationData
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "relation_data", columnDefinition = "jsonb")
    private String relationData;

    /**
     * The FieldInfo selectOrganizationData
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "select_organization_data", columnDefinition = "jsonb")
    private String selectOrganizationData;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "max_length")
    private Integer maxLength;

    @Column(name = "type_unit")
    private Integer typeUnit;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "tab_data", columnDefinition = "jsonb")
    private String tabData;

    @Column(name = "lookup_field_id")
    private Long lookupFieldId;

    @Column(name = "iframe_height")
    private Integer iframeHeight;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "difference_setting", columnDefinition = "jsonb")
    private String differenceSetting;

    @NotNull
    @Column(name = "statistics_item_flag")
    private Integer statisticsItemFlag;

    @NotNull
    @Column(name = "statistics_condition_flag")
    private Integer statisticsConditionFlag;
}
