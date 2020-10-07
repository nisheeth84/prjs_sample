package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.MastersStandsService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CheckDeteleMasterStandsRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CheckDeteleMasterStandsResponse;

/**
 * Check Delete Master Stands
 *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class CheckDeleteMasterStandsResource {

    @Autowired
    private MastersStandsService checkDeleteMasterStands;

    /**
     * Check Delete Master Stands
     *
     * @param masterStandIds : list id of masterStands
     * @return List Id of Delete Master Stands
     */
    @PostMapping(path = "/check-delete-master-stands", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CheckDeteleMasterStandsResponse> getCheckDeleteMasterStands(
            @RequestBody CheckDeteleMasterStandsRequest req) {
        CheckDeteleMasterStandsResponse response = new CheckDeteleMasterStandsResponse();
        response.setMasterStandIds(
                checkDeleteMasterStands.checkDeleteMasterStands(req.getMasterStandIds()).getMasterStandIds());
        return ResponseEntity.ok(response);
    }
}
