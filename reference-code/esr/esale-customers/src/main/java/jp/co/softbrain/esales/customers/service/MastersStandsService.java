package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersStands;
import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMasterStandsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO;

/**
 * Service Interface for managing {@link MastersStands}
 * 
 * @author phamminhphu
 *
 */
@XRayEnabled
public interface MastersStandsService {

    /**
     * Save a MastersStands
     * 
     * @param dto the entity to save
     * @return the persisted entity
     */
    public MastersStandsDTO save(MastersStandsDTO dto);

    /**
     * Delete the MastersStands by id
     * 
     * @param id the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one MastersStands by id
     * 
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<MastersStandsDTO> findOne(Long id);

    /**
     * Get all the MastersStands
     * 
     * @return the list of the entities
     */
    public List<MastersStandsDTO> findAll();

    /**
     * Get all the MastersStands with isAvailable
     * 
     * @return the list of the entities
     */
    public List<MastersStandsDTO> findByIsAvailable(Boolean isAvailable);

    /**
     * Check Delete Master Stands by masterStandIds
     *
     * @param masterStandIds : Pass to a list id of masterStandIds
     * @return List Id of Delete Master Stands
     */
    CheckDeteleMasterStandsOutDTO checkDeleteMasterStands(List<Long> masterStandIds);
}
