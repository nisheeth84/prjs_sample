/**
 *
 */
package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.GeneralSettingService;
import jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetGeneralSettingRequest;

/**
 * Rest controller for GeneralSetting
 *
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GeneralSettingResource {

    @Autowired
    private GeneralSettingService generalSettingService;

    /**
     * Get general setting res
     *
     * @param request
     * @return
     */
    @PostMapping(path = "/get-general-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GeneralSettingDTO> getGeneralSetting(@RequestBody GetGeneralSettingRequest request) {

        return ResponseEntity
                .ok(generalSettingService.getGeneralSetting(request.getSettingName()));
    }
}
