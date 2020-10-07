package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CountTaskByCustomerIdsResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CountTaskByCustomerIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1626346234346346L;

    private List<CountTaskByCustomerIdsOutDTO> tasks;

}
