package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.CustomersListSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetListSearchConditionInfoResponse;

/**
 * Service Interface for managing {@link CustomersListSearchConditionsService}
 * 
 * @author phamminhphu
 *
 */
@XRayEnabled
public interface CustomersListSearchConditionsService {

    /**
     * Save a CustomersListSearchConditions
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersListSearchConditionsDTO save(CustomersListSearchConditionsDTO dto);

    /**
     * Delete the CustomersListSearchConditions by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one CustomersListSearchConditions by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersListSearchConditionsDTO> findOne(Long id);

    /**
     * Get all the CustomersListSearchConditions
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersListSearchConditionsDTO> findAll(Pageable pageable);

    /**
     * Get all the CustomersListSearchConditions
     * 
     * @return the list of the entities
     */
    public List<CustomersListSearchConditionsDTO> findAll();

    /**
     * Save all customers list search condition list.
     *
     * @param cuListSearchConditionsDTOList list entity to save.
     * @return list persisted entity.
     */
    public List<CustomersListSearchConditionsDTO> saveAll(List<CustomersListSearchConditionsDTO> cuListSearchConditionsDTOList);

    /**
     * Get all CustomersListSearchConditions with customerListId
     * 
     * @param customerListId the condition
     * @return the list CustomersListSearchConditionsDTO 
     */
    public List<CustomersListSearchConditionsDTO> getListSearchConditions(Long customerListId);

    /**
     * Delete CustomersListSearchConditions by customerListId
     * 
     * @param customerListId the id of customersList
     */
    public void deleteByCustomerListId(Long customerListId);

    /**
     * Get list search condition info
     * 
     * @param listId
     *        the groupId of the entity
     * @return response of Employees Group Search Conditions
     */
    public GetListSearchConditionInfoResponse getListSearchConditionInfo(Long listId);
}
