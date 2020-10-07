package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.commons.service.dto.GetResultServiceOrderDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * MenuServiceOrder.
 */
@Entity
@Table(name = "menu_service_order")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "getResultServiceOrder", classes = {
    @ConstructorResult(targetClass = GetResultServiceOrderDTO.class, columns = {
        @ColumnResult(name = "employee_id", type = Long.class),
        @ColumnResult(name = "service_id", type = Long.class),
        @ColumnResult(name = "service_name", type = String.class),
        @ColumnResult(name = "service_order", type = Integer.class),
        @ColumnResult(name = "updated_date", type = Instant.class),
 }) })
public class MenuServiceOrder extends AbstractAuditingEntity implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4235879126702363539L;

    @Id
    @Column(name = "menu_service_order_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "menu_service_order_sequence_generator")
    @SequenceGenerator(name = "menu_service_order_sequence_generator", allocationSize = 1)
    private Long menuServiceOrderId;

    @NotNull
    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @NotNull
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "service_order")
    private Integer serviceOrder;
}
