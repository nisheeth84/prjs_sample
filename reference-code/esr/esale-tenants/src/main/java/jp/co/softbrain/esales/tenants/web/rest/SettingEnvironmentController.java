package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.ReceiveSettingRequestService;
import jp.co.softbrain.esales.tenants.service.SettingEnvironmentService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveSettingResDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.SettingEnvironmentRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.SettingEnvironmentResponse;

/**
 * Spring MVC RESTful Controller to handle create Tenant.
 *
 * @author tongminhcuong
 */
@RestController
public class SettingEnvironmentController {

    @Autowired
    private SettingEnvironmentService settingEnvironmentService;

    @Autowired
    private ReceiveSettingRequestService settingRequestService;

    /**
     * Receive the tenant environment setting request based on the specified parameters.
     * Start the batch setting up the registry environment.
     *
     * @param request Data receive the tenant environment.
     * @return response include ReceiveSettingDataDTO.
     */
    @PostMapping(path = "/public/api/receive-setting-request", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> receiveSettingRequest(@RequestBody ReceiveSettingResDTO request) {
        return ResponseEntity.ok(settingRequestService.receiveSettingRequest(request));
    }

    /**
     * Setting environment when created a tenant
     *
     * @param request Tenant info (tenant Id, language id)
     * @return The message after setting process
     */
    @PostMapping(path = "/api/setting-environment", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SettingEnvironmentResponse> settingEnvironment(@RequestBody SettingEnvironmentRequest request) {

        return ResponseEntity.ok(settingEnvironmentService.settingEnvironment(request.getTenantId(),
            request.getLanguageId(),
            request.isSettingQuickSight()));
    }
}
