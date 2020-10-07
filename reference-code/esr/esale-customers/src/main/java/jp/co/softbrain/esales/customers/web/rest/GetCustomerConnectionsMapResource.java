package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.web.rest.vm.response.GetCustomerConnectionsMapResponse;

/**
 * GetCustomerConnectionsMapQuery
 *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class GetCustomerConnectionsMapResource {

    @Autowired
    private CustomersService customersService;

    /**
     * Get Customer Connections Map
     *
     * @return List masterMotivations and mastersStands
     */
    @PostMapping(path = "/get-customer-connection-map", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerConnectionsMapResponse> getCustomerConnectionsMap() {
        GetCustomerConnectionsMapResponse response = new GetCustomerConnectionsMapResponse();
        response.setMasterMotivations(customersService.getCustomerConnectionsMap().getMasterMotivations());
        response.setMastersStands(customersService.getCustomerConnectionsMap().getMastersStands());
        return ResponseEntity.ok(response);
    }
}
