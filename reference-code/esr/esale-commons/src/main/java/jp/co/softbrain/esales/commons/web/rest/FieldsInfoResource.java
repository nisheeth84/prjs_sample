package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.FieldInfoService;
import jp.co.softbrain.esales.commons.web.rest.vm.GetFieldsInfoResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldsInfoRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetFieldInfoItemByFieldBelongResponse;

/**
 * query class for API getFieldsInfo
 *
 * @author nguyentienquan
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class FieldsInfoResource {

    @Autowired
    private FieldInfoService fieldInfoService;

    @Autowired
    private CommonFieldInfoService commonFieldInfoService;

    /**
     * query for API getFieldsInfo
     *
     * @param req
     * @return list of FieldsInfo
     */
    @PostMapping(path = "/get-fields-info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFieldsInfoResponse> getFieldsInfo(@RequestBody GetFieldsInfoRequest req) {
        GetFieldsInfoResponse fieldsInfoResponse = new GetFieldsInfoResponse();
        fieldsInfoResponse
                .setFields(fieldInfoService.getFieldsInfo(req.getFieldBelong(), req.getFieldType(), req.getFieldId()));
        return ResponseEntity.ok(fieldsInfoResponse);
    }

    /**
     * @param fieldBelong
     * @return
     */
    @PostMapping(path = "/get-field-info-item-by-field-belong", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFieldInfoItemByFieldBelongResponse> getFieldInfoItemByFieldBelong(
            @RequestBody Integer fieldBelong) {
        GetFieldInfoItemByFieldBelongResponse response = new GetFieldInfoItemByFieldBelongResponse();
        response.setFieldInfoItems(commonFieldInfoService.getFieldInfoItemByFieldBelong(fieldBelong));
        return ResponseEntity.ok(response);
    }
}
