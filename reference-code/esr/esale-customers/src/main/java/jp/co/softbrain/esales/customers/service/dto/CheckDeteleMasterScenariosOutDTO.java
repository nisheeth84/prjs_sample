package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MasterScenarios}
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode
public class CheckDeteleMasterScenariosOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2789653731464151888L;

    /**
     * scenarios
     */
    private List<Long> scenarios;

}
