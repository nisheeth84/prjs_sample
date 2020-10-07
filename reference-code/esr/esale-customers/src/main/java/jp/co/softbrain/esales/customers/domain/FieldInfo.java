package jp.co.softbrain.esales.customers.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

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
