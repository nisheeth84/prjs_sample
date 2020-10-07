package jp.co.softbrain.esales.uaa.domain;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The EmpAuthority entity.
 */
@Entity
@Table(name = "emp_authority")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode
public class EmpAuthority implements Serializable {

    private static final long serialVersionUID = -3935690902087082696L;

    /**
     * The UaPasswords uaPasswordId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emp_authority_sequence_generator")
    @SequenceGenerator(name = "emp_authority_sequence_generator", allocationSize = 1)
    @Column(name = "emp_authority_id")
    private Long empAuthorityId;

    /**
     * The EmpAuthority employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The EmpAuthority authorityName
     */
    @Column(name = "authority_name")
    private String authorityName;
}
