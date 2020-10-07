package jp.co.softbrain.esales.customers.web.rest.vm.request;

import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosSubType2DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * Request for API updateMasterScenarios
 *
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class UpdateMasterScenariosRequest implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -8052070281463180666L;

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
     * The deletedScenarios
     */
    private List<Long> deletedScenarios;

    /**
     * The milestones
     */
    private List<UpdateMasterScenariosSubType2DTO> milestones;
}
