package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

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
public class GetSchedulesByIdsSubType12DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1395456921260359830L;
    /**
     * equipmentId
     */
    private Long equipmentId;
    /**
     * equipmentName
     */
    private String equipmentName;
    /**
     * startTime
     */
    private Instant startTime;
    /**
     * endTime
     */
    private Instant endTime;
}
