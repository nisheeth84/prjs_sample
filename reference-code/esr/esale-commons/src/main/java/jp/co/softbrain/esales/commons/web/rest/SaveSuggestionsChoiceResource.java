package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.SuggestionsChoiceService;
import jp.co.softbrain.esales.commons.service.dto.SaveSuggestionsChoiceOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.SaveSuggestionsChoiceRequest;

/**
 * SaveSuggestionsChoiceMutation
 *
 * @author lequyphuc
 */
@RestController
@RequestMapping("/api")
public class SaveSuggestionsChoiceResource {

    @Autowired
    private SuggestionsChoiceService suggestionsChoiceService;

    /**
     * Save suggestions Choice
     * 
     * @pram index get from request
     * @param idResult get from request
     * @return SaveSuggestionsChoiceOutDTO response
     */
    @PostMapping(path = "/save-suggestions-choice", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SaveSuggestionsChoiceOutDTO> saveSuggestionsChoice(
            @RequestBody SaveSuggestionsChoiceRequest input) {
        return ResponseEntity.ok(suggestionsChoiceService.saveSuggestionsChoice(input.getSugggestionsChoice()));
    }
}
