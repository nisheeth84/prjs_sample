package jp.co.softbrain.esales.commons.service;

import jp.co.softbrain.esales.commons.service.dto.UserStatusDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.UserStatus}.
 */
@XRayEnabled
public interface UserStatusService {

    /**
     * Save a userStatus.
     *
     * @param userStatusDTO the entity to save.
     * @return the persisted entity.
     */
    UserStatusDTO save(UserStatusDTO userStatusDTO);

    /**
     * Get all the userStatuses.
     *
     * @return the list of entities.
     */
    List<UserStatusDTO> findAll();

    /**
     * Get the "id" userStatus.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserStatusDTO> findOne(Long id);

    /**
     * Delete the "id" userStatus.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
