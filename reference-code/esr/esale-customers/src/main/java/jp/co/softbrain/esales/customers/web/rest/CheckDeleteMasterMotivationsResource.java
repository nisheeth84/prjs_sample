package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.MastersMotivationsService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CheckDeteleMastersMotivationsRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CheckDeteleMastersMotivationsResponse;

/**
 * Check Delete Master Motivations Query
 *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class CheckDeleteMasterMotivationsResource {

    @Autowired
    private MastersMotivationsService mastersMotivationsService;

    /**
     * CheckDeleteMasterMotivations : get master motivation id by list id
     *
     * @param masterMotivationIds : list id of masterMotivation
     * @return the entity
     */
    @PostMapping(path = "/check-delete-master-motivation", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CheckDeteleMastersMotivationsResponse> getCheckDeleteMasterMotivations(
            @RequestBody CheckDeteleMastersMotivationsRequest req) {
        CheckDeteleMastersMotivationsResponse response = new CheckDeteleMastersMotivationsResponse();
        response.setMasterMotivationIds(mastersMotivationsService
                .checkDeleteMasterMotivations(req.getMasterMotivationIds()).getMasterMotivationIds());
        return ResponseEntity.ok(response);
    }
}
