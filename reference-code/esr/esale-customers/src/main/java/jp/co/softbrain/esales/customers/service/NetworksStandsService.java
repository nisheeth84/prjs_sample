package jp.co.softbrain.esales.customers.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.service.dto.GetProductTradingIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO;
import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapInDTO;
import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveNetworkMapRequest;

/**
 * Service Interface for managing {@link NetworksStands}
 * 
 * @author phamminhphu
 */
@XRayEnabled
public interface NetworksStandsService {

    /**
     * Save a NetworksStands
     * 
     * @param dto the entity to save
     * @return the persisted entity
     */
    public NetworksStandsDTO save(NetworksStandsDTO dto);

    /**
     * Delete the NetworksStands by id
     * 
     * @param id the id of the entity
     */
    public void delete(Long id);

    /**
     * Get one NetworksStands by id
     * 
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<NetworksStandsDTO> findOne(Long id);

    /**
     * Get all the NetworksStands
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    public Page<NetworksStandsDTO> findAll(Pageable pageable);

    /**
     * Get all the NetworksStands
     * 
     * @return the list of the entities
     */
    public List<NetworksStandsDTO> findAll();

    /**
     * Add a Network Stand
     * 
     * @param networksStands the parameter info
     * @return the id of NetworkStand added
     */
    public Long addNetworkStand(NetworksStandsDTO networksStands);

    /**
     * Update a Network Stand
     * 
     * @param networksStands the parameter info
     * @return the id of NetworkStand added
     */
    public Long updateNetworkStand(NetworksStandsDTO networksStands);

    /**
     * Delete a Network Stand
     * 
     * @param networkStandId the parameter info
     * @return the id of NetworkStand added
     */
    public Long deleteNetworkStand(Long networkStandId);

    /**
     * remove business cards from network map
     * 
     * @pram businessCardCompanyId - business card companyId to remove
     * @param departments - business card department to remove
     * @return RemoveBusinessCardsOutOfNetworkMapOutDTO
     */
    public RemoveBusinessCardsOutOfNetworkMapOutDTO removeBusinessCardsOutOfNetworkMap(Long businessCardCompanyId,
            List<RemoveBusinessCardsOutOfNetworkMapInDTO> departments);

    /**
     * Get all the NetworksStands with businessCardId
     * 
     * @return the list of the entities
     */
    public List<NetworksStandsDTO> findByBusinessCardId(Long businessCardId);

    /**
     * Initialize Network Map with customerId
     * 
     * @param customerId the id of customer
     * @param langKey language of user login
     * @return the data response InitializeNetworkMapOutDTO
     */
    public InitializeNetworkMapOutDTO initializeNetworkMap(Long customerId, String langKey);

    /**
     * Save net work map
     * 
     * @pram request customer update network map
     * @return List<Long> list stand id inserted
     */
    public List<Long> saveNetworkMap(SaveNetworkMapRequest request);

    /**
     * get product trading ids
     * 
     * @param networkStandIs
     *            -networkStandIs
     * @return the entity response
     */
    public GetProductTradingIdsOutDTO getProductTradingIds(List<Long> businessCardIds);
}
