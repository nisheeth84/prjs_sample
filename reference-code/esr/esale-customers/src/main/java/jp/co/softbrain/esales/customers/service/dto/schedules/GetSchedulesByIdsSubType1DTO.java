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
public class GetSchedulesByIdsSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2089840562331253194L;
    /**
     * scheduleTypeId
     */
    private Long scheduleTypeId;
    /**
     * scheduleTypeName
     */
    private String scheduleTypeName;
}
