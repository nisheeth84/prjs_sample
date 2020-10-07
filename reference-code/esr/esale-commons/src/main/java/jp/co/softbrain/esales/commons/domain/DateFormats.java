package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DateFormats.
 */
@Entity
@Table(name = "date_formats")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class DateFormats extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5905615842567748862L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "date_formats_sequence_generator")
    @SequenceGenerator(name = "date_formats_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "date_format_id")
    private Long dateFormatId;

    @NotNull
    @Column(name = "language_id")
    private Long languageId;

    @NotNull
    @Column(name = "date_format")
    private String dateFormat;

    @NotNull
    @Column(name = "display_order")
    private Integer displayOrder;
}
