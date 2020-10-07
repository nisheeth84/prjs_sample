package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.SuggestionsChoiceService;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetEmployeeSuggestionsChoiceRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetEmployeeSuggestionsChoiceResponse;

/**
 * REST for API getSuggestionsChoice
 */
@RestController
@RequestMapping("/api")
public class GetEmployeeSuggestionsChoiceResource {

    @Autowired
    private SuggestionsChoiceService suggestionsChoiceService;

    /**
     * query for API getServicesInfo
     *
     * @param serviceType type of services to get
     * @return list data for graphql of API getServicesInfo
     */
    @PostMapping(path = "/get-employee-suggestions-choice", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeSuggestionsChoiceResponse> getEmployeeSuggestionsChoice(
            @RequestBody GetEmployeeSuggestionsChoiceRequest request) {
        GetEmployeeSuggestionsChoiceResponse response = new GetEmployeeSuggestionsChoiceResponse();
        response.setEmployeeSuggestionsChoice(suggestionsChoiceService.getEmployeeSuggestionsChoice(request.getIndex(),
                request.getEmployeeId(), request.getLimit()));
        return ResponseEntity.ok(response);
    }
}
