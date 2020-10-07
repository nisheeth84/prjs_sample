package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListMembers;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToAutoListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToListOutSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMemberIdsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMembersDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerListIdOutResponse;

/**
 * Service Interface for managing {@link CustomersListMembers}
 * 
 * @author nguyenvanchien3
 */
@XRayEnabled
public interface CustomersListMembersService {

    /**
     * Save a CustomersListMembers
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersListMembersDTO save(CustomersListMembersDTO dto);

    /**
     * Delete the CustomersListMembers by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one CustomersListMembers by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersListMembersDTO> findOne(Long id);

    /**
     * Get all the CustomersListMembers
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersListMembersDTO> findAll(Pageable pageable);

    /**
     * Get all the CustomersListMembers
     * 
     * @return the list of the entities
     */
    public List<CustomersListMembersDTO> findAll();

    /**
     * Add customers from list id to list
     * 
     * @param idList - id of the destination list
     * @param customerIds - list of customers
     * @return object contains response
     */
    public AddCustomersToListOutSubType1DTO addCustomersToList(Long customerListId, List<Long> customerIds);

    /**
     * Save all customers list members.
     *
     * @param customersListMembersDTOs list entity to save.
     * @return list persisted entity.
     */
    public List<CustomersListMembersDTO> saveAll(List<CustomersListMembersDTO> customersListMembersDTOs);
/**
     * delete Customer OutOfList
     * 
     * @param customerListId : customerListIds get from request
     * @param customerIds : customerIds get from request
     * @return CustomerIdsDTO containts list customerListId
     */
    public CustomerListIdOutResponse deleteCustomerOutOfList(Long customerListId, List<Long> customerIds);

    /**
     * move customers to other list
     * 
     * @param sourceListId : sourceListId get from request
     * @param destListId : destListId get from request
     * @param customerIds : customerIds get from request
     * @param updatedDate
     * @return CustomerIdsDTO list customerId
     */
    public CustomersListMemberIdsDTO moveCustomersToOtherList(Long sourceListId, Long destListId,
            List<Long> customerIds);

    /**
     * refreshAutoList
     *
     * @param idOfList get from request
     * @return AddCustomersToAutoListOutDTO customer list id added
     */
    public AddCustomersToAutoListOutDTO refreshAutoList(Long idOfList);

}
