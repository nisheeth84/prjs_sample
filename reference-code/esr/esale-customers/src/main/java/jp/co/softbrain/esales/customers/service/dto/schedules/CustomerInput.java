package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CustomerIdsInput
 *
 * @author ChinhDX
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInput implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3257085166687777296L;
    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerId
     */
    private String customerName;
}
