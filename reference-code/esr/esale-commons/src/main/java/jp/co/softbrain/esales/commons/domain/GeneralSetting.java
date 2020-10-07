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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity mapping table general_setting
 * 
 * @author phamminhphu
 */
@Entity
@Table(name = "general_setting")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class GeneralSetting extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -3121370625655708330L;

    /**
     * general_setting_id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "general_setting_sequence_generator")
    @SequenceGenerator(name = "general_setting_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "general_setting_id", nullable = false, unique = true)
    private Long generalSettingId;

    /**
     * setting_name
     */
    @NotNull
    @Size(max = 255)
    @Column(name = "setting_name", nullable = false, length = 255)
    private String settingName;

    /**
     * setting_value
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "setting_value", columnDefinition = "jsonb")
    private String settingValue;
}
