package jp.co.softbrain.esales.employees.domain;

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
 * A EmployeesGroupMembers.
 */
@Entity
@Table(name = "employees_group_members")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupMembers extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -8135463191948140680L;

    /**
     * The EmployeesGroupMembers groupMemberId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_group_members_sequence_generator")
    @SequenceGenerator(name = "employees_group_members_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "group_member_id", nullable = false, unique = true)
    private Long groupMemberId;

    /**
     * The EmployeesGroupMembers groupId
     */
    @NotNull
    @Column(name = "group_id", nullable = false)
    private Long groupId;

    /**
     * The EmployeesGroupMembers employeeId
     */
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
}
