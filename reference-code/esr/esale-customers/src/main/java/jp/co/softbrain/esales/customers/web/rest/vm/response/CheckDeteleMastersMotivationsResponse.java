package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MastersMotivations}
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
public class CheckDeteleMastersMotivationsResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2789353731464151888L;

    /**
     * masterMotivationIds
     */
    private List<Long> masterMotivationIds;

}
