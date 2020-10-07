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
 * CustomerListFavourites
 *
 * @author lequyphuc
 */
@Entity
@Table(name = "customers_list_favourites")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerListFavourites extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * customerListFavouriteId
     */
    @Id
    @NotNull
    @Column(name = "customer_list_favourite_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_list_favourites_sequence_generator")
    @SequenceGenerator(name = "customers_list_favourites_sequence_generator", allocationSize = 1)
    private Long customerListFavouriteId;

    /**
     * customerListId
     */
    @NotNull
    @Column(name = "customer_list_id", nullable = false)
    private Long customerListId;

    /**
     * employeeId
     */
    @NotNull
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

}
