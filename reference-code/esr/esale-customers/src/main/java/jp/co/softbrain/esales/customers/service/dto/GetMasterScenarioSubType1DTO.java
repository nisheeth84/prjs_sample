package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of milestones for API GetMasterScenario
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetMasterScenarioSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3693865040199784496L;

    /**
     * milestoneName
     */
    private String milestoneName;

}
