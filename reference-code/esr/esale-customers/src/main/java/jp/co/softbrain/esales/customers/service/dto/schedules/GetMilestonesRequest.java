package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for API getMilestones
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetMilestonesRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1597571545140799858L;
    /**
     * status milestone code
     */
    private Integer statusMilestoneId;
    /**
     * start finish date in plan
     */
    private Instant finishDateFrom;
    /**
     * end finish date in plan
     */
    private Instant finishDateTo;
    /**
     * options order
     */
    private List<OrderBy> orderBy;
    /**
     * list id to get
     */
    private List<Long> milestoneIds;

}
