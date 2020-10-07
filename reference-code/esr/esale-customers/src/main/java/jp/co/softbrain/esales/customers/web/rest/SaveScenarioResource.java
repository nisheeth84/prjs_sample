package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.MastersScenariosService;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveScenarioRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.SaveScenarioResponse;

/**
 * Rest controller for api saveNetworkMap
 *
 * @author lequyphuc
 */
@RestController
@RequestMapping("/api")
public class SaveScenarioResource {

    @Autowired
    private MastersScenariosService mastersScenariosService;

    /**
     * Save net work map
     * 
     * @pram customer -list customer update network map
     * @return List<Long> list stand id inserted
     */
    @PostMapping(path = "/save-scenario", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public SaveScenarioResponse saveScenario(@RequestBody SaveScenarioRequest request) {
        SaveScenarioResponse response = new SaveScenarioResponse();
        response.setScenarioId(mastersScenariosService.saveScenario(request));
        return response;
    }

}
