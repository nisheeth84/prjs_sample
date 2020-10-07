package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.FieldInfoTabPersonalService;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateFieldInfoTabPersonalRequest;

/**
 * UpdateFieldInfoTabPersonalMution
 *
 * @author haiCN
 */
@RestController
@RequestMapping("/api")
public class UpdateFieldInfoTabPersonalResource {
    @Autowired
    private FieldInfoTabPersonalService fieldInfoTabPersonalService;

    /**
     * update Field Info personal
     *
     * @param fieldInfoTabPersonalId data front-end need for update
     * @param fieldInfoTabId data front-end need for update
     * @param isColumnFixed data front-end need for update
     * @param columnWidth data front-end need for update
     * @return Code and message success or error
     */
    @PostMapping(path = "/update-field-info-tab-personal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> updateFieldInfoTabPersonal(@RequestBody UpdateFieldInfoTabPersonalRequest input) {
        return ResponseEntity.ok(fieldInfoTabPersonalService.updateFieldInfoTabPersonal(
                input.getFieldInfoTabPersonalId(), input.getFieldInfoTabId(), input.isColumnFixed(),
                input.getColumnWidth(), input.getUpdatedDate()));
    }
}
