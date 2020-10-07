package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldOptionsItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldRelationItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMappingItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMatchingKeyRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.FieldOptionsItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetFieldRelationItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMappingItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMatchingKeyResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.TemplateFieldInfoResponse;


/**
 * Service Interface for get fields info related to api Import CSV :
 * GetFieldRelationItem
 * GetImportMatchingKey
 * 
 * @author Trungnd
 */
@XRayEnabled
public interface GetImportFieldsInfoService {

    /**
     * get file path template Field info
     * 
     * @param importBelong
     * @return
     */
    String getFilePathTemplateFieldsInfo(Integer importBelong);
    
    TemplateFieldInfoResponse getTemplateFieldsInfo(Integer importBelong);

    /**
     * get list field relation items for import
     * 
     * @param request
     * @return GetFieldRelationItemResponse
     */
    GetFieldRelationItemResponse getFieldRelationItem(GetFieldRelationItemRequest request);

    /**
     * get list matching key fields info for import
     * 
     * @param request
     * @return GetImportMatchingKeyResponse
     */
    GetImportMatchingKeyResponse getImportMatchingKey(GetImportMatchingKeyRequest request);

    /**
     * get Import Mapping Item
     * 
     * @param req
     * @return response
     */
    GetImportMappingItemResponse getImportMappingItem(GetImportMappingItemRequest req);

    /**
     * get Field Options item
     * 
     * @param request
     * @return FieldOptionsItemResponse
     */
    FieldOptionsItemResponse getFieldOptionsItem(GetFieldOptionsItemRequest request);
}
