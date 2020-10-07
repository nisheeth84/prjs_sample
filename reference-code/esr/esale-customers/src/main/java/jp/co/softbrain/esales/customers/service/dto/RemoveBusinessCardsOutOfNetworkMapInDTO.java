package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * RemoveBusinessCardsOutOfNetworkMapInDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class RemoveBusinessCardsOutOfNetworkMapInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8421119963283517323L;

    /**
     * businessCardDepartmentId
     */
    private Long businessCardDepartmentId;

    /**
     * businessCardIds
     */
    private List<Long> businessCardIds;

}
