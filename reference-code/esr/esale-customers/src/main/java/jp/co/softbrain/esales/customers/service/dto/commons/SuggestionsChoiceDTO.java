package jp.co.softbrain.esales.customers.service.dto.commons;
import java.io.Serializable;

import jp.co.softbrain.esales.customers.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.SuggestionsChoice}
 * entity.
 *
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SuggestionsChoiceDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -4202987608999572326L;

    private Long suggestionsChoiceId;

    private String index;

    private Long employeeId;

    private Long idResult;
}
