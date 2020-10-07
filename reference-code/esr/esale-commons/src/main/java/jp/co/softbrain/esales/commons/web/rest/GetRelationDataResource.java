/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetRelationDataRequest;

/**
 * GetRelationDataOutQuery class process GraphQL query
 * 
 * @author chungochai
 */
@RestController
@RequestMapping("/api")
public class GetRelationDataResource {

    @Autowired
    private CommonFieldInfoService commonFieldInfoService;

    /**
     * get relation data
     * 
     * @param listIds
     * @param fieldBelong
     * @param fieldIds
     * @return
     */
    @PostMapping(path = "/get-relation-data", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetRelationDataOutDTO> getRelationData(@RequestBody GetRelationDataRequest input) {
        return ResponseEntity.ok(commonFieldInfoService.getRelationData(input.getFieldBelong(), input.getListIds(),
                input.getFieldIds()));
    }
}
