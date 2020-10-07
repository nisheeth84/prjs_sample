package jp.co.softbrain.esales.commons.web.rest;


import jp.co.softbrain.esales.commons.service.GeneralSettingService;
import jp.co.softbrain.esales.commons.service.dto.UpdateGeneralSettingOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateGeneralSettingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Update General Setting Resource
 *
 * @author ThaiVV
 */
@RestController
@RequestMapping("/api")
public class UpdateGeneralSettingResource {

    /**
     * general Setting Service
     */
    @Autowired
    private GeneralSettingService generalSettingService;

    /**
     * update General Setting
     *
     * @param generalSettingId : generalSettingId form updateGeneralSetting
     * @param settingName : settingName form updateGeneralSetting
     * @param settingValue : settingValue form updateGeneralSetting
     * @return
     */
    @PostMapping(path = "/update-general-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateGeneralSettingOutDTO> updateGeneralSetting(@RequestBody UpdateGeneralSettingRequest req) {
        return ResponseEntity.ok(generalSettingService.updateGeneralSetting(req.getGeneralSettingId(),req.getSettingName(),req.getSettingValue(),req.getUpdatedDate()));
    }
}
