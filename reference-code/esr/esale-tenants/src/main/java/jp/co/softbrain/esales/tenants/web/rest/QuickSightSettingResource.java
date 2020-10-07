package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.QuickSightSettingProvider;
import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetQuickSightSettingRequest;

/**
 * Spring MVC RESTful Controller to handle Licenses.
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/api")
public class QuickSightSettingResource {

    @Autowired
    private QuickSightSettingProvider quicksightSettingProvider;

    /**
     * Get information of available license by tenant
     *
     * @param request The name of tenant Target
     * @return {@link GetQuickSightSettingDTO}
     */
    @PostMapping(path = "/get-quicksight-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetQuickSightSettingDTO> getQuickSightSetting(
            @RequestBody GetQuickSightSettingRequest request) {

        return ResponseEntity.ok(quicksightSettingProvider.getQuickSightSetting(request.getTenantName()));
    }
}
