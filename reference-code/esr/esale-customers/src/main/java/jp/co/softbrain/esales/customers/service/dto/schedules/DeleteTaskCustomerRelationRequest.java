package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DeleteTaskCustomerRelationRequest
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class DeleteTaskCustomerRelationRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 135235235235L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

}
