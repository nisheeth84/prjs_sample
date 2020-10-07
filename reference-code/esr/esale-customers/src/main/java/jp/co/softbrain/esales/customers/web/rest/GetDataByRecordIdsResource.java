/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsRequest;

/**
 * Get data by record ids
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetDataByRecordIdsResource {

    @Autowired
    private CustomersCommonService customersCommonService;

    /**
     * get data for relation, organization and calculation field
     * 
     * @param recordIds id of record
     * @param fieldInfo fields to get
     * @return List data of field
     */
    @PostMapping(path = "/get-data-by-record-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDataByRecordIdsOutDTO> getDataByRecordIds(@RequestBody GetDataByRecordIdsRequest request) {
        return ResponseEntity
                .ok(customersCommonService.getDataByRecordIds(request.getRecordIds(), request.getFieldInfo()));
    }
}
