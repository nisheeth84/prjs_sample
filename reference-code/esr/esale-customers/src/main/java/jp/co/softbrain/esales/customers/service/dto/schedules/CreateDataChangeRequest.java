package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateDataChangeResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CreateDataChangeRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7373157825310180480L;

    /**
     * parameterConditions
     */
    private List<CreateDataChangeElasticSearchInDTO> parameterConditions;
}
