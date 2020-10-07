package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.MenuFavorite;
import jp.co.softbrain.esales.commons.service.dto.CreateServiceFavoriteOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceFavoriteOutDTO;

/**
 * Service Interface for managing {@link MenuFavorite}.
 * 
 * @author TuanLV
 */
@XRayEnabled
public interface MenuFavoriteService {

    /**
     * Save a menuFavorite.
     *
     * @param menuFavorite the entity to save.
     * @return the persisted entity.
     */
    MenuFavorite save(MenuFavorite menuFavorite);

    /**
     * Get all the menuFavorites.
     *
     * @return the list of entities.
     */
    List<MenuFavorite> findAll();

    /**
     * Get the "id" menuFavorite.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MenuFavorite> findOne(Long id);

    /**
     * Delete the "id" menuFavorite.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Create Service Favorite
     *
     * @param employeeId
     * @param serviceId
     * @param serviceName
     * @return CreateServiceFavoriteResponse : serviceId
     */
    CreateServiceFavoriteOutDTO createServiceFavorite(Long employeeId, Long serviceId, String serviceName);

    /**
     * Delete Service Favorite
     *
     * @param employeeId
     * @param getServiceId
     * @return
     */
    CreateServiceFavoriteOutDTO deleteServiceFavorite(Long employeeId, Long getServiceId);

    /**
     * Get Service Favorite
     *
     * @param employeeId
     * @return data
     */
    GetServiceFavoriteOutDTO getServiceFavorite(Long employeeId);
}
