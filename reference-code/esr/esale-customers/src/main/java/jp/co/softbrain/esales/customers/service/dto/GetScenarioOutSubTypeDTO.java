package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO sub type for API getScenario
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutSubTypeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1001642979237412792L;

    /**
     * milestones
     */
    private List<GetScenarioOutSubTypeMilestonesDTO> milestones = new ArrayList<>();

}
