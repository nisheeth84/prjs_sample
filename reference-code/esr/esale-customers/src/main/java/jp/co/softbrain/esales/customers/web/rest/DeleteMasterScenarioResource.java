package jp.co.softbrain.esales.customers.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.customers.service.MastersScenariosService;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DeleteMasterScenarioRequest;

/**
 * Delete Master Scenario Resource
 * 
 * @author TuanLV
 */
@RestController
@RequestMapping("/api")
public class DeleteMasterScenarioResource {
    @Autowired
    private MastersScenariosService mastersScenariosService;
    
    /**
     * Delete Master Scenario
     * 
     * @param req : scenarioId
     * @return Entity delete
     */
    @PostMapping(path = "/delete-master-scenario", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateMasterScenarioOutDTO> deleteMasterScenario(
            @RequestBody DeleteMasterScenarioRequest req) {
        return ResponseEntity.ok(mastersScenariosService.deleleMasterScenario(req.getScenarioId()));
    }
}
