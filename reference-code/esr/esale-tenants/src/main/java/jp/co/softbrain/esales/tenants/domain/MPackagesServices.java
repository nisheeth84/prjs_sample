package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.GetPackagesServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;
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
 * The MPackagesServices entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "m_packages_services")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "PackagesTenantMapping", classes = {
    @ConstructorResult(targetClass = PackagesTenantDTO.class, columns = {
        @ColumnResult(name = "m_package_id", type = Long.class),
        @ColumnResult(name = "child_id", type = Long.class)
    })
})

@SqlResultSetMapping(name = "ServicesPackagesMapping", classes = {
    @ConstructorResult(targetClass = ServicesPackagesDTO.class, columns = {
        @ColumnResult(name = "m_package_id", type = Long.class),
        @ColumnResult(name = "package_name", type = String.class),
        @ColumnResult(name = "child_id", type = Long.class),
        @ColumnResult(name = "m_service_id", type = Long.class),
        @ColumnResult(name = "service_name", type = String.class),
        @ColumnResult(name = "micro_service_name", type = String.class)
    })
})

@SqlResultSetMapping(name = "GetPackagesServicesMapping", classes = {
        @ConstructorResult(targetClass = GetPackagesServicesDataDTO.class, columns = {
            @ColumnResult(name = "packageServiceId", type = Long.class),
            @ColumnResult(name = "packageId", type = Long.class),
            @ColumnResult(name = "serviceId", type = Long.class),
            @ColumnResult(name = "childId", type = Long.class),
            @ColumnResult(name = "isActive", type = Boolean.class)
        })
    })

public class MPackagesServices extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -7866606924484080567L;

    @Id
    @Column(name = "m_package_service_id", nullable = false)
    private Long mPackageServiceId;

    @Column(name = "m_package_id", nullable = false)
    private Long mPackageId;

    @Column(name = "m_service_id")
    private Long mServiceId;

    @Column(name = "child_id")
    private Long childId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
