package jp.co.softbrain.esales.employees.service.dto.commons;
import java.io.Serializable;

import jp.co.softbrain.esales.employees.service.dto.BaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the API Get Employee SuggestionChoice
 * entity.
 *
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class SuggestionsChoiceDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -4202987608999572326L;

    private Long suggestionsChoiceId;

    private String index;

    private Long employeeId;

    private Long idResult;
}
