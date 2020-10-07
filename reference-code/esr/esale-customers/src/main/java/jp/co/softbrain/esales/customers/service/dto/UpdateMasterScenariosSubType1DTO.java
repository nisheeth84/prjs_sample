package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UpdateMasterScenariosSubType1DTO for Api updateMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class UpdateMasterScenariosSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8511122827608029654L;

    /**
     * The scenarioId
     */
    private Long scenarioId;

    /**
     * The scenarioName
     */
    private String scenarioName;

    /**
     * The updateDate
     */
    private Instant updatedDate;

    /**
     * deletedMilestones List Id deleted
     */
    private List<Long> deletedMilestones;

    /**
     * milestones List Data scenario_detail
     */
    private List<UpdateMasterScenariosSubType2DTO> milestones;
}
