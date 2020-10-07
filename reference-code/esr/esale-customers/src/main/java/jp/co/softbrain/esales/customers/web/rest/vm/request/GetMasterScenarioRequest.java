package jp.co.softbrain.esales.customers.web.rest.vm.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Request for API getMasterScenario
 *
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetMasterScenarioRequest implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2322707912796801502L;

    /**
     * The scenarioId
     */
    private Long scenarioId;
}
