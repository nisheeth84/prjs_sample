package jp.co.softbrain.esales.customers.domain;

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
 * The customers_list_participants entity
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers_list_participants")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListParticipants extends AbstractAuditingEntity implements Serializable{

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 2272413093424402125L;

    /**
     * customerListParticipantId
     */
    @Id
    @NotNull
    @Column(name = "customer_list_participant_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_list_participants_sequence_generator")
    @SequenceGenerator(name = "customers_list_participants_sequence_generator", allocationSize = 1)
    private Long customerListParticipantId;

    /**
     * customerListId
     */
    @NotNull
    @Column(name = "customer_list_id")
    private Long customerListId;

    /**
     * employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * departmentId
     */
    @Column(name = "department_id")
    private Long departmentId;

    /**
     * groupId
     */
    @Column(name = "group_id")
    private Long groupId;

    /**
     * participantType
     */
    @Column(name = "participant_type")
    private Integer participantType;

}
