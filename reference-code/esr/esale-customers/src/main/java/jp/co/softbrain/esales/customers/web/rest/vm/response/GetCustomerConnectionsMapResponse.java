package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.customers.domain.MastersStands}
 * entity.
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
public class GetCustomerConnectionsMapResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4107723971582965715L;
    /**
     * masterMotivations
     */
    private List<MastersMotivationsDTO> masterMotivations;
    /**
     * mastersStands
     */
    private List<MastersStandsDTO> mastersStands;
}
