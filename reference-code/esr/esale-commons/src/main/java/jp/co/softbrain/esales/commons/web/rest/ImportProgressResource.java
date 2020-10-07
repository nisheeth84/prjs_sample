package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jp.co.softbrain.esales.commons.service.ImportProgressService;
import jp.co.softbrain.esales.commons.service.dto.ImportProgressDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressBarRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressBarResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.UpdateImportProgressResponse;

/**
 * API class process GraphQL query for processImport
 *
 * @author dohuyhai
 */
@RestController
@RequestMapping("/api")
public class ImportProgressResource {

    @Autowired
    ImportProgressService importProgressService;
    
    /**
     * get import progress API
     * @param req
     * @return res
     */
    @PostMapping(path = "/get-import-progress", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetImportProgressResponse> getImportProgress(@RequestBody GetImportProgressRequest req) {
        
        return ResponseEntity.ok(importProgressService.getImportProgress(req));
    }
    
    /**
     * update import progress API
     * @param req
     * @return res
     */
    @PostMapping(path = "/update-import-progress", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateImportProgressResponse> updateImportProgress(@RequestBody ImportProgressDTO req) {
        
        return ResponseEntity.ok(importProgressService.updateImportProgress(req));
    }
    
    /**
     * get import progress bar API
     * @param req
     * @return res
     */
    @PostMapping(path = "/get-import-progress-bar", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetImportProgressBarResponse> getImportProgressBar(@RequestBody GetImportProgressBarRequest req) {
        
        return ResponseEntity.ok(importProgressService.getImportProgressBar(req));
    }
}
