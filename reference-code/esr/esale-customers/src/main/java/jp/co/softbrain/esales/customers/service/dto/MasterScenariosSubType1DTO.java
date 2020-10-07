package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * MasterScenariosSubType1DTO dto for GetMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class MasterScenariosSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1234531331123336550L;
    /**
     * The scenarioId
     */
    private Long scenarioId;

    /**
     * The scenarioName
     */
    private String scenarioName;
    /**
     * The updatedDate
     */
    private Instant updatedDate;
    /**
     * milestones list MasterScenariosSubType2DTO
     */
    private List<MasterScenariosSubType2DTO> milestones;
}
