package jp.co.softbrain.esales.commons.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.ListViewSettingsService;
import jp.co.softbrain.esales.commons.service.dto.UpdateListViewSettingInDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateListViewSettingRequest;

/**
 * Mutation for call service
 * {@link jp.co.softbrain.esales.commons.service.ListViewSettingsService}
 * 
 * @author nguyenvanchien3
 */
@RestController
@RequestMapping("/api")
public class UpdateListViewSettingResource {
    private final Logger log = LoggerFactory.getLogger(UpdateListViewSettingResource.class);

    @Autowired
    private ListViewSettingsService listViewSettingsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Call service ListViewSettings.updateListViewSetting
     * 
     * @param fieldBelong - id feature
     * @param selectedTargetType - type of item which has been chosen on local
     *        navigation
     * @param selectedTargetId - Id of item which has been chosen on local
     *        navigation
     * @param extraSettings - option information
     * @param filterConditions - List filter conditions
     * @param orderBy - order options
     */
    @PostMapping(path = "/update-list-view-setting", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateListViewSetting(@RequestBody UpdateListViewSettingRequest inputVm) {
        log.debug("Call Service ListViewSettings.updateListViewSetting");

        UpdateListViewSettingInDTO input = new UpdateListViewSettingInDTO();
        input.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        input.setFieldBelong(inputVm.getFieldBelong());
        input.setSelectedTargetType(inputVm.getSelectedTargetType());
        input.setSelectedTargetId(inputVm.getSelectedTargetId());
        input.setExtraSettings(inputVm.getExtraSettings());
        input.setFilterConditions(inputVm.getFilterConditions());
        input.setOrderBy(inputVm.getOrderBy());
        listViewSettingsService.updateListViewSetting(input);

        return ResponseEntity.ok().build();
    }

}