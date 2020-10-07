package jp.co.softbrain.esales.customers.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CountCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CountRelationCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerAddressesOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutCustomResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.DeleteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerConnectionsMapDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerHistoryResponse;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdByCustomerNameOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsInfoCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetUrlQuicksightResponse;
import jp.co.softbrain.esales.customers.service.dto.MasterMotivationInDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterStandsInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateCustomerConnectionsMapOutDTO;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;

/**
 * Service Interface for managing {@link Customers}
 *
 * @author nguyenductruong
 */
@XRayEnabled
public interface CustomersService {

    /**
     * Save a Customers
     *
     * @param dto - the entity to save
     * @return the persisted entity
     */
    public CustomersDTO save(CustomersDTO dto);

    /**
     * Delete the Customers by id
     *
     * @param id - the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one Customers by id
     *
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<CustomersDTO> findOne(Long id);

    /**
     * Get all the Customers
     *
     * @param pageable - the pagination information
     * @return the list of entities
     */
    public Page<CustomersDTO> findAll(Pageable pageable);

    /**
     * Get all the Customers
     *
     * @return the list of the entities
     */
    public List<CustomersDTO> findAll();

    /**
     * get Child customer data
     *
     * @param customerId the customerId of the entity
     * @return the entity
     */
    public GetChildCustomersOutDTO getChildCustomers(Long customerId);

    /**
     * Get count the number of customers by employees with employeeId
     *
     * @param employeeId the employeeId of the entity
     * @return the entity
     */
    public CountCustomersOutDTO countCustomers(Long employeeId);

    /**
     * Get customer id by customer name
     *
     * @pram customerName - customerName
     * @return GetCustomerIdByCustomerNameOutDTO
     */
    public GetCustomerIdByCustomerNameOutDTO getCustomerIdByName(String customerName);

    /**
     * Get information on the conditions Customers looking to display list.
     * 
     * @param input - request contains conditions
     * @return data
     */
    public GetCustomersOutDTO getCustomers(CustomersSearchConditionsDTO input);

    /**
     * Get Customer
     *
     * @param param - param to get Customer
     * @return CustomerOutDTO
     */
    public GetCustomerOutDTO getCustomer(GetCustomerRequestDTO request);
    /**
     * Get data related to the customer to delete
     *
     * @param customerIds list of the customerId
     * @return list of the entity
     */
    public List<CountRelationCustomerOutDTO> getCountRelationCustomer(List<Long> customerIds);

    /**
     * Get data myList, data sharedList and data favouriteList for displayed in
     * the local menu the Client function
     *
     * @param mode mode
     * @param isFavourite isFavourite
     * @return object of class GetCustomerListOutDTO
     */
    public GetCustomerListOutDTO getCustomerList(Integer mode, Boolean isFavourite);
    /**
     * Get Customer information displayed on the employee details screen
     *
     * @param tabBelong id function
     * @param currentPage current page
     * @param limit limit
     * @param searchConditions the list entity of GetCustomersTabSubType1DTO
     * @param languageCode languageCode
     * @return the entity
     */
    public GetCustomersTabOutDTO getCustomersTab(Integer tabBelong, Integer currentPage, Integer limit,
            List<GetCustomersTabSubType1DTO> searchConditions, String languageCode);

    /**
     * Delete customers in list
     *
     * @param customerIds - list contains IDs of customer
     * @return - out DTO object
     */
    public DeleteCustomersOutDTO deleteCustomers(List<Long> customerIds);

    /**
     * Update latitude and longitude by customerId
     *
     * @param customerId - id of the entity
     * @param latitude - new value of latitude
     * @param longitude - new value of longitude
     * @param updatedDate - updatedDate to check exclusive
     * @return - id has been updated
     */
    public Long updateGeocodingCustomer(Long customerId, BigDecimal latitude, BigDecimal longitude,
            Instant updatedDate);

    /**
     * Get list address by list customerIds
     *
     * @param customerIds - list id customers
     * @return object contains data
     */
    public CustomerAddressesOutDTO getCustomerAddresses(List<Long> customerIds);

    /**
     * Get data for each scenario of milestone screen
     *
     * @param customerId - customer id to get data
     * @return object contains data
     */
    public GetScenarioOutDTO getScenario(Long customerId);

    /**
     * Get customer information according to search criteria to display pulldown
     *
     * @param keywords
     *            keywords
     * @param offset
     *            offset
     * @param listIdChoice
     *            id of customers choiced
     * @param relationFieldId
     *            relationFieldId
     * @return the entity of GetCustomerSuggestionOutDTO
     */
    public GetCustomerSuggestionOutDTO getCustomerSuggestion(String keywords, Integer offset,
            List<Long> listIdChoice, Long relationFieldId);

    /**
     * Get information for customer screen
     *
     * @return list informations for default item and extension items
     */
    public CustomerLayoutCustomResponseDTO getCustomerLayout();

    /**
     * get list customer by list customerIds
     *
     * @param customerIds - list customerId
     * @param langKey - language of user login
     * @return list customer
     */
    public List<GetCustomersByIdsInfoCustomerDTO> getCustomersByIds(List<Long> customerIds);

    /**
     * Get Customer Connections Map
     *
     * @return List masterMotivations and mastersStands
     */
    GetCustomerConnectionsMapDTO getCustomerConnectionsMap();

    /**
     * Check Delete Master Stands by masterStandIds
     *
     * @param scenarios : Pass to a list id of scenarios
     * @return List Id of Delete Master Stands
     */
    CheckDeteleMasterScenariosOutDTO checkDeleteMasterScenarios(List<Long> scenarioIds);

    /**
     * update Customer Connections Map
     *
     * @param updateCustomerConnectionsMapDTO : the DTO for update
     * @return UpdateCustomerConnectionsMapOutDTO : response of API updateCustomerConnectionsMap
     */
    UpdateCustomerConnectionsMapOutDTO updateCustomerConnectionsMap(List<Long> deletedMasterMotivations,
                                                                    List<MasterMotivationInDTO> masterMotivations, List<Long> deletedMasterStands,
                                                                    List<MasterStandsInDTO> masterStands, List<FileMappingDTO> files) throws IOException;

    /**
     * Get customer layout personal
     * 
     * @param request request
     * @return - response
     */
    public CustomerLayoutPersonalResponseDTO getCustomerLayoutPersonal(CustomerLayoutPersonalRequestDTO request);

    /**
     * Get customer id
     *
     * @param customerName - customerName
     * @return GetCustomerIdOutDTO the entity response
     */
    public GetCustomerIdOutDTO getCustomerId(String customerName);

    /**
     * Get URL Quick sight
     *
     * @param customerId
     * @return GetUrlQuicksightResponse
     */
    public GetUrlQuicksightResponse getUrlQuicksight(Long customerId);

    /**
     * Save all customer list
     * 
     * @param customersDTOList
     */
    public List<CustomersDTO> saveAll(List<CustomersDTO> customersDTOList);

    /**
     * Get Customer History
     *
     * @param customerId
     * @param currentPage
     * @param limit
     * @return GetCustomerHistoryResponse
     */
    public GetCustomerHistoryResponse getCustomerHistory(Long customerId, Integer currentPage, Integer limit);
}
