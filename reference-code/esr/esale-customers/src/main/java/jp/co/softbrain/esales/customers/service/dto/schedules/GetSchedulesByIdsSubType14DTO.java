package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author trungbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType14DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5333406088401096216L;
    /**
     * taskId
     */
    private Long taskId;
    /**
     * taskName
     */
    private String taskName;
}
