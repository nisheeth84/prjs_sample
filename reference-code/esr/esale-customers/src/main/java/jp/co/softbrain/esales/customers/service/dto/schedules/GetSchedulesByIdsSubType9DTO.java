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
public class GetSchedulesByIdsSubType9DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1397924384928051809L;
    /**
     * groupId
     */
    private Long groupId;
    /**
     * groupName
     */
    private String groupName;
    /**
     * photoGroupImg
     */
    private String photoGroupImg;
}
