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
 * The customers_list_search_conditions entity
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers_list_search_conditions")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListSearchConditions extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 1998706201468847263L;

    /**
     * customerListSearchConditionId
     */
    @Id
    @NotNull
    @Column(name = "customer_list_search_condition_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_list_search_conditions_sequence_generator")
    @SequenceGenerator(name = "customers_list_search_conditions_sequence_generator", allocationSize = 1)
    private Long customerListSearchConditionId;

    /**
     * customerListId
     */
    @NotNull
    @Column(name = "customer_list_id", nullable = false)
    private Long customerListId;

    /**
     * fieldId
     */
    @NotNull
    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    /**
     * searchType
     */
    @Column(name = "search_type")
    private Integer searchType;

    /**
     * searchOption
     */
    @Column(name = "search_option")
    private Integer searchOption;

    /**
     * searchValue
     */
    @Column(name = "search_value")
    private String searchValue;

    /**
     * fieldOrder
     */
    @Column(name = "field_order")
    private Integer fieldOrder;

    /**
     * time_zone_offset
     */
    @Column(name = "time_zone_offset")
    private Integer timeZoneOffset;

}
