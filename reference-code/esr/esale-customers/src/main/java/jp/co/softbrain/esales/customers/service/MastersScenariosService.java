package jp.co.softbrain.esales.customers.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jp.co.softbrain.esales.customers.domain.MastersScenarios;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateMasterScenarioSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.GetMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterScenariosSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateMasterScenariosSubType2DTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveScenarioRequest;

/**
 * Service for managed {@link MastersScenarios}
 */
public interface MastersScenariosService {

    /**
     * Save a Scenarios
     *
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public MastersScenariosDTO save(MastersScenariosDTO dto);

    /**
     * Delete the Scenarios by id
     *
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one Scenarios by id
     *
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<MastersScenariosDTO> findOne(Long id);

    /**
     * Get all the Scenarios
     *
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<MastersScenariosDTO> findAll(Pageable pageable);

    /**
     * Get all the Scenarios
     *
     * @return the list of the entities
     */
    public List<MastersScenariosDTO> findAll();

    /**
     * getMasterScenario : getMasterScenario
     *
     * @param scenarioId : scenario id
     * @return GetMasterScenariosOutDTO : DTO out for API getMasterScenario
     */
    public MasterScenariosSubType1DTO getMasterScenario(Long scenarioId);

    /**
     * getMasterScenarios : get Master Scenarios
     *
     * @return GetMasterScenariosOutDTO : DTO out for API getMasterScenarios
     */
    GetMasterScenariosOutDTO getMasterScenarios();

    /**
     * updateMasterScenarios : update master scenarios
     *
     * @param scenarioId : scenario id
     * @param scenarioName : scenario name
     * @param updatedDate : updated date
     * @param deletedScenarios : list scenario detail id
     * @param milestones : milestones
     * @return UpdateMasterScenariosOutDTO : DTO out for API
     *         updateMasterScenarios
     */
    UpdateMasterScenariosOutDTO updateMasterScenarios(Long scenarioId, String scenarioName, Instant updatedDate,
            List<Long> deletedScenarios, List<UpdateMasterScenariosSubType2DTO> milestones);

    /**
     * Create Master Scenario
     *
     * @param scenarioName
     * @param milestones
     * @return the Entity
     */
    CreateMasterScenarioOutDTO createMasterScenario(String scenarioName,
            List<CreateMasterScenarioSubTypeDTO> milestones);

    /**
     * Create Master Scenario
     *
     * @param scenarioId
     * @return Entity delete
     */
    CreateMasterScenarioOutDTO deleleMasterScenario(Long scenarioId);

    /**
     * Save scenario
     * 
     * @param request
     *            request of scenario
     * @return scenarioId
     */
    public Long saveScenario(SaveScenarioRequest request);
}
