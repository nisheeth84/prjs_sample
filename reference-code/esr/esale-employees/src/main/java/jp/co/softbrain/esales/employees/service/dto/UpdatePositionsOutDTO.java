package jp.co.softbrain.esales.employees.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * The DTO for API UpdatePositions
 *
 * @author QuangLV
 */

@Data
@EqualsAndHashCode
public class UpdatePositionsOutDTO implements Serializable {
    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2331483562300178942L;

    /**
     * List deletedPositions
     */
    private List<Long> deletedPositions;

    /**
     * List insertedPositions
     */

    private List<Long> insertedPositions;

    /**
     * List updatedPositions
     */

    private List<Long> updatedPositions;
}
