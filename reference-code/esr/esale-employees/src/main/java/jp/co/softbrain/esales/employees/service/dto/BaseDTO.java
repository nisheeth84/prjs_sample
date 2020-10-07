package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A Base DTO
 */
@Data
@EqualsAndHashCode
public class BaseDTO implements Serializable {

    private static final long serialVersionUID = -4207423971582965755L;

    /**
     * The createdDate
     */
    private Instant createdDate = Instant.now();

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate = Instant.now();

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
