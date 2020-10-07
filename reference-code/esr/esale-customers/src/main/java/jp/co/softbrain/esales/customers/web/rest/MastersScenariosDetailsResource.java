package jp.co.softbrain.esales.customers.web.rest;

import jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService;
import jp.co.softbrain.esales.customers.web.rest.errors.BadRequestAlertException;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDetailsDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link jp.co.softbrain.esales.customers.domain.MastersScenariosDetails}.
 */
@RestController
@RequestMapping("/api")
public class MastersScenariosDetailsResource {

    private final Logger log = LoggerFactory.getLogger(MastersScenariosDetailsResource.class);

    private static final String ENTITY_NAME = "customersMastersScenariosDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MastersScenariosDetailsService mastersScenariosDetailsService;

    public MastersScenariosDetailsResource(MastersScenariosDetailsService mastersScenariosDetailsService) {
        this.mastersScenariosDetailsService = mastersScenariosDetailsService;
    }

    /**
     * {@code POST  /masters-scenarios-details} : Create a new mastersScenariosDetails.
     *
     * @param mastersScenariosDetailsDTO the mastersScenariosDetailsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mastersScenariosDetailsDTO, or with status {@code 400 (Bad Request)} if the mastersScenariosDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/masters-scenarios-details")
    public ResponseEntity<MastersScenariosDetailsDTO> createMastersScenariosDetails(@Valid @RequestBody MastersScenariosDetailsDTO mastersScenariosDetailsDTO) throws URISyntaxException {
        log.debug("REST request to save MastersScenariosDetails : {}", mastersScenariosDetailsDTO);
        if (mastersScenariosDetailsDTO.getScenarioDetailId() != null) {
            throw new BadRequestAlertException("A new mastersScenariosDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MastersScenariosDetailsDTO result = mastersScenariosDetailsService.save(mastersScenariosDetailsDTO);
        return ResponseEntity.created(new URI("/api/masters-scenarios-details/" + result.getScenarioDetailId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getScenarioDetailId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /masters-scenarios-details} : Updates an existing mastersScenariosDetails.
     *
     * @param mastersScenariosDetailsDTO the mastersScenariosDetailsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mastersScenariosDetailsDTO,
     * or with status {@code 400 (Bad Request)} if the mastersScenariosDetailsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mastersScenariosDetailsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/masters-scenarios-details")
    public ResponseEntity<MastersScenariosDetailsDTO> updateMastersScenariosDetails(@Valid @RequestBody MastersScenariosDetailsDTO mastersScenariosDetailsDTO) throws URISyntaxException {
        log.debug("REST request to update MastersScenariosDetails : {}", mastersScenariosDetailsDTO);
        if (mastersScenariosDetailsDTO.getScenarioDetailId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MastersScenariosDetailsDTO result = mastersScenariosDetailsService.save(mastersScenariosDetailsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mastersScenariosDetailsDTO.getScenarioDetailId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /masters-scenarios-details} : get all the mastersScenariosDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mastersScenariosDetails in body.
     */
    @GetMapping("/masters-scenarios-details")
    public List<MastersScenariosDetailsDTO> getAllMastersScenariosDetails() {
        log.debug("REST request to get all MastersScenariosDetails");
        return mastersScenariosDetailsService.findAll();
    }

    /**
     * {@code GET  /masters-scenarios-details/:id} : get the "id" mastersScenariosDetails.
     *
     * @param id the id of the mastersScenariosDetailsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mastersScenariosDetailsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/masters-scenarios-details/{id}")
    public ResponseEntity<MastersScenariosDetailsDTO> getMastersScenariosDetails(@PathVariable Long id) {
        log.debug("REST request to get MastersScenariosDetails : {}", id);
        Optional<MastersScenariosDetailsDTO> mastersScenariosDetailsDTO = mastersScenariosDetailsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mastersScenariosDetailsDTO);
    }

    /**
     * {@code DELETE  /masters-scenarios-details/:id} : delete the "id" mastersScenariosDetails.
     *
     * @param id the id of the mastersScenariosDetailsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/masters-scenarios-details/{id}")
    public ResponseEntity<Void> deleteMastersScenariosDetails(@PathVariable Long id) {
        log.debug("REST request to delete MastersScenariosDetails : {}", id);
        mastersScenariosDetailsService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
