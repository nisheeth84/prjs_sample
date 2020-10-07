package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;

/**
 * MasterScenariosSubType2DTO dto for GetMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class MasterScenariosSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2234531331123336550L;
    /**
     * The scenarioDetailId
     */
    private Long scenarioDetailId;

    /**
     * The milestoneName
     */
    private String milestoneName;

    /**
     * The order
     */
    private Integer displayOrder;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
