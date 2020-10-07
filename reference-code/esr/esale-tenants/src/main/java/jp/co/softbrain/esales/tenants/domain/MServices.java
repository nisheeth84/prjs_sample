package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.MServiceDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * The MServices entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "m_services")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "MicroServicesMapping", classes = {
    @ConstructorResult(targetClass = MServiceDTO.class, columns = {
        @ColumnResult(name = "m_service_id", type = Long.class),
        @ColumnResult(name = "micro_service_name")
    })
})

@SqlResultSetMapping(name = "GetMasterServicesMapping", classes = {
        @ConstructorResult(targetClass = GetMasterServicesDataDTO.class, columns = {
            @ColumnResult(name = "serviceId", type = Long.class),
            @ColumnResult(name = "serviceName", type = String.class),
            @ColumnResult(name = "microServiceName", type = String.class),
            @ColumnResult(name = "isActive", type = Boolean.class)
        })
    })

public class MServices extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -7866606924484080666L;

    @Id
    @Column(name = "m_service_id", nullable = false)
    private Long mServiceId;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "micro_service_name", nullable = false)
    private String microServiceName;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
