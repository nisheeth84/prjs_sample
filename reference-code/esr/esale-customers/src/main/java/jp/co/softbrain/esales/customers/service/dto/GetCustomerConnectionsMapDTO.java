package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * A DTO for the {@link jp.co.softbrain.esales.customers.domain.MastersStands} entity.
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
public class GetCustomerConnectionsMapDTO implements Serializable {
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
