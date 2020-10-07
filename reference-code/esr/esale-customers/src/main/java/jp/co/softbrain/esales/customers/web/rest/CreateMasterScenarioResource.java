package jp.co.softbrain.esales.customers.web.rest;

import jp.co.softbrain.esales.customers.service.MastersScenariosService;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CreateMasterScenarioRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * create Master Scenario *
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class CreateMasterScenarioResource {

    @Autowired
    private MastersScenariosService mastersScenariosService;

    /**
     * createMasterScenario : create Master Scenario
     *
     * @param CreateMasterScenarioRequest : scenarioName and list milestones
     * @return the entity
     */
    @PostMapping(path = "/create-master-scenario", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateMasterScenarioOutDTO> createMasterScenario(
            @RequestBody CreateMasterScenarioRequest req) {
        return ResponseEntity
                .ok(mastersScenariosService.createMasterScenario(req.getScenarioName(), req.getMilestones()));
    }
}
