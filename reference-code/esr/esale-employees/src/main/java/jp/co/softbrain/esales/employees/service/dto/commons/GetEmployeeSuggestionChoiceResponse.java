/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Reponse for API getEmployeeSuggestionChoice
 * 
 * @author phamminhphu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeSuggestionChoiceResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6900352668522715928L;

    private List<SuggestionsChoiceDTO> employeeSuggestionsChoice;
}
