package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO sub input for API changeScenario
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class ChangeScenarioSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4662861463992384024L;

    /**
     * ID milestone before change
     */
    private Long milestoneId;

    /**
     * The task ID array, the previous subTask have changed
     */
    private List<Long> taskId;

}
