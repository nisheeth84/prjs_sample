package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CountTaskByCustomerIdsRequest
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CountTaskByCustomerIdsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1626346346346L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

}
