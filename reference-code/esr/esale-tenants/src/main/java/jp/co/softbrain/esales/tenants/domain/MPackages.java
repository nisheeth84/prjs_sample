package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;
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
import java.time.Instant;

/**
 * The MPackages entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "m_packages")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "PackagesMapping", classes = {
    @ConstructorResult(targetClass = PackagesDTO.class, columns = {
        @ColumnResult(name = "m_package_id", type = Long.class),
        @ColumnResult(name = "package_name", type = String.class)
    })
})

@SqlResultSetMapping(name = "GetMasterPackagesMapping", classes = {
        @ConstructorResult(targetClass = GetMasterPackagesDataDTO.class, columns = {
            @ColumnResult(name = "packageId", type = Long.class),
            @ColumnResult(name = "packageName", type = String.class),
            @ColumnResult(name = "type", type = Integer.class),
            @ColumnResult(name = "expirationDate", type = String.class)
        })
    })

public class MPackages extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -7866606924484080567L;

    @Id
    @Column(name = "m_package_id", nullable = false)
    private Long mPackageId;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "type", nullable = false)
    private Integer type;

    @Column(name = "expiration_date")
    private Instant expirationDate;
}
