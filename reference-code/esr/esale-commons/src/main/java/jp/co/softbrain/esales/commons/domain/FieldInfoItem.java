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
 * A FieldInfoItem.
 */
@Entity
@Table(name = "field_info_item")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoItem extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 8311710818631948746L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_info_item_sequence_generator")
    @SequenceGenerator(name = "field_info_item_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "item_id", nullable = false, unique = true)
    private Long itemId;

    @NotNull
    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "item_order")
    private Integer itemOrder;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @NotNull
    @Column(name = "item_label", columnDefinition = "jsonb", nullable = false)
    private String itemLabel;
}
