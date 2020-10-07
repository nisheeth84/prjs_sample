package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDetailsDTO;

/**
 * Service for manage {@link MastersScenariosDetails}
 */
@XRayEnabled
public interface MastersScenariosDetailsService {

    /**
     * Save a ScenariosMilestones
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public MastersScenariosDetailsDTO save(MastersScenariosDetailsDTO dto);

    /**
     * Delete the ScenariosMilestones by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one ScenariosMilestones by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<MastersScenariosDetailsDTO> findOne(Long id);

    /**
     * Get all the ScenariosMilestones
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<MastersScenariosDetailsDTO> findAll(Pageable pageable);

    /**
     * Get all the ScenariosMilestones
     * 
     * @return the list of the entities
     */
    public List<MastersScenariosDetailsDTO> findAll();

}
