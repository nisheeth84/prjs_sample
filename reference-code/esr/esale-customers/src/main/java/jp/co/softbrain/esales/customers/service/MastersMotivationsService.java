package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;

import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMastersMotivationsOutDTO;

/**
 * Service Interface for managing {@link MastersMotivations}
 * 
 * @author phamminhphu
 *
 */
@XRayEnabled
public interface MastersMotivationsService {

    /**
     * Save a MastersMotivations
     * 
     * @param dto the entity to save
     * @return the persisted entity
     */
    public MastersMotivationsDTO save(MastersMotivationsDTO dto);

    /**
     * Delete the MastersMotivations by id
     * 
     * @param id the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one MastersMotivations by id
     * 
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<MastersMotivationsDTO> findOne(Long id);

    /**
     * Get all the MastersMotivations
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    public Page<MastersMotivationsDTO> findAll(Pageable pageable);

    /**
     * Get all the MastersMotivations
     * 
     * @return the list of the entities
     */
    public List<MastersMotivationsDTO> findAll();

    /**
     * Get all the MastersMotivations with isAvailable
     * 
     * @return the list of the entities
     */
    public List<MastersMotivationsDTO> findByIsAvailable(Boolean isAvailable);


    /**
     * CheckDeleteMasterMotivations : get master motivation id by list id
     *
     * @param masterMotivationIds : list id of masterMotivation
     * @return the entity
     */
    CheckDeteleMastersMotivationsOutDTO checkDeleteMasterMotivations(List<Long> masterMotivationIds);
}
