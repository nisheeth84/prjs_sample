package jp.co.softbrain.esales.uaa.domain;

import java.io.Serializable;
import java.time.Instant;

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
 * The UaPasswordResetAuthKey entity.
 */
@Entity
@Table(name = "ua_password_reset_auth_key")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswordResetAuthKey extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 8077152448596988063L;

    /**
     * The UaPasswordResetAuthKey uaPasswordResetAuthKeyId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ua_password_reset_auth_key_sequence_generator")
    @SequenceGenerator(name = "ua_password_reset_auth_key_sequence_generator", allocationSize = 1)
    @Column(name = "ua_password_reset_auth_key_id")
    private Long uaPasswordResetAuthKeyId;

    /**
     * The UaPasswordResetAuthKey employeeId
     */
    @Column(name = "employee_id")
    private Long employeeId;

    /**
     * The UaPasswordResetAuthKey authKeyNumber
     */
    @Column(name = "auth_key_number")
    private String authKeyNumber;

    /**
     * The UaPasswordResetAuthKey authKeyExpirationDate
     */
    @Column(name = "auth_key_expiration_date")
    private Instant authKeyExpirationDate;
}
