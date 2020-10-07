package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CreateDataChangeRequest;

/**
 * DataChangeMutation class process GraphQL Mutation
 * 
 * @author PhucLQ
 */
@RestController
@RequestMapping(path = "/api")
public class CreateDataChangeElasticSearchResource {

    @Autowired
    private CustomersCommonService customersCommonService;

    /**
     * create DataChange Elastic Search
     * 
     * @param request value get from request
     * @return response
     */
    @PostMapping(path = "/create-data-change-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> createDataChangeElasticSearch(@RequestBody CreateDataChangeRequest request) {
        return ResponseEntity
                .ok(customersCommonService.createDataChangeElasticSearch(request.getParameterConditions()));
    }

}
