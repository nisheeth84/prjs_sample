package jp.co.softbrain.esales.tenants.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;

/**
 * A Base DTO
 *
 * @author nguyenvietloi
 */
@Data
@EqualsAndHashCode
public class BaseDTO implements Serializable {

    private static final long serialVersionUID = -4207423971582965755L;

    /**
     * The createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
