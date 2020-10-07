package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.LanguagesService;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetLanguagesResponse;

/**
 * LanguageQuery class process GraphQL query
 *
 */
@RestController
@RequestMapping("/api")
public class LanguagesResource {

    @Autowired
    private LanguagesService languageService;

    /**
     * get Languages
     *
     * @return the list of languages order by displayOrder
     */
    @PostMapping(path = "/get-languages", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetLanguagesResponse> getLanguages() {
        GetLanguagesResponse response = new GetLanguagesResponse();
        response.setLanguagesDTOList(this.languageService.findAllByOrderByDisplayOrderAsc());
        return ResponseEntity.ok(response);
    }
}
