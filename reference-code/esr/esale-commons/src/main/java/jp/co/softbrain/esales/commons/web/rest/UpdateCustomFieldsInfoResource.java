package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.FieldInfoService;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateCustomFieldsInfoRequest;

/**
 * UpdateCustomFieldsInfoMutation class for update custom fields info
 *
 * @author vuvankien
 */
@RestController
@RequestMapping("/api")
public class UpdateCustomFieldsInfoResource {

    @Autowired
    private FieldInfoService fieldInfoService;

    /**
     * Update custom field info
     *
     * @param fieldBelong data need for Update custom field info
     * @param deletedFields data need for Update custom field info
     * @param fields data need for Update custom field info
     * @param fieldsTab data need for Update custom field info
     * @param deletedFieldsTab data need for Update custom field info
     * @param tabs data need for Update custom field info
     * @return UpdateCustomFieldsInfoOutDTO List id of the updated record
     */
    @PostMapping(path = "/update-custom-fields-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateCustomFieldsInfoOutDTO> updateCustomFieldsInfo(
            @RequestBody UpdateCustomFieldsInfoRequest input) {
        return ResponseEntity
                .ok(fieldInfoService.updateCustomFieldsInfo(input.getFieldBelong(), input.getDeletedFields(),
                        input.getFields(), input.getTabs(), input.getDeletedFieldsTab(), input.getFieldsTab()));
    }
}
