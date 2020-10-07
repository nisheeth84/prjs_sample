package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CreateMilestoneRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8198991792231137924L;

    /**
     * milestoneName
     */
    private String milestoneName;
    /**
     * memo
     */
    private String memo;
    /**
     * endDate
     */
    private Instant endDate;
    /**
     * isDone
     */
    private Integer isDone;
    /**
     * isPublic
     */
    private Integer isPublic;

    /**
     * customerId
     */
    private Long customerId;
}
