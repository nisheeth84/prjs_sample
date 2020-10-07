package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.UserStatus} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class UserStatusDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2919551674330155253L;

    private Long id;

    private Long userId;

    private Integer status;

    private Instant lastActivityTime;
}
