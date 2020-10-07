package jp.co.softbrain.esales.customers.web.rest.vm.request;

import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioSubTypeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * DTO class for the entity {@link MastersMotivations}
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateMasterScenarioRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2789313731464151888L;

    /**
     * scenarioName
     */
    private String scenarioName;

    /**
     * List milestones
     */
    private List<CreateMasterScenarioSubTypeDTO> milestones;

}
