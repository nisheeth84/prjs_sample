package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateDetailScreenLayoutRequest;

/**
 * UpdateDetailScreenLayoutMutation class
 * 
 * @author nguyenductruong
 */
@RestController
@RequestMapping("/api")
public class UpdateDetailScreenLayoutResource {

    @Autowired
    private CommonFieldInfoService commonFieldInfoService;

    /**
     * update Detail Screen Layout
     * 
     * @param fieldBelong
     * @param deleteFields
     * @param fields
     * @param deleteTabs
     * @param tabs
     * @param deleteFieldsTab
     * @param fieldsTab
     * @return
     */
    @PostMapping(path = "/update-detail-screen-layout", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateDetailScreenLayoutOutDTO> updateDetailScreenLayout(
            @RequestBody UpdateDetailScreenLayoutRequest input) {
        return ResponseEntity.ok(commonFieldInfoService.updateDetailScreenLayout(input.getFieldBelong(),
                input.getDeleteFields(), input.getFields(), input.getDeleteTabs(), input.getTabs(),
                input.getDeleteFieldsTab(), input.getFieldsTab()));
    }
}
