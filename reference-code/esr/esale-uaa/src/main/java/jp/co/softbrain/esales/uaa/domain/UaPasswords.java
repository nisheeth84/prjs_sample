package jp.co.softbrain.esales.uaa.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The UaPasswords entity.
 */
@Entity
@Table(name = "ua_passwords")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswords extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -7866247501010008997L;

    /**
     * The UaPasswords uaPasswordId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ua_passwords_sequence_generator")
    @SequenceGenerator(name = "ua_passwords_sequence_generator", allocationSize = 1)
    @Column(name = "ua_password_id")
    private Long uaPasswordId;

    /**
     * The UaPasswords employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The UaPasswords password
     */
    @Column(name = "password")
    private String password;

    /**
     * The UaPasswords passwordValidDate
     */
    @Column(name = "password_valid_date")
    private LocalDate passwordValidDate;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "emp_authority",
        joinColumns = {@JoinColumn(name = "employee_id", referencedColumnName = "employee_id")},
        inverseJoinColumns = {@JoinColumn(name = "authority_name", referencedColumnName = "name")})
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @BatchSize(size = 20)
    private Set<Authority> authorities = new HashSet<>();
}
