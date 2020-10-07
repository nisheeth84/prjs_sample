package jp.co.softbrain.esales.uaa.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

/**
 * A AuthenticationSaml.
 */
@Entity
@Table(name = "authentication_saml")
@Data
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@EqualsAndHashCode(callSuper=true)
public class AuthenticationSaml extends AbstractAuditingEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
	@SequenceGenerator(name = "sequenceGenerator")
	@NotNull
	@Column(name = "saml_id", nullable = false)
	private Long samlId;

	@Column(name = "is_pc")
	private Boolean isPc;

	@Column(name = "is_app")
	private Boolean isApp;

	@Column(name = "reference_field_id")
//    @Type(type = "org.hibernate.type.NumericBooleanType")
	private Long referenceFieldId;

	@Column(name = "reference_type")
	private Long referenceType;

	@Column(name = "reference_value")
	private String referenceValue;

	@Column(name = "issuer")
	private String issuer;

	@Column(name = "certificate_path")
	private String certificatePath;

	@Column(name = "certificate_name")
	private String certificateName;

	@Column(name = "url_login")
	private String urlLogin;

	@Column(name = "ur_logout")
	private String urLogout;

}
