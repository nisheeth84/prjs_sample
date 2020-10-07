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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The customers_business entity
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers_business")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersBusiness extends AbstractAuditingEntity implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 4485425327124777589L;

    /**
     * customerBusinessId
     */
    @Id
    @NotNull
    @Column(name = "customer_business_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_business_sequence_generator")
    @SequenceGenerator(name = "customers_business_sequence_generator", allocationSize = 1)
    private Long customerBusinessId;

    /**
     * customerBusinessName
     */
    @NotNull
    @Size(max = 255)
    @Column(name = "customer_business_name", nullable = false, length = 255)
    private String customerBusinessName;

    /**
     * customerBusinessParent
     */
    @Column(name = "customer_business_parent")
    private Long customerBusinessParent;
}
