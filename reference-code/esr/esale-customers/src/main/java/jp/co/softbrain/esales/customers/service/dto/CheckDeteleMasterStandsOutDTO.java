package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity
 * {@link jp.co.softbrain.esales.customers.domain.MastersStands}
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
public class CheckDeteleMasterStandsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 789086605965523254L;

    /**
     * masterStandIds
     */
    private List<Long> masterStandIds;
}
