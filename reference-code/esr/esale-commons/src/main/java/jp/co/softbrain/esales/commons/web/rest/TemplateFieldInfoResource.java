package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.GetImportFieldsInfoService;
import jp.co.softbrain.esales.commons.service.dto.GetTemplateFieldsInfoInDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.response.TemplateFieldInfoResponse;

@RestController
@RequestMapping(path = "/api")
public class TemplateFieldInfoResource {

    @Autowired
    private GetImportFieldsInfoService templateFieldsInfoService;

    @PostMapping(path = "/get-template-fields-info-file", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTemplateFieldsInfoFile(
        @RequestBody GetTemplateFieldsInfoInDTO req) {
        return ResponseEntity.ok(templateFieldsInfoService.getFilePathTemplateFieldsInfo(req.getServiceId()));
    }
    
    @PostMapping(path = "/get-template-fields-info", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TemplateFieldInfoResponse> getTemplateFieldsInfo(
        @RequestBody GetTemplateFieldsInfoInDTO req) {
        return ResponseEntity.ok(templateFieldsInfoService.getTemplateFieldsInfo(req.getServiceId()));
    }
}
