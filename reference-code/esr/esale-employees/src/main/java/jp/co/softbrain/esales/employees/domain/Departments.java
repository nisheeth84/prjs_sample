package jp.co.softbrain.esales.employees.domain;

import java.io.Serializable;
import java.time.Instant;

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
import javax.validation.constraints.Size;

import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOfEmployeeQueryResult;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.employees.service.dto.DepartmentAndEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType2;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantDepartmentDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A Departments.
 */
@Entity
@Table(name = "departments")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "GetEmployeesSuggestionSubType2Mapping", classes = {
        @ConstructorResult(targetClass = GetEmployeesSuggestionSubType2.class, columns = {
                @ColumnResult(name = "department_id", type = Long.class), @ColumnResult(name = "department_name"),
                @ColumnResult(name = "parent_department_id", type = Long.class),
                @ColumnResult(name = "parent_department_name"),
                @ColumnResult(name = "employee_id", type = Long.class) }) })
@SqlResultSetMapping(name = "EmployeeDepartmentPositionMapping", classes = {
        @ConstructorResult(targetClass = EmployeeDepartmentsDTO.class, columns = {
                @ColumnResult(name = "departmentId", type = Long.class),
                @ColumnResult(name = "departmentName", type = String.class),
                @ColumnResult(name = "departmentOrder", type = Integer.class),
                @ColumnResult(name = "positionId", type = Long.class),
                @ColumnResult(name = "positionName", type = String.class),
                @ColumnResult(name = "positionOrder", type = Integer.class) }) })
@SqlResultSetMapping(name = "InitializeGroupModalSubType1Mapping", classes = {
        @ConstructorResult(targetClass = ParticipantDepartmentDTO.class, columns = {
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "department_name"),
                @ColumnResult(name = "parentDepartmentName"), }) })

@SqlResultSetMapping(name = "DepartmentAndEmployeeDTOMapping", classes = {
        @ConstructorResult(targetClass = DepartmentAndEmployeeDTO.class, columns = {
                @ColumnResult(name = "department_id", type = Long.class),
                @ColumnResult(name = "department_name", type = String.class),
                @ColumnResult(name = "parent_id", type = Long.class),
                @ColumnResult(name = "parent_name", type = String.class),
                @ColumnResult(name = "employee_id", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})
@SqlResultSetMapping(name = "DepartmentManagerMapping", classes = {
        @ConstructorResult(targetClass = DepartmentManagerDTO.class,
                columns = {
                        @ColumnResult(name = "department_id", type = Long.class),
                        @ColumnResult(name = "department_name"),
                        @ColumnResult(name = "manager_id", type = Long.class),
                        @ColumnResult(name = "managerSurname"),
                        @ColumnResult(name = "managerName")
        })
})
@SqlResultSetMapping(name = "GetParentDepartmentDTOMapping", classes = {
        @ConstructorResult(targetClass = GetParentDepartmentDTO.class,
                columns = {
                        @ColumnResult(name = "department_id", type = Long.class),
                        @ColumnResult(name = "pathTreeName", type = String.class),
                        @ColumnResult(name = "pathTreeId", type = String.class)
        })
})
@SqlResultSetMapping(name = "GetDepartmentsOfEmployeeQueryResultMapping", classes = {
        @ConstructorResult(targetClass = GetDepartmentsOfEmployeeQueryResult.class,
                columns = {
                        @ColumnResult(name = "department_id", type = Long.class),
                        @ColumnResult(name = "department_name", type = String.class),
                        @ColumnResult(name = "parent_id", type = Long.class),
                        @ColumnResult(name = "current_id", type = Long.class)
        })
})
public class Departments extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -4101634414401033549L;

    /**
     * The Departments departmentId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "departments_sequence_generator")
    @SequenceGenerator(name = "departments_sequence_generator", allocationSize = 1)
    @Column(name = "department_id", unique = true)
    private Long departmentId;

    /**
     * The Departments departmentName
     */
    @NotNull
    @Size(max = 50)
    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;

    /**
     * The Departments departmentOrder
     */
    @Column(name = "department_order")
    private Integer departmentOrder;

    /**
     * The Departments parentId
     */
    @Column(name = "parent_id")
    private Long parentId;

    /**
     * The Departments managerId
     */
    @Column(name = "manager_id")
    private Long managerId;

}
