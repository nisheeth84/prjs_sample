package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersList;
import jp.co.softbrain.esales.customers.service.dto.CreateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetListSuggestionsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeListModalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListOutDTO;

/**
 * Service Interface for managing {@link CustomersList}
 * 
 * @author PhamMinhPhu
 */
@XRayEnabled
public interface CustomersListService {

    /**
     * Save a CustomersList
     * 
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersListDTO save(CustomersListDTO dto);

    /**
     * Delete the CustomersList by id
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one CustomersList by id
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersListDTO> findOne(Long id);

    /**
     * Get all the CustomersList
     * 
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersListDTO> findAll(Pageable pageable);

    /**
     * Get all the CustomersList
     * 
     * @return the list of the entities
     */
    public List<CustomersListDTO> findAll();

    /**
     * Get information to display Initialize List Modal 
     * 
     * @param customerListId
     * @param isAutoList
     * @return the InitializeListModalResponse
     */
    public InitializeListModalResponseDTO getInitializeListModal(Long customerListId, Boolean isAutoList);

    /**
     * Create list from listParams
     * 
     * @param listParams - the param of list
     * @return object contains response
     */
    public CreateListOutDTO createList(CreateListInDTO listParams);

    /**
     * Update list from listParams
     * 
     * @param listParams - the param of list update
     * @return object contains response
     */
    public UpdateListOutDTO updateList(UpdateListInDTO listParams);

    /**
     * Get the list of favorite customers
     * 
     * @param customerListFavouriteId - Favorite group list
     * @param employeeId - employee id
     * @return the entity
     */
    public GetFavoriteCustomersOutDTO getFavoriteCustomers(List<Long> customerListFavouriteId, Long employeeId);

    /**
     * deleteList
     *
     * @param customerListId : customerListId get from request
     * @return Long - customerListId
     */
    public Long deleteList(Long customerListId);

    /**
     * get List Suggestions
     * 
     * @param searchValue search value
     * @return GetListSuggestionsOutDTO list suggestion
     */
    public GetListSuggestionsOutDTO getListSuggestions(String searchValue);
}
