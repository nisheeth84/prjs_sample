package jp.co.softbrain.esales.uaa.service;

import jp.co.softbrain.esales.uaa.service.dto.UaPasswordHistoriesDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.uaa.domain.UaPasswordHistories}.
 */
@XRayEnabled
public interface UaPasswordHistoriesService {

    /**
     * Save a uaPasswordHistories.
     *
     * @param uaPasswordHistoriesDTO the entity to save.
     * @return the persisted entity.
     */
    UaPasswordHistoriesDTO save(UaPasswordHistoriesDTO uaPasswordHistoriesDTO);

    /**
     * Get all the uaPasswordHistories.
     *
     * @return the list of entities.
     */
    List<UaPasswordHistoriesDTO> findAll();


    /**
     * Get the "id" uaPasswordHistories.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UaPasswordHistoriesDTO> findOne(Long id);

    /**
     * Delete the "id" uaPasswordHistories.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
