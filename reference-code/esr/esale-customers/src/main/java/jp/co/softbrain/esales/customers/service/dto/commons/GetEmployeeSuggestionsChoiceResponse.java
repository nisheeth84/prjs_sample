package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API getSuggestionsChoice
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeSuggestionsChoiceResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6608504586470075929L;

    /**
     * list employee suggestions choice
     */
    private List<SuggestionsChoiceDTO> employeeSuggestionsChoice;

}
