package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.NetworksStandsService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveNetworkMapRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.SaveNetworkMapResponse;

/**
 * Rest controller for api saveNetworkMap
 *
 * @author lequyphuc
 */
@RestController
@RequestMapping("/api")
public class SaveNetworkMapResource {

    @Autowired
    private NetworksStandsService networksStandsService;

    /**
     * Save net work map
     * 
     * @pram customer -list customer update network map
     * @return List<Long> list stand id inserted
     */
    @PostMapping(path = "/save-network-map", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public SaveNetworkMapResponse saveNetworkMap(@RequestBody SaveNetworkMapRequest request) {
        SaveNetworkMapResponse response = new SaveNetworkMapResponse();
        response.setNetworkStandId(networksStandsService.saveNetworkMap(request));
        return response;
    }

}
