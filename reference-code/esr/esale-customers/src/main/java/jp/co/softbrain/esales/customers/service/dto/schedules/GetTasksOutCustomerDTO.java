package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksOutCustomerDTO
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksOutCustomerDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7478264431390158801L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;
}
