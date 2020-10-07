package jp.co.softbrain.esales.customers.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import jp.co.softbrain.esales.customers.service.MastersScenariosService;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterScenariosSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.web.rest.errors.BadRequestAlertException;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetMasterScenarioRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.UpdateMasterScenariosRequest;

/**
 * REST controller for managing {@link jp.co.softbrain.esales.customers.domain.MastersScenarios}.
 */
@RestController
@RequestMapping("/api")
public class MastersScenariosResource {

    private final Logger log = LoggerFactory.getLogger(MastersScenariosResource.class);

    private static final String ENTITY_NAME = "customersMastersScenarios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private MastersScenariosService mastersScenariosService;

    /**
     * {@code POST  /masters-scenarios} : Create a new mastersScenarios.
     *
     * @param mastersScenariosDTO the mastersScenariosDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mastersScenariosDTO, or with status {@code 400 (Bad Request)} if the mastersScenarios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/masters-scenarios")
    public ResponseEntity<MastersScenariosDTO> createMastersScenarios(@Valid @RequestBody MastersScenariosDTO mastersScenariosDTO) throws URISyntaxException {
        log.debug("REST request to save MastersScenarios : {}", mastersScenariosDTO);
        if (mastersScenariosDTO.getScenarioId() != null) {
            throw new BadRequestAlertException("A new mastersScenarios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MastersScenariosDTO result = mastersScenariosService.save(mastersScenariosDTO);
        return ResponseEntity.created(new URI("/api/masters-scenarios/" + result.getScenarioId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getScenarioId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /masters-scenarios} : Updates an existing mastersScenarios.
     *
     * @param mastersScenariosDTO the mastersScenariosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mastersScenariosDTO,
     * or with status {@code 400 (Bad Request)} if the mastersScenariosDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mastersScenariosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/masters-scenarios")
    public ResponseEntity<MastersScenariosDTO> updateMastersScenarios(@Valid @RequestBody MastersScenariosDTO mastersScenariosDTO) throws URISyntaxException {
        log.debug("REST request to update MastersScenarios : {}", mastersScenariosDTO);
        if (mastersScenariosDTO.getScenarioId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MastersScenariosDTO result = mastersScenariosService.save(mastersScenariosDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mastersScenariosDTO.getScenarioId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /masters-scenarios} : get all the mastersScenarios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mastersScenarios in body.
     */
    @GetMapping("/masters-scenarios")
    public List<MastersScenariosDTO> getAllMastersScenarios() {
        log.debug("REST request to get all MastersScenarios");
        return mastersScenariosService.findAll();
    }

    /**
     * {@code GET  /masters-scenarios/:id} : get the "id" mastersScenarios.
     *
     * @param id the id of the mastersScenariosDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mastersScenariosDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/masters-scenarios/{id}")
    public ResponseEntity<MastersScenariosDTO> getMastersScenarios(@PathVariable Long id) {
        log.debug("REST request to get MastersScenarios : {}", id);
        Optional<MastersScenariosDTO> mastersScenariosDTO = mastersScenariosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mastersScenariosDTO);
    }

    /**
     * {@code DELETE  /masters-scenarios/:id} : delete the "id" mastersScenarios.
     *
     * @param id the id of the mastersScenariosDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/masters-scenarios/{id}")
    public ResponseEntity<Void> deleteMastersScenarios(@PathVariable Long id) {
        log.debug("REST request to delete MastersScenarios : {}", id);
        mastersScenariosService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * Get a list of script templates that are set for customers
     * 
     * @return list entity
     */
    @PostMapping(path = "/get-master-scenarios", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetMasterScenariosOutDTO> getMasterScenarios() {
        return ResponseEntity.ok(mastersScenariosService.getMasterScenarios());
    }

    /**
     * Get the data for the scenario screen
     * 
     * @param scenarioId - id scenario input
     * @return the entity
     */
    @PostMapping(path = "/get-master-scenario", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MasterScenariosSubType1DTO> getMasterScenario(@RequestBody GetMasterScenarioRequest request) {
        return ResponseEntity.ok(mastersScenariosService.getMasterScenario(request.getScenarioId()));
    }

    /**
     * updateMasterScenarios : updateMasterScenarios
     * 
     * @param request : request parmeter
     * @return GetMasterScenariosOutDTO : DTO out for updateMasterScenarios
     */
    @PostMapping(path = "/update-master-scenarios", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateMasterScenariosOutDTO> updateMasterScenarios(
            @RequestBody UpdateMasterScenariosRequest request) {
        return ResponseEntity
                .ok(mastersScenariosService.updateMasterScenarios(request.getScenarioId(), request.getScenarioName(),
                        request.getUpdatedDate(), request.getDeletedScenarios(), request.getMilestones()));
    }

}
