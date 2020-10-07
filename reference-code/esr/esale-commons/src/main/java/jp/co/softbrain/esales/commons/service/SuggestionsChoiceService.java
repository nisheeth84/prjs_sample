package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.SaveSuggestionsChoiceOutDTO;
import jp.co.softbrain.esales.commons.service.dto.SuggestionsChoiceDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.SuggestionsChoice}.
 */

@XRayEnabled
public interface SuggestionsChoiceService {

    /**
     * Get info of Employee Suggestions Choice
     * 
     * @param index Array index to mark the search function
     * @param employeeId Id of employee
     * @param limit The number of records to retrieve
     * @return the DTO response
     */
    List<SuggestionsChoiceDTO> getEmployeeSuggestionsChoice(List<String> index, Long employeeId, Integer limit);

    /**
     * Save suggestions Choice
     * 
     * @pram index get from request
     * @param idResult get from request
     * @return SaveSuggestionsChoiceOutDTO response
     */
    SaveSuggestionsChoiceOutDTO saveSuggestionsChoice(List<SuggestionsChoiceDTO> sugggestionChoice);

}
