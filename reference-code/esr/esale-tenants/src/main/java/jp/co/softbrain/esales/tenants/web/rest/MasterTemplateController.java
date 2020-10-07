package jp.co.softbrain.esales.tenants.web.rest;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import jp.co.softbrain.esales.tenants.service.dto.MTemplateIndustryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.MasterTemplateService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.MasterTemplateRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.MasterTemplateResponse;

import java.util.List;

/**
 * REST-ful Controller to update/rollback master template.
 *
 * @author nguyenvietloi
 */
@RestController
public class MasterTemplateController {

    @Autowired
    private MasterTemplateService masterTemplateService;

    /**
     * Update master template
     *
     * @param request request
     * @return {@link MasterTemplateResponse}
     */
    @PostMapping(path = "/api/update-master-template", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MasterTemplateResponse> updateMasterTemplates(
            @RequestBody MasterTemplateRequest request) {
        MasterTemplateResponse response = new MasterTemplateResponse();
        response.setMessage(masterTemplateService
                .updateMasterTemplates(request.getIndustryTypeName(), request.getMicroServiceNames()));
        return ResponseEntity.ok(response);
    }

    /**
     * Rollback master template
     *
     * @param request request
     * @return {@link MasterTemplateResponse}
     */
    @PostMapping(path = "/api/rollback-master-template", consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MasterTemplateResponse> rollbackMasterTemplates(@RequestBody MasterTemplateRequest request) {
        String message = masterTemplateService.rollbackMasterTemplates(request.getIndustryTypeName(),
                request.getMicroServiceNames());
        return ResponseEntity.ok(new MasterTemplateResponse(message));
    }

    /**
     * Get list master template
     *
     * @return {@link ContractSiteResponseDTO}
     */
    @GetMapping(path = "/public/api/get-list-templates", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getListTemplates() {
        List<MTemplateIndustryDTO> mTemplateIndustryList =  masterTemplateService.getListTemplates();

        return ResponseEntity.ok(new ContractSiteResponseDTO(SUCCESS.getValue(), mTemplateIndustryList, null /* errors */));
    }
}
