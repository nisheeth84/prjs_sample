package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.dto.CustomerSyncDataElasticSeachRequest;

/**
 * CustomersElasticSearchResource
 */
@RestController
@RequestMapping("/api")
public class CustomersElasticSearchResource {

    @Autowired
    private CustomersCommonService customersCommonService;

    /**
     * getCustomerList
     */
    @PostMapping(path = "/sync-data-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> syncDataElasticSearch(@RequestBody CustomerSyncDataElasticSeachRequest request) {
        return ResponseEntity.ok(customersCommonService.syncDataElasticSearch(request.getCustomerListIds(),
                request.getCustomerIds(), request.getAction()));
    }

}
