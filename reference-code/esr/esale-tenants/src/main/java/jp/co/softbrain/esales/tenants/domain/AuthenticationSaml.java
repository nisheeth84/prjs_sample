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

import jp.co.softbrain.esales.tenants.service.dto.GetAuthenticationSamlResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A AuthenticationSaml.
 * 
 * @author QuangLV
 */
@Entity
@Table(name = "authentication_saml")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@EqualsAndHashCode(callSuper = true)
@SqlResultSetMapping(name = "authenticationSamlMapping", classes = {
        @ConstructorResult(targetClass = GetAuthenticationSamlResponseDTO.class, columns = {
                @ColumnResult(name = "saml_id", type = Long.class), @ColumnResult(name = "is_pc", type = Boolean.class),
                @ColumnResult(name = "is_app", type = Boolean.class),
                @ColumnResult(name = "reference_field_id", type = Long.class),
                @ColumnResult(name = "reference_type", type = Long.class),
                @ColumnResult(name = "reference_value", type = String.class),
                @ColumnResult(name = "issuer", type = String.class),
                @ColumnResult(name = "certificate_path", type = String.class),
                @ColumnResult(name = "certificate_name", type = String.class),
                @ColumnResult(name = "url_login", type = String.class),
                @ColumnResult(name = "ur_logout", type = String.class),
                @ColumnResult(name = "updated_date", type = Instant.class) }) })
public class AuthenticationSaml extends AbstractAuditingEntity implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -2329844872279163660L;

    /**
     * The samlId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "authentication_saml_sequence_generator")
    @SequenceGenerator(name = "authentication_saml_sequence_generator", allocationSize = 1)
    @NotNull
    @Column(name = "saml_id", nullable = false)
    private Long samlId;

    /**
     * The tenantId
     */
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    /**
     * The isPc
     */
    @Column(name = "is_pc")
    private Boolean isPc;

    /**
     * The isApp
     */
    @Column(name = "is_app")
    private Boolean isApp;

    /**
     * The referenceFieldId
     */
    @Column(name = "reference_field_id")
    private Long referenceFieldId;

    /**
     * The referenceType
     */
    @Column(name = "reference_type")
    private Long referenceType;

    /**
     * The referenceValue
     */
    @Column(name = "reference_value")
    private String referenceValue;

    /**
     * The issuer
     */
    @Column(name = "issuer")
    private String issuer;

    /**
     * The certificatePath
     */
    @Column(name = "certificate_path")
    private String certificatePath;

    /**
     * The certificateName
     */
    @Column(name = "certificate_name")
    private String certificateName;

    /**
     * The urlLogin
     */
    @Column(name = "url_login")
    private String urlLogin;

    /**
     * The urLogout
     */
    @Column(name = "ur_logout")
    private String urLogout;

}
