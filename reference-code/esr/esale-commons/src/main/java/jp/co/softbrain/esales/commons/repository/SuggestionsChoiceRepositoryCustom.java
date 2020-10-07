package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.service.dto.GetEmployeeSuggestionsChoiceDTO;

/**
 * Notification Setting Repository Custom
 *
 * @author DatDV
 *
 */
@Repository
public interface SuggestionsChoiceRepositoryCustom {

    /**
     * Get info of Employee Suggestions Choice
     * 
     * @param index Array index to mark the search function
     * @param employeeId Id of employee
     * @param limit The number of records to retrieve
     * @return the DTO response
     */
    List<GetEmployeeSuggestionsChoiceDTO> getEmployeeSuggestionsChoice(List<String> index, Long employeeId, Integer limit);
}
