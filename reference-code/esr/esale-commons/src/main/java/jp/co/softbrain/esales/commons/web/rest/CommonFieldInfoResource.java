package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateFieldInfoPersonalsRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.CommonFieldInfoResponse;

/**
 * resource for common field's info
 *
 * @author quannt
 */
@RestController
@RequestMapping("/api")
public class CommonFieldInfoResource {

    @Autowired
    private CommonFieldInfoService commonFieldInfoService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Get information personal field
     *
     * @param fieldBelong functions used field_info
     * @param extensionBelong functions used field_info_personal
     * @return List information personal field
     */
    @PostMapping(path = "/get-field-info-personals", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CommonFieldInfoResponse> getFieldInfoPersonals(
            @RequestBody FieldInfoPersonalsInputDTO request) {
        // 1. get employee_id from token
        if (request != null) {
            request.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        }
        CommonFieldInfoResponse response = new CommonFieldInfoResponse();
        response.setFieldInfoPersonals(commonFieldInfoService.getFieldInfoPersonals(request));
        // 3. call service
        return ResponseEntity.ok(response);
    }

    /**
     * Get information custom fields
     *
     * @param fieldBelong functions used field_info
     * @return List information custom field
     */
    @PostMapping(path = "/get-custom-fields-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CommonFieldInfoResponse> getCustomFieldsInfo(
            @RequestBody GetCustomFieldsInfoRequest request) {
        CommonFieldInfoResponse response = new CommonFieldInfoResponse();
        response.setCustomFieldsInfo(commonFieldInfoService.getCustomFieldsInfo(request.getFieldBelong()));
        return ResponseEntity.ok(response);
    }

    /**
     * Get information custom fields by list fieldId
     * 
     * @param fieldIds data need for get Field data
     * @return List information custom field
     */
    @PostMapping(path = "/get-custom-fields-info-by-field-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CommonFieldInfoResponse> getCustomFieldsInfoByFieldIds(
            @RequestBody GetCustomFieldsInfoByFieldIdsRequest request) {
        CommonFieldInfoResponse response = new CommonFieldInfoResponse();
        response.setCustomFieldsInfo(commonFieldInfoService.getCustomFieldsInfoByFieldIds(request.getFieldIds()));
        return ResponseEntity.ok(response);
    }

    /**
     * update Field Info personal
     *
     * @param request.extentionBelong : Screen code uses field
     * @param request.fieldBelong : Functional code uses field
     * @param request.fieldInfos : Array contains field information
     * @return List id of the update Field Info personal
     */
    @PostMapping(path = "/update-field-info-personals", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Long>> updateFieldInfoPersonals(@RequestBody UpdateFieldInfoPersonalsRequest request) {
        return ResponseEntity.ok(
                commonFieldInfoService.updateFieldInfoPersonals(request.getFieldBelong(), request.getExtensionBelong(),
                        request.getSelectedTargetType(), request.getSelectedTargetId(), request.getFieldInfos()));
    }
}
