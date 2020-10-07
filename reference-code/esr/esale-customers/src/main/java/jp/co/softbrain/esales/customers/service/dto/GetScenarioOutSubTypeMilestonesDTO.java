package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO sub type for API getScenario - milestones
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutSubTypeMilestonesDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1284718404663626236L;

    /**
     * milestoneId
     */
    private Long milestoneId;

    /**
     * milestoneName
     */
    private String milestoneName;

    /**
     * statusMilestoneId
     */
    private Integer statusMilestoneId;

    /**
     * finishDate
     */
    private Instant finishDate;

    /**
     * memo
     */
    private String memo;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    private List<Long> taskIds;
    /**
     * tasks
     */
    private List<GetScenarioOutSubTypeTasksDTO> tasks = new ArrayList<>();

}
