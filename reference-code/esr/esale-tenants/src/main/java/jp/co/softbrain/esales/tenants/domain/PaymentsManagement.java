package jp.co.softbrain.esales.tenants.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * The PaymentsManagement entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "payments_management")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class PaymentsManagement extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -2434147952290482271L;

    @Id
    @Column(name = "payment_management_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payments_management_sequence_generator")
    @SequenceGenerator(name = "payments_management_sequence_generator", allocationSize = 1)
    private Long paymentManagementId;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "payment_type", nullable = false)
    private Integer paymentType;

    @Size(max = 6)
    @Column(name = "year_month", nullable = false)
    private String yearMonth;

    @Column(name = "used_number", nullable = false)
    private Integer usedNumber;
}
