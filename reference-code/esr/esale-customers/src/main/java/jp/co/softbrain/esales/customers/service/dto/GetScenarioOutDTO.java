package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO for API getScenario
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6561412737754701676L;

    /**
     * scenarios
     */
    private GetScenarioOutSubTypeDTO scenarios;
}
