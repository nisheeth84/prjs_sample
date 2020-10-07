package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.GetImportInitInfoService;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoResponseDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportInitInfoRequest;

/**
 * Query for getImportInitInfo
 * 
 * @author nguyenvanchien3
 */
@RestController
@RequestMapping("/api")
public class GetImportInitInfoResource {

    @Autowired
    private GetImportInitInfoService getImportInitInfoService;

    /**
     * Get import info
     * 
     * @param extensionBelong functional use field_info
     * @return response info import
     */
    @PostMapping(path = "/get-import-init-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetImportInitInfoResponseDTO> getImportInitInfo(
            @RequestBody GetImportInitInfoRequest request) {
        return ResponseEntity.ok(getImportInitInfoService.getImportInitInfo(request.getExtensionBelong()));
    }
}
