package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Out DTO sub type class for API initializeEditMode
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class InitializeEditModeOutSubTypeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4003664319080747723L;

    /**
     * customerBusinessId
     */
    private Long customerBusinessId;

    /**
     * customerBusinessName
     */
    private String customerBusinessName;

    /**
     * customerBusinessParent
     */
    private Long customerBusinessParent;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
