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
public class GetSchedulesByIdsSubType5DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -993138386573811958L;
    /**
     * productTradingId
     */
    private Long businessCardId;
    /**
     * businessCardName
     */
    private String businessCardName;
}
