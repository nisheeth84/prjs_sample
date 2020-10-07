package jp.co.softbrain.esales.customers.domain;

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
 * CustomersHistories
 * 
 * @author nguyenvanchien3
 */
@Entity
@Table(name = "customers_histories")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersHistories  extends AbstractAuditingEntity implements Serializable {
    
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -7785270472154006190L;

    /**
     * customerHistoryId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_histories_sequence_generator")
    @SequenceGenerator(name = "customers_histories_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "customer_history_id", nullable = false, unique = true)
    private Long customerHistoryId;

    /**
     * customerId
     */
    @NotNull
    @Column(name = "customer_id")
    private Long customerId;

    /**
     * contentChange
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content_change", columnDefinition = "jsonb")
    private String contentChange;

    /**
     * mergedCustomerId format: { "customer_id" : [1, 2, 3, 4] }
     */
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "merged_customer_id", columnDefinition = "jsonb")
    private String mergedCustomerId;

    /**
     * customerName
     */
    @Column(name = "customer_name")
    private String customerName;
}
