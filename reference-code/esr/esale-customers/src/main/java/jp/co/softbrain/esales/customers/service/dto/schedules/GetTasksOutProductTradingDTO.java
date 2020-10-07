package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksOutProductTradingDTO
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksOutProductTradingDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 5552776406464074766L;

    /**
     * The productTradingId
     */
    private Long productTradingId;

    /**
     * The productName
     */
    private String productName;

    /**
     * productId
     */
    private Long productId;
}
