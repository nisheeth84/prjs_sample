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
 * The FieldInfoTabPersonal entity.
 * 
 * @author chungochai
 */
@Entity
@Table(name = "field_info_tab_personal")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoTabPersonal extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 8696512671154930908L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_info_tab_personal_sequence_generator")
    @SequenceGenerator(name = "field_info_tab_personal_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "field_info_tab_personal_id", nullable = false)
    private Long fieldInfoTabPersonalId;

    @NotNull
    @Column(name = "field_info_tab_id", nullable = false)
    private Long fieldInfoTabId;

    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "is_column_fixed")
    private boolean isColumnFixed;

    @Column(name = "column_width")
    private Integer columnWidth;

}
