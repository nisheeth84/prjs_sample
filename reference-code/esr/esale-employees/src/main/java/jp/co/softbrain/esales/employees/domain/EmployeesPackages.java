package jp.co.softbrain.esales.employees.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The EmployeesHistories entity.
 */
@Entity
@Table(name = "employees_packages")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "EmployeesPackagesMapping", classes = {
        @ConstructorResult(targetClass = EmployeesPackagesSubtypeDTO.class,
                columns = {
                @ColumnResult(name = "package_name"),
                @ColumnResult(name = "package_id", type = Long.class),
                @ColumnResult(name = "employee_id", type = Long.class)
        })
})
public class EmployeesPackages extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3218851359354704322L;

    /**
     * The EmployeesPackages employeePackageId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_packages_sequence_generator")
    @SequenceGenerator(name = "employees_packages_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "employee_package_id", nullable = false)
    private Long employeePackageId;

    /**
     * The EmployeesPackages employeeId
     */
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    /**
     * The EmployeesPackages packageId
     */
    @NotNull
    @Column(name = "package_id", nullable = false)
    private Long packageId;
}
