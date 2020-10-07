/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for API saveScenario
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveScenarioResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8361123825516321191L;

    /**
     * scenarioId
     */
    private Long scenarioId;
}
