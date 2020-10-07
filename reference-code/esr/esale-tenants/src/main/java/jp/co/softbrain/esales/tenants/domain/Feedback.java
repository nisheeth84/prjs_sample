package jp.co.softbrain.esales.tenants.domain;

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

/**
 * Feedback
 *
 * @author DatDV
 *
 */
@Entity
@Table(name = "feedback")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper = true)
public class Feedback extends AbstractAuditingEntity implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3149433389826091462L;

	/**
	 * feedbackId
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedback_sequence_generator")
	@SequenceGenerator(name = "feedback_sequence_generator", allocationSize = 1)
	@NotNull
	@Column(name = "feedback_id", nullable = false)
	private Long feedbackId;

	/**
	 * tenantName
	 */
	@Column(name = "tenant_name")
	private String tenantName;

	/**
	 * companyName
	 */
	@Column(name = "company_name")
	private String companyName;

	/**
	 * employeeId
	 */
	@Column(name = "employee_id")
	private Long employeeId;

	/**
	 * feedbackType
	 */
	@Column(name = "feedback_type")
	private String feedbackType;

	/**
	 * feedbackContent
	 */
	@Column(name = "feedback_content")
	private String feedbackContent;

	/**
	 * displayType
	 */
	@Column(name = "display_type")
	private String displayType;

	/**
	 * terminalType
	 */
	@Column(name = "terminal_type")
	private String terminalType;

	/**
	 * content
	 */
	@Column(name = "content")
	private String content;
}
