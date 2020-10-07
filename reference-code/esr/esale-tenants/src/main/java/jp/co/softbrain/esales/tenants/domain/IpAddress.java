package jp.co.softbrain.esales.tenants.domain;

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

import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The IpAddress entity.
 *
 * @author QuangLV
 */

@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Table(name = "ip_address")
@Data
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "ipAddressMapping", classes = {
        @ConstructorResult(targetClass = GetIpAddressesResponseDTO.class, columns = {
                @ColumnResult(name = "ip_address_id", type = Long.class),
                @ColumnResult(name = "ip_address", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
public class IpAddress extends AbstractAuditingEntity implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 426228649455696565L;

    /**
     * The IP Address ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ip_address_sequence_generator")
    @SequenceGenerator(name = "ip_address_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "ip_address_id", nullable = false)
    private Long ipAddressId;

    /**
     * The IP Address
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * The tenantId
     */
    @Column(name = "tenant_id")
    private Long tenantId;

}
