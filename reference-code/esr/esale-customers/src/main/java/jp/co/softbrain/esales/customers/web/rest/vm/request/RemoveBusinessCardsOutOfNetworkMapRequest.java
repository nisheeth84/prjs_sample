package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapInDTO;
import lombok.Data;

/**
 * RemoveBusinessCardsOutOfNetworkMapRequest
 */
@Data
public class RemoveBusinessCardsOutOfNetworkMapRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6939147467103571902L;

    private Long businessCardCompanyId;
    private List<RemoveBusinessCardsOutOfNetworkMapInDTO> departments;

}
