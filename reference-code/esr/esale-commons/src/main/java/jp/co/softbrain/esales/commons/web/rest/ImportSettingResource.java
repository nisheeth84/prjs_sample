package jp.co.softbrain.esales.commons.web.rest;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ImportSettingService;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingGetDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportSettingRequest;

/**
 * API class for Import Setting Resource
 *
 * @author dohuyhai
 */
@RestController
@RequestMapping("/api")
public class ImportSettingResource {

    @Autowired
    ImportSettingService importSettingService;
    
    /**
     * get import setting API
     * @param req
     * @return res
     */
    @PostMapping(path = "/get-import-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImportSettingGetDTO> getImportSetting(@RequestBody GetImportSettingRequest req) {
        return ResponseEntity.ok(importSettingService.getImportSetting(req));
    }
}
