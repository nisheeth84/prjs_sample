package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.impl.GetImportFieldsInfoServiceImpl;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldOptionsItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldRelationItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMappingItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMatchingKeyRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.FieldOptionsItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetFieldRelationItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMappingItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMatchingKeyResponse;

/**
 * query class for API getImportMatchingKey,getImportMappingItem
 *
 * @author Trungnd
 */
@RestController
@RequestMapping("/api")
public class GetImportFieldsInfoResource {

    @Autowired
    private GetImportFieldsInfoServiceImpl getImportFieldsInfoServiceImpl;

    /**
     * get FieldRelationItem
     * 
     * @param request
     * @return
     */
    @PostMapping(path = "/get-field-relation-item", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetFieldRelationItemResponse> getFieldRelationItem(
            @RequestBody GetFieldRelationItemRequest request) {
        return ResponseEntity.ok(getImportFieldsInfoServiceImpl.getFieldRelationItem(request));
    }

    /**
     * get ImportMatchingKey
     * 
     * @param request
     * @return
     */
    @PostMapping(path = "/get-import-matching-key", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetImportMatchingKeyResponse> getImportMatchingKey(
            @RequestBody GetImportMatchingKeyRequest request) {
        return ResponseEntity.ok(getImportFieldsInfoServiceImpl.getImportMatchingKey(request));
    }

    /**
     * get Import mapping item
     * 
     * @param req
     * @return GetImportMappingItemResponse
     */
    @PostMapping(path = "/get-import-mapping-item", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetImportMappingItemResponse> getImportMappingItem(
            @RequestBody GetImportMappingItemRequest req) {
        return ResponseEntity.ok(getImportFieldsInfoServiceImpl.getImportMappingItem(req));
    }

    /**
     * get Field Options item
     * 
     * @param importBelong
     * @return FieldOptionsItemResponse
     */
    @PostMapping(path = "/get-field-options-item", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FieldOptionsItemResponse> getFieldOptionsItem(
            @RequestBody GetFieldOptionsItemRequest req) {
        return ResponseEntity.ok(getImportFieldsInfoServiceImpl.getFieldOptionsItem(req));
    }

}
