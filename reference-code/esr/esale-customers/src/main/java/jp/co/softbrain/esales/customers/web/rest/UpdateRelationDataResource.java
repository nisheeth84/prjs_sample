/**
 *
 */
package jp.co.softbrain.esales.customers.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersCUDService;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataRequest;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataResponse;

/**
 * API for relation
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class UpdateRelationDataResource {

    @Autowired
    private CustomersCUDService customersService;

    /**
     * create product
     *
     * @param data info product
     * @return id product
     */
    @PostMapping(path = "/update-relation-data", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateRelationDataResponse> updateRelationData(
            @RequestBody UpdateRelationDataRequest request) {
        UpdateRelationDataResponse res = new UpdateRelationDataResponse();
        try {
            List<Long> updateRecordIds = customersService
                    .updateRelationData(request.getRecordId(),
                    request.getRelationDataInfos());
            res.setUpdateRecordIds(updateRecordIds);
        } catch (CustomRestException exception) {
            res.setErrorAttributes(exception.getExtensions());
        }
        return ResponseEntity.ok(res);
    }

}
