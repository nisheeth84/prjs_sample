package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO;

/**
 * Service Interface for managing {@link CustomersHistories}
 * 
 * @author buithingocanh
 */
@XRayEnabled
public interface CustomersHistoriesService {

    /**
     * Save a CustomersHistories
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersHistoriesDTO save(CustomersHistoriesDTO dto);

    /**
     * Delete the CustomersHistories by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one CustomersHistories by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersHistoriesDTO> findOne(Long id);

    /**
     * Get all the CustomersHistories
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersHistoriesDTO> findAll(Pageable pageable);

    /**
     * Get all the CustomersHistories
     * 
     * @return the list of the entities
     */
    public List<CustomersHistoriesDTO> findAll();

    /**
     * Delete all record by given customerId
     * 
     * @param customerId - id customer to delete
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerId(Long customerId);

    /**
     * Save all customer history
     * 
     * @param customerHistoryList
     *            list dto
     * @return list dto saved
     */
    public List<CustomersHistoriesDTO> saveAll(List<CustomersHistoriesDTO> customerHistoryList);
}
