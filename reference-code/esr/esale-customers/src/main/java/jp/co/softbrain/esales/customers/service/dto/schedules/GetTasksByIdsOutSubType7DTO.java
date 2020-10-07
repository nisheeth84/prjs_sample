package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType7DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType7DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1465634256234563214L;
    /**
     * productTradingId
     */
    private Long productTradingId;
    /**
     * productId
     */
    private Long productId;
    /**
     * productName
     */
    private String productName;

}
