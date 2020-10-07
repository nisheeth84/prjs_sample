package jp.co.softbrain.esales.commons.domain;

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

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity mapping table list_view_settings
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "list_view_settings")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class ListViewSettings extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -6461183592193903282L;

    /**
     * listViewSettingId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "list_view_settings_sequence_generator")
    @SequenceGenerator(name = "list_view_settings_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "list_view_setting_id", nullable = false, unique = true)
    private Long listViewSettingId;

    /**
     * fieldBelong
     */
    @NotNull
    @Column(name = "field_belong", nullable = false)
    private Integer fieldBelong;

    /**
     * employeeId
     */
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    /**
     * selectedTargetType
     */
    @NotNull
    @Column(name = "selected_target_type", nullable = false)
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    @NotNull
    @Column(name = "selected_target_id", nullable = false)
    private Long selectedTargetId;

    /**
     * extraSettings
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "extra_settings", columnDefinition = "jsonb")
    private String extraSettings;

    /**
     * orderBy
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "order_by", columnDefinition = "jsonb")
    private String orderBy;

}
