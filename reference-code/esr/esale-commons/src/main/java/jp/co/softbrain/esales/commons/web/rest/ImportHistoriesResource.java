package jp.co.softbrain.esales.commons.web.rest;

import jp.co.softbrain.esales.commons.service.ImportHistoriesService;
import jp.co.softbrain.esales.commons.service.dto.ImportHistoriesDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateImportHistoryOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ImportHistoriesRequestDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateImportHistoryRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ImportHistoriesResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportHistoriesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(path = "/api")
public class ImportHistoriesResource {

    @Autowired
    private ImportHistoriesService importHistoriesService;

    @PostMapping(path = "/get-import-histories",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImportHistoriesResponse> getImportHistories(
            @RequestBody GetImportHistoriesRequest getImportHistoriesRequest) {
        return ResponseEntity.ok(importHistoriesService.getImportHistories(getImportHistoriesRequest));
    }

    @GetMapping(path = "/get-import-histories-by-id")
    public ResponseEntity<ImportHistoriesResponse> getImportHistories(
        @RequestParam(name = "importHistoryId") Long importHistoryId) {
        return ResponseEntity.ok(importHistoriesService.getImportHistory(importHistoryId));
    }

    @PostMapping(path = "/save-import-history", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportHistoriesDTO> saveImportHistory(
        @RequestPart(value = "importHistories", required = true) ImportHistoriesRequestDTO importHistoriesDTO,
        @RequestPart(value = "file", required = true) final MultipartFile file) throws IOException {
        importHistoriesDTO.setFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(importHistoriesService.save(importHistoriesDTO));
    }
    
    @PostMapping(path = "/update-import-history", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateImportHistoryOutDTO> updateImportHistory(
            @RequestBody UpdateImportHistoryRequest request) {
        return ResponseEntity.ok(importHistoriesService.updateImportHistory(request));
    }

}
