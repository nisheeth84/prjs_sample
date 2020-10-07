package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for the entity
 * {@link jp.co.softbrain.esales.customers.domain.MastersScenarios}
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
@AllArgsConstructor
@NoArgsConstructor
public class DeleteMasterScenarioRequest implements Serializable {
    /**
     * /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2789357734464151888L;

    /**
     * scenarioId
     */
    private Long scenarioId;
}
