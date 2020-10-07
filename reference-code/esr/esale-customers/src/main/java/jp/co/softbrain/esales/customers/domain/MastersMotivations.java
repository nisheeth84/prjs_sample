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
 * The masters_motivations entity
 *
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "masters_motivations")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersMotivations extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -8062058478828095414L;

    /**
     * masterMotivationId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "masters_motivations_sequence_generator")
    @SequenceGenerator(name = "masters_motivations_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "master_motivation_id", nullable = false, unique = true)
    private Long masterMotivationId;

    /**
     * masterMotivationName
     */
    @NotNull
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "master_motivation_name", columnDefinition = "jsonb")
    private String masterMotivationName;

    /**
     * iconType
     */
    @NotNull
    @Column(name = "icon_type")
    private Integer iconType;

    /**
     * iconPath
     */
    @Size(max = 255)
    @Column(name = "icon_path", length = 255)
    private String iconPath;

    /**
     * iconName
     */
    @Size(max = 100)
    @Column(name = "icon_name", length = 100)
    private String iconName;

    /**
     * backgroundColor
     */
    @NotNull
    @Column(name = "background_color")
    private Integer backgroundColor;

    /**
     * isAvailable
     */
    @NotNull
    @Column(name = "is_available")
    private Boolean isAvailable;

    /**
     * displayOrder
     */
    @Column(name = "display_order")
    private Integer displayOrder;

}
