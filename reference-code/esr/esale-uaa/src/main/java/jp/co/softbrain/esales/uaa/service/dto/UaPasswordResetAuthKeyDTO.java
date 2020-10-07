package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.UaPasswordResetAuthKey} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswordResetAuthKeyDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 2936470054552800084L;

    /**
     * The UaPasswordResetAuthKey uaPasswordResetAuthKeyId
     */
    private Long uaPasswordResetAuthKeyId;

    /**
     * The UaPasswordResetAuthKey employeeId
     */
    private Long employeeId;

    /**
     * The UaPasswordResetAuthKey authKeyNumber
     */
    private String authKeyNumber;

    /**
     * The UaPasswordResetAuthKey authKeyExpirationDate
     */
    private Instant authKeyExpirationDate;
}
