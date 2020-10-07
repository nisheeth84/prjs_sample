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
 * The EmployeesGroupParticipants entity.
 */
@Entity
@Table(name = "employees_group_participants")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupParticipants extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -6414509031027806325L;

    /**
     * The EmployeesGroupParticipants employeeGroupParticipantId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_group_participants_sequence_generator")
    @SequenceGenerator(name = "employees_group_participants_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "employee_group_participant_id", nullable = false)
    private Long employeeGroupParticipantId;

    /**
     * The EmployeesGroupParticipants groupId
     */
    @NotNull
    @Column(name = "group_id", nullable = false)
    private Long groupId;

    /**
     * The EmployeesGroupParticipants employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The EmployeesGroupParticipants departmentId
     */
    @Column(name = "department_id")
    private Long departmentId;

    /**
     * The EmployeesGroupParticipants participantGroupId
     */
    @Column(name = "participant_group_id")
    private Long participantGroupId;

    /**
     * The EmployeesGroupParticipants participantType
     */
    @Column(name = "participant_type")
    private Integer participantType;

}
