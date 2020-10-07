package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.FieldInfoTabService;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsResponseDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldInfoTabsRequest;

/**
 * Get Field Info Tabs Query
 * 
 * @author buithingocanh
 */
@RestController
@RequestMapping("/api")
public class GetFieldInfoTabsResource {

    @Autowired
    private FieldInfoTabService fieldInfoTabService;

    /**
     * Get list of items and the order displayed in the list on the details
     * screen
     * 
     * @param tabBelong Functional use
     * @param tabId Usage tab
     * @return list field item
     */
    @PostMapping(path = "/get-field-info-tabs", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFieldInfoTabsResponseDTO> getFieldInfoTabs(@RequestBody GetFieldInfoTabsRequest request) {
        return ResponseEntity.ok(fieldInfoTabService.getFieldInfoTabs(request.getTabBelong(), request.getTabId()));
    }
}
