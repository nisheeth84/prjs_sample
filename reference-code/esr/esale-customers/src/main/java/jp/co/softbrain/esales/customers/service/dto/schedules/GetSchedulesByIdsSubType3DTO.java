package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author truingbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType3DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3125860087209096872L;
    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerName
     */
    private String customerName;
}
