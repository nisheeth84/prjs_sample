package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.MastersScenarios;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MastersScenarios}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersScenariosDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -4336315674007590207L;

    /**
     * scenarioId
     */
    private Long scenarioId;

    /**
     * scenarioName
     */
    private String scenarioName;
}
