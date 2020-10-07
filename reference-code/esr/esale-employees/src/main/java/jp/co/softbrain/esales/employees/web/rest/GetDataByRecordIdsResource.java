/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetDataByRecordIdsRequest;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;

/**
 * @author nguyentienquan
 */
@RestController
@RequestMapping("/api")
public class GetDataByRecordIdsResource {

    @Autowired
    private EmployeesCommonService employeesCommonService;

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
                .ok(employeesCommonService.getDataByRecordIds(request.getRecordIds(), request.getFieldInfo(), null));
    }
}
