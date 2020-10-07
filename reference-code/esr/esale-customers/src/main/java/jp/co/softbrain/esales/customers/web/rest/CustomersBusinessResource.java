package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersBusinessService;
import jp.co.softbrain.esales.customers.service.CustomersListService;
import jp.co.softbrain.esales.customers.service.dto.GetListSuggestionsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetSpecialItemsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeEditModeOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetListSuggestionsRequest;

/**
 * CustomersBusinessResource
 */
@RestController
@RequestMapping("/api")
public class CustomersBusinessResource {

    @Autowired
    private CustomersBusinessService customersBusinessService;
    @Autowired
    private CustomersListService customersListService;
    /**
     * Initialize Edit Mode
     * 
     * @return Object contains data
     */
    @PostMapping(path = "/initialize-edit-mode", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeEditModeOutDTO> initializeEditMode() {
        return ResponseEntity.ok(customersBusinessService.initializeEditMode());
    }

    /**
     * get Special Items
     * 
     * @return response
     */
    @PostMapping(path = "/get-special-items", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetSpecialItemsOutDTO> getSpecialItems() {
        return ResponseEntity.ok(customersBusinessService.getSpecialItems());
    }
    
    /**
     * get list suggestion
     * 
     * @param request search value
     * @return GetListSuggestionsOutDTO response
     */
    @PostMapping(path = "/get-list-suggestions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetListSuggestionsOutDTO> getListSuggestions(@RequestBody GetListSuggestionsRequest request) {
        return ResponseEntity.ok(customersListService.getListSuggestions(request.getSearchValue()));
    }

}
