package jp.co.softbrain.esales.employees.web.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeesSuggestionRequest;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * GetEmployeesSuggestionQuery class process GraphQL query for get employees
 * suggestion
 *
 * @see com.coxautodev.graphql.tools.GraphQLQueryResolver
 */
@RestController
@RequestMapping("/api")
public class GetEmployeesSuggestionResource {
    @Autowired
    private EmployeesService employeesService;

    /**
     * Get employee information according to search criteria to display pulldown
     * 
     * @param startTime
     *            start time
     * @param endTime
     *            end time
     * @param searchType
     *            type of search
     * @param langKey
     *            User specified language
     * @return response of API getEmployeesSuggestion
     */
    @PostMapping(path = "/get-employees-suggestion", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeesSuggestionOutDTO> getEmployeesSuggestion(
            @RequestBody GetEmployeesSuggestionRequest req) {

        try {
            return ResponseEntity.ok(this.employeesService.getEmployeesSuggestion(req.getKeyWords(), req.getStartTime(),
                    req.getEndTime(), req.getSearchType(), null, req.getOffSet(), req.getLimit(),
                    req.getListItemChoice(), null, req.getRelationFieldI()));
        } catch (IOException ex) {
            throw new CustomException(ex);
        }
    }
}
