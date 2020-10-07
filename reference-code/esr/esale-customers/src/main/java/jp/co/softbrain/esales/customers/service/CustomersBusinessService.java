package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersBusiness;
import jp.co.softbrain.esales.customers.service.dto.CustomersBusinessDTO;
import jp.co.softbrain.esales.customers.service.dto.GetSpecialItemsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeEditModeOutDTO;

/**
 * Service Interface for managing {@link CustomersBusiness}
 */
@XRayEnabled
public interface CustomersBusinessService {

    /**
     * Save a {@link CustomersBusiness}
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersBusinessDTO save(CustomersBusinessDTO dto);

    /**
     * Delete the {@link CustomersBusiness} by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one {@link CustomersBusiness} by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersBusinessDTO> findOne(Long id);

    /**
     * Get all the {@link CustomersBusiness}
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersBusinessDTO> findAll(Pageable pageable);

    /**
     * Get all the {@link CustomersBusiness}
     * 
     * @return the list of the entities
     */
    public List<CustomersBusinessDTO> findAll();

    /**
     * Get all customer's business informations
     * 
     * @return - object contains data
     */
    public InitializeEditModeOutDTO initializeEditMode();

    /**
     * get Special Items
     * @return GetSpecialItemsOutDTO special items
     */
    public GetSpecialItemsOutDTO getSpecialItems();
}
