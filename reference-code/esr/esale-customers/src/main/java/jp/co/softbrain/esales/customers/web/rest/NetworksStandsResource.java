package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.NetworksStandsService;
import jp.co.softbrain.esales.customers.service.dto.GetProductTradingIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO;
import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetProductTradingIdsRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.RemoveBusinessCardsOutOfNetworkMapRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.NetworksStandsResponse;

/**
 * NetworksStandsResource
 */
@RestController
@RequestMapping("/api")
public class NetworksStandsResource {

    @Autowired
    private NetworksStandsService networksStandsService;

    /**
     * Add a network stand to DB
     * 
     * @param networksStands info of Networks Stands
     * @return the id of Networks Stands to add complete
     */
    @PostMapping(path = "/add-network-stand", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NetworksStandsResponse> addNetworkStand(@RequestBody NetworksStandsDTO networksStands) {
        NetworksStandsResponse networksStandsResponse = new NetworksStandsResponse();
        networksStandsResponse.setNetworkStandId(networksStandsService.addNetworkStand(networksStands));
        return ResponseEntity.ok(networksStandsResponse);
    }

    /**
     * Update a network stand
     * 
     * @param networksStands info of Networks Stands
     * @return the id of Networks Stands to update complete
     */
    @PostMapping(path = "/update-network-stand", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NetworksStandsResponse> updateNetworkStand(@RequestBody NetworksStandsDTO networksStands) {
        NetworksStandsResponse networksStandsResponse = new NetworksStandsResponse();
        networksStandsResponse.setNetworkStandId(networksStandsService.updateNetworkStand(networksStands));
        return ResponseEntity.ok(networksStandsResponse);
    }

    /**
     * delete a network stand with networkStandId
     * 
     * @param networkStandId the id of Networks Stands
     * @return the id of Networks Stands to delete complete
     */
    @PostMapping(path = "/delete-network-stand", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NetworksStandsResponse> deleteNetworkStand(@RequestBody NetworksStandsDTO request) {
        NetworksStandsResponse networksStandsResponse = new NetworksStandsResponse();
        networksStandsResponse.setNetworkStandId(networksStandsService.deleteNetworkStand(request.getNetworkStandId()));
        return ResponseEntity.ok(networksStandsResponse);
    }

    /**
     * remove business cards from network map
     * 
     * @pram businessCardCompanyId business card companyId to remove
     * @param departments - business card department to remove
     * @return RemoveBusinessCardsOutOfNetworkMapOutDTO
     */
    @PostMapping(path = "/remove-business-cards-out-of-network-map", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RemoveBusinessCardsOutOfNetworkMapOutDTO> removeBusinessCardsOutOfNetworkMap(
            @RequestBody RemoveBusinessCardsOutOfNetworkMapRequest request) {
        return ResponseEntity.ok(networksStandsService
                .removeBusinessCardsOutOfNetworkMap(request.getBusinessCardCompanyId(), request.getDepartments()));
    }

    /**
     * get list product trading id
     * @param  - networkStandIs
     * @return response
     */
    @PostMapping(path = "/get-product-trading-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetProductTradingIdsOutDTO> getProductTradingIds(
            @RequestBody GetProductTradingIdsRequest businessCardIds) {
        return ResponseEntity.ok(networksStandsService.getProductTradingIds(businessCardIds.getBusinessCardIds()));
    }

}
