package jp.co.softbrain.esales.customers.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;

/**
 * MasterScenariosSubType1DTO dto for GetMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
public class GetMasterScenariosResponseDTO implements Serializable {
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
     * The scenarioDetailId
     */
    private Long scenarioDetailId;

    /**
     * The milestoneName
     */
    private String milestoneName;

    /**
     * The updatedDateDetail
     */
    private Instant updatedDateDetail;
}
