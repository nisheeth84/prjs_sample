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
public class GetSchedulesByIdsSubType15DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2530332717351893594L;
    /**
     * milestonesId
     */
    private Long milestonesId;
    /**
     * milestoneName
     */
    private String milestoneName;
}
