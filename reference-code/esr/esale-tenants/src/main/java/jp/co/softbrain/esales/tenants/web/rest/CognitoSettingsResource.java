package jp.co.softbrain.esales.tenants.web.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.tenants.domain.Tenants;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.service.CognitoSettingsService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoInDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.UserPoolDTO;
import jp.co.softbrain.esales.tenants.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateCognitoSettingRequest;

/**
 * Spring MVC RESTful Controller to CognitoSettings.
 *
 * @author QuangLV
 */
@RestController
public class CognitoSettingsResource {
    @Autowired
    CognitoSettingsService cognitoSettingsService;

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private ObjectMapper mapper;

    /**
     * get last record of cognitoSettings
     *
     * @return ResponseEntity
     */
    @PostMapping(path = "/public/api/get-cognito-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CognitoSettingInfoDTO> getCognitoSetting() {
        return ResponseEntity.ok(cognitoSettingsService.getCognitoSetting());
    }

    /**
     * get user pool
     *
     * @return ResponseEntity
     */
    @PostMapping(path = "/public/api/get-user-pool", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserPoolDTO> getUsePool() {
        return ResponseEntity.ok(cognitoSettingsService.getUserPool());
    }

    /**
     * update cognito setting
     *
     * @return ResponseEntity
     */
    @PostMapping(path = "/api/update-cognito-setting", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateCognitoOutDTO> updateCognitoSetting(@ModelAttribute UpdateCognitoSettingRequest request)
            throws IOException {
        UpdateCognitoInDTO data = mapper.readValue(request.getData(), UpdateCognitoInDTO.class);
        return ResponseEntity.ok(cognitoSettingsService.updateCognitoSetting(data, request.getFiles(), request.getFilesMap()));
    }

    /**
     * get last record of cognitoSettings
     *
     * @return ResponseEntity
     */
    @PostMapping(path = "/public/api/create-cognito-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> createCognitoSetting(@RequestBody CognitoSettingsDTO dto) {
        Tenants tenantInfo = tenantsRepository.findByTenantName(TenantContextHolder.getTenant()).orElse(null);
        if (tenantInfo != null) {
            dto.setTenantId(tenantInfo.getTenantId());
        }
        cognitoSettingsService.save(dto);
        return ResponseEntity.ok(true);
    }

}
