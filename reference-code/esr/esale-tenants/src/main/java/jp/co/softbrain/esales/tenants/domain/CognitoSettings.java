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
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The CognitoSettings entity.
 */
@Entity
@Table(name = "cognito_settings")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name = "CognitoSettingInfoMapping", classes = {
        @ConstructorResult(targetClass = CognitoSettingInfoDTO.class, columns = {
                @ColumnResult(name = "user_pool_id", type = String.class),
                @ColumnResult(name = "client_id", type = String.class),
                @ColumnResult(name = "tenant_name", type = String.class),
                @ColumnResult(name = "is_pc", type = Boolean.class),
                @ColumnResult(name = "is_app", type = Boolean.class),
                @ColumnResult(name = "provider_name", type = String.class),
                @ColumnResult(name = "reference_value", type = String.class),
                @ColumnResult(name = "meta_data_path", type = String.class),
                @ColumnResult(name = "meta_data_name", type = String.class),
                @ColumnResult(name = "cognito_settings_id", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})
@SqlResultSetMapping(name = "CognitoSettingWithoutTenantMapping", classes = {
        @ConstructorResult(targetClass = CognitoSettingInfoDTO.class, columns = {
                @ColumnResult(name = "user_pool_id", type = String.class),
                @ColumnResult(name = "client_id", type = String.class),
                @ColumnResult(name = "is_pc", type = Boolean.class),
                @ColumnResult(name = "is_app", type = Boolean.class),
                @ColumnResult(name = "provider_name", type = String.class),
                @ColumnResult(name = "reference_value", type = String.class),
                @ColumnResult(name = "meta_data_path", type = String.class),
                @ColumnResult(name = "meta_data_name", type = String.class),
                @ColumnResult(name = "cognito_settings_id", type = Long.class),
                @ColumnResult(name = "updated_date", type = Instant.class)
        })
})

public class CognitoSettings extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = -1944742864016129116L;

    /**
     * The CognitoSettings cognito_settings_id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cognito_settings_sequence_generator")
    @SequenceGenerator(name = "cognito_settings_sequence_generator", allocationSize = 1)
    @Column(name = "cognito_settings_id", nullable = false, unique = true)
    private Long cognitoSettingsId;

    /**
     * The CognitoSettings tenant_id
     */
    @NotNull
    @Column(name = "tenant_id", unique = true)
    private Long tenantId;

    /**
     * The CognitoSettings client_id
     */
    @NotNull
    @Size(max = 30)
    @Column(name = "client_id")
    private String clientId;

    /**
     * The CognitoSettings user_pool_id
     */
    @NotNull
    @Size(max = 30)
    @Column(name = "user_pool_id")
    private String userPoolId;

    /**
     * Is PC
     */
    @Column(name = "is_pc")
    private Boolean isPc;

    /**
     * Is App
     */
    @Column(name = "is_app")
    private Boolean isApp;

    /**
     * Name of Provider
     */
    @Size(max = 50)
    @Column(name = "provider_name")
    private String providerName;

    /**
     * Reference Value
     */
    @Size(max = 255)
    @Column(name = "reference_value")
    private String referenceValue;

    /**
     * Meta data path
     */
    @Size(max = 255)
    @Column(name = "meta_data_path")
    private String metaDataPath;

    /**
     * Meta data name
     */
    @Size(max = 255)
    @Column(name = "meta_data_name")
    private String metaDataName;
}
