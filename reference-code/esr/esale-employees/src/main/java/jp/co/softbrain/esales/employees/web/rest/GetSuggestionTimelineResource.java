package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.SuggestionEmployeeService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetSuggestionTimelineRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetSuggestionTimelineResponse;

/**
 * Rest controller for api getSuggestionTimeline
 *
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetSuggestionTimelineResource {

    @Autowired
    private SuggestionEmployeeService suggestionEmployeeService;

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
    @PostMapping(path = "/get-suggestion-timeline", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetSuggestionTimelineResponse> getSuggestionTimeline(
            @RequestBody GetSuggestionTimelineRequest req) {
        return ResponseEntity.ok(suggestionEmployeeService.getSuggestionTimeline(req.getKeyWords(),
                req.getListItemChoice(), req.getTimelineGroupId(), req.getOffset()));
    }
}
