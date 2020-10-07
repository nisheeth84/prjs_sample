package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * RemoveBusinessCardsOutOfNetworkMapOutDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class RemoveBusinessCardsOutOfNetworkMapOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3765471044772707570L;

    /**
     * businessCardCompanyId
     */
    private Long businessCardCompanyId;

    /**
     * departments
     */
    private List<RemoveBusinessCardsOutOfNetworkMapInDTO> departments;

}
