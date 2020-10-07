package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UpdateTaskCustomerRelationRequest
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class UpdateTaskCustomerRelationRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4675812338737036664L;

    private List<Long> customerIds;
    private Long customerIdUpdate;
    private String customerNameUpdate;
    private Long userId;

}
