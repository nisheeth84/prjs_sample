package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CustomerListIdInputRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.GetDataSyncElasticSearchCustomersResponse;

/**
 * CustomersCommonResource
 */
@RestController
@RequestMapping("/api")
public class CustomersCommonResource {

    @Autowired
    private CustomersCommonService customersCommonService;

    /**
     * Get customer information from database to sync to aws elastic search
     * 
     * @param customerIds - list id customer
     * @return list DTO
     */
    @PostMapping(path = "/get-data-sync-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDataSyncElasticSearchCustomersResponse> getDataSyncElasticSearch(
            @RequestBody CustomerListIdInputRequest request) {
        GetDataSyncElasticSearchCustomersResponse response = new GetDataSyncElasticSearchCustomersResponse();
        response.setDataSync(customersCommonService.getDataSyncElasticSearch(request.getCustomerIds()));
        return ResponseEntity.ok(response);
    }

}
