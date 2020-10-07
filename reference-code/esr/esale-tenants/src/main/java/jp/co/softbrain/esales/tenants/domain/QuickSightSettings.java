package jp.co.softbrain.esales.tenants.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The QuickSightSettings entity.
 *
 * @author nguyenvietloi
 */
@Entity
@Table(name = "quicksight_settings")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class QuickSightSettings extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = -2434147952290484472L;

    @Id
    @Column(name = "quicksight_settings_id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "quicksight_settings_sequence_generator")
    @SequenceGenerator(name = "quicksight_settings_sequence_generator", allocationSize = 1)
    private Long quicksightSettingsId;

    @Column(name = "tenant_id", nullable = false, unique = true)
    private Long tenantId;

    @Column(name = "postgresql_account", nullable = false)
    private String postgresqlAccount;

    @Column(name = "postgresql_password", nullable = false)
    private String postgresqlPassword;

    @Column(name = "namespace", nullable = false)
    private String namespace;

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @Column(name = "group_arn", nullable = false)
    private String groupArn;

    @Column(name = "datasource_arn", nullable = false)
    private String datasourceArn;
}
