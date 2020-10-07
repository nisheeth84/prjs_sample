/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn1DTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Save Scenario Request
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveScenarioRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6472856334631241562L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * scenarioId
     */
    private Long scenarioId;

    /**
     * scenarioName
     */
    private String scenarioName;

    /**
     * milestones
     */
    private List<SaveScenarioSubIn1DTO> milestones;
}
