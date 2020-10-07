package jp.co.softbrain.esales.tenants.domain;

import jp.co.softbrain.esales.tenants.service.dto.GetUsedStorageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

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
import java.io.Serializable;

/**
 * The StoragesManagement entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "storages_management")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "DatabaseStorageMapping", classes = {
    @ConstructorResult(targetClass = GetUsedStorageDTO.class, columns = {
        @ColumnResult(name = "micro_service_name", type = String.class),
        @ColumnResult(name = "used_storage_s3", type = Long.class),
        @ColumnResult(name = "used_storage_elasticsearch", type = Long.class),
        @ColumnResult(name = "used_storage_database", type = Long.class)
    })
})

public class StoragesManagement extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -8286289660320480207L;

    @Id
    @Column(name = "storage_management_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "storages_management_sequence_generator")
    @SequenceGenerator(name = "storages_management_sequence_generator", allocationSize = 1)
    private Long storageManagementId;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "micro_service_name", nullable = false)
    private String microServiceName;

    @Column(name = "used_storage_s3")
    private Long usedStorageS3;

    @Column(name = "used_storage_elasticsearch")
    private Long usedStorageElasticsearch;

    @Column(name = "used_storage_database")
    private Long usedStorageDatabase;
}
