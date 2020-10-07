package jp.co.softbrain.esales.commons.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * The Language entity.
 */
@Entity
@Table(name = "languages")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Languages extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -4838764152316194948L;

    /**
     * The Language languageId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "languages_sequence_generator")
    @SequenceGenerator(name = "languages_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "language_id", nullable = false)
    private Long languageId;

    /**
     * The Language languageName
     */
    @NotNull
    @Size(max = 50)
    @Column(name = "language_name", nullable = false, length = 50)
    private String languageName;

    /**
     * The Language languageCode
     */
    @NotNull
    @Size(max = 5)
    @Column(name = "language_code", nullable = false, length = 5)
    private String languageCode;

    /**
     * The Language displayOrder
     */
    @Column(name = "display_order")
    private Long displayOrder;

}
