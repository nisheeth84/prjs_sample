package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UpdateMasterScenariosSubType2DTO for Api updateMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class UpdateMasterScenariosSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1151122827608029654L;

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
