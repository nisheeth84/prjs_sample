package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * MilestonesOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class GetMilestoneListOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3421047041149187264L;

    /**
     * The list Milestones
     */
    private List<GetMilestoneListOutSubTypeDTO> milestones;

    /**
     * The count milestone
     */
    private Integer countMilestone;

}
