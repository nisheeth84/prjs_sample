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

import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The EmployeesDepartments entity.
 */
@Entity
@Table(name = "employees_departments")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper=true)
@SqlResultSetMapping(name = "DepartmentPositionDTOMapping", classes = {
        @ConstructorResult(targetClass = DepartmentPositionDTO.class,
                columns = {
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "department_name"),
                @ColumnResult(name = "position_id", type = Long.class),
                @ColumnResult(name = "position_name"),
                @ColumnResult(name = "position_order", type = Integer.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "employee_surname"),
                @ColumnResult(name = "employee_name"),
                @ColumnResult(name = "manager_id", type = Long.class),
                @ColumnResult(name = "manager_photo_file_path")
        })
})
@SqlResultSetMapping(name = "EmployeeNameDTOMapping", classes = {
        @ConstructorResult(targetClass = EmployeeNameDTO.class,
                columns = {
                @ColumnResult(name = "employeeId", type = Long.class),
                @ColumnResult(name = "employeeName")
        })
})
@SqlResultSetMapping(name = "DepartmentSelectedOrganization", classes = {
        @ConstructorResult(targetClass = DepartmentSelectedOrganizationDTO.class,
                columns = {
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "department_name", type = String.class),
                @ColumnResult(name = "parent_department_id", type = Long.class),
                @ColumnResult(name = "parent_department_name", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
        })
})
public class EmployeesDepartments extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 9076545192229697108L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_departments_sequence_generator")
    @SequenceGenerator(name = "employees_departments_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "employees_departments_id", nullable = false, unique = true)
    private Long employeesDepartmentsId;

    /**
     * The EmployeesDepartments employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The EmployeesDepartments employeeCode
     */
    @Column(name = "department_id")
    private Long departmentId;

    /**
     * The EmployeesDepartments positionId
     */
    @Column(name = "position_id")
    private Long positionId;

    /**
     * The EmployeesDepartments managerId
     */
    @Column(name = "manager_id")
    private Long managerId;
}
