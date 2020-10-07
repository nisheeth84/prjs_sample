package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.CustomersListParticipantsDTO;

/**
 * Service Interface for managing {@link CustomersListParticipantsService}
 * 
 * @author phamminhphu
 *
 */
@XRayEnabled
public interface CustomersListParticipantsService {

    /**
     * Save a CustomersListParticipants
     * 
     * @param dto the entity to save
     * @return the persisted entity
     */
    public CustomersListParticipantsDTO save(CustomersListParticipantsDTO dto);

    /**
     * Delete the CustomersListParticipants by id
     * 
     * @param id the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one CustomersListParticipants by id
     * 
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<CustomersListParticipantsDTO> findOne(Long id);

    /**
     * Get all the CustomersListParticipants
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    public Page<CustomersListParticipantsDTO> findAll(Pageable pageable);

    /**
     * Get all the CustomersListParticipants
     * 
     * @return the list of the entities
     */
    public List<CustomersListParticipantsDTO> findAll();

    /**
     * Save all customers list participants list.
     *
     * @param customersListParticipantsDTOs list entity to save.
     * @return list persisted entity.
     */
    public List<CustomersListParticipantsDTO> saveAll(List<CustomersListParticipantsDTO> customersListParticipantsDTOs);

    /**
     * Get all CustomersListParticipants with customerListId
     * 
     * @param customerListId the condition
     * @return the DTO of CustomersListParticipants
     */
    public List<CustomersListParticipantsDTO> getListParticipants(Long customerListId);

    /**
     * Delete employeesGroupSearchConditions by groupId
     * 
     * @param groupId the id of the entity
     */
    public void deleteByCustomerListId(Long cutomersListId);
}
