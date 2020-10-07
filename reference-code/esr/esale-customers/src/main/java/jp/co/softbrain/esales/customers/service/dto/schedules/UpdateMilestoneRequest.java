package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UpdateMilestoneRequest
 */
@Data
@NoArgsConstructor
public class UpdateMilestoneRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1553080742959574399L;

    private Long milestoneId;
    private String milestoneName;
    private String memo;
    private Instant endDate;
    private Integer isDone;
    private Integer isPublic;
    private Long customerId;
    private Instant updatedDate;

}
