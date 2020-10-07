package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author TinhBV
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType4DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 3571784387030277062L;
    /**
     * productTradingId
     */
    private Long productTradingId;
    /**
     * producTradingName
     */
    private String producTradingName;
}
