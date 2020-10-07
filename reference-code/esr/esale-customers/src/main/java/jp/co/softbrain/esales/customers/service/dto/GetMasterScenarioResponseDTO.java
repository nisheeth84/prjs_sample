package jp.co.softbrain.esales.customers.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * The dto for GetMasterScenario
 *
 * @author quanglv
 */
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetMasterScenarioResponseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -2718708886707773943L;

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
     * The order
     */
    private Integer displayOrder;

    /**
     * The updatedDateDetail
     */
    private Instant updatedDateDetail;
}
