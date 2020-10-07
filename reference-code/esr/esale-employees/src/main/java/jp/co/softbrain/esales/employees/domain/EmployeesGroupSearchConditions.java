package jp.co.softbrain.esales.employees.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A EmployeesGroupSearchConditions.
 */
@Entity
@Table(name = "employees_group_search_conditions")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesGroupSearchConditions extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -6793730825695813244L;

    /**
     * The EmployeesGroupSearchConditions searchContentId
     */
    @Id

    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_group_search_conditions_sequence_generator")
    @SequenceGenerator(name = "employees_group_search_conditions_sequence_generator", allocationSize = 1)

    @NotNull
    @Column(name = "search_content_id", nullable = false, unique = true)
    private Long searchContentId;

    /**
     * The EmployeesGroupSearchConditions groupId
     */
    @NotNull
    @Column(name = "group_id", nullable = false)
    private Long groupId;

    /**
     * The EmployeesGroupSearchConditions fieldId
     */
    @NotNull
    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    /**
     * The EmployeesGroupSearchConditions searchType
     */
    @Column(name = "search_type")
    private Integer searchType;

    /**
     * The EmployeesGroupSearchConditions fieldOrder
     */
    @Column(name = "field_order")
    private Integer fieldOrder;

    /**
     * The EmployeesGroupSearchConditions searchOption
     */
    @Column(name = "search_option")
    private Integer searchOption;

    /**
     * The EmployeesGroupSearchConditions searchValue
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "search_value")
    private String searchValue;

    /**
     * The EmployeesGroupSearchConditions fieldOrder
     */
    @Column(name = "time_zone_offset")
    private Integer timeZoneOffset;
}
