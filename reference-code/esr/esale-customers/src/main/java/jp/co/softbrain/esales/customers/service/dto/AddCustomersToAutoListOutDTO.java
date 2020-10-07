package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * AddCustomersToAutoListOutDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class AddCustomersToAutoListOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 352541415364634223L;

    /**
     * customerListId
     */
    private Long customerListId;

    private List<Long> customerIds;

}
