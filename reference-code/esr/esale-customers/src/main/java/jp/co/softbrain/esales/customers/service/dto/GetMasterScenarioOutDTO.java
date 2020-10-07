package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO output for API getMasterScenarios
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetMasterScenarioOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6298544885883346549L;

    /**
     * scenarioName
     */
    private String scenarioName;
    
    /**
     * list milestones
     */
    private List<GetMasterScenarioSubType1DTO> milestones;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
