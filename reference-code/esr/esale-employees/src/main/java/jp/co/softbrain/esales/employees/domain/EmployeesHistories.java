package jp.co.softbrain.esales.employees.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * The EmployeesHistories entity.
 */
@Entity
@Table(name = "employees_histories")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesHistories extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -7341037973324840428L;

    /**
     * The EmployeesHistories employeeHistoryId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_histories_sequence_generator")
    @SequenceGenerator(name = "employees_histories_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "employee_history_id", nullable = false)
    private Long employeeHistoryId;

    /**
     * The EmployeesHistories employeeId
     */
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    /**
     * The EmployeesHistories contentChange
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content_change", columnDefinition="jsonb")
    private String contentChange;

}
