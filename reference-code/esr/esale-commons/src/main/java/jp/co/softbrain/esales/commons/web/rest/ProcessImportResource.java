package jp.co.softbrain.esales.commons.web.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.commons.service.ImportService;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ProcessImportFormDataRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ProcessImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ProcessImportResponse;

/**
 * API class process GraphQL query for processImport
 *
 * @author dohuyhai
 */
@RestController
@RequestMapping("/api")
public class ProcessImportResource {

    @Autowired
    ImportService importService;
    
    @Autowired
    private ObjectMapper mapper;

    /**
     * processImport API
     * 
     * @param req
     * @return res
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    @PostMapping(path = "/process-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)

    public ResponseEntity<ProcessImportResponse> processImport(
            @ModelAttribute ProcessImportFormDataRequest request)
            throws IOException {
        ProcessImportRequest req = mapper.readValue(request.getData(), ProcessImportRequest.class);

        try {
            req.setFile(request.getFiles().get(0));
        } catch (Exception e) {
            // if req file == null, validate step will thow exception later
        }

        
return ResponseEntity.ok(importService.processImport(req));
    }
}
