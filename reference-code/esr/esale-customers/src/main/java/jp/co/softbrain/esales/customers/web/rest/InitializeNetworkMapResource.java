package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.NetworksStandsService;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.InitializeNetworkMapRequest;

/**
 * Rest controller for api initializeNetworkMap
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class InitializeNetworkMapResource {

    @Autowired
    private NetworksStandsService networksStandsService;

    /**
     * Get count the number of customers by employees with employeeId
     * 
     * @param employeeId the employeeId of the entity
     * @return the entity
     */
    @PostMapping(path = "/initialize-network-map", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeNetworkMapOutDTO> getInitializeNetworkMap(@RequestBody InitializeNetworkMapRequest request) {
        return ResponseEntity.ok(networksStandsService.initializeNetworkMap(request.getCustomerId(), null));
    }

}
