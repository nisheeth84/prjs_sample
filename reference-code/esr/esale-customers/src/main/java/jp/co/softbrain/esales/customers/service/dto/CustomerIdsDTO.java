package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerIdsDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CustomerIdsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4978992197410243788L;

    /**
     * customerIds
     */
    private List<CustomerIdDTO> customerIds;

}
