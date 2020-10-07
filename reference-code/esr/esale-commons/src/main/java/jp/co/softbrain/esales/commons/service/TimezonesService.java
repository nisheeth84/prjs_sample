package jp.co.softbrain.esales.commons.service;

import jp.co.softbrain.esales.commons.service.dto.TimezonesDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.Timezones}.
 * 
 * @author phamminhphu
 *
 */
@XRayEnabled
public interface TimezonesService {

    /**
     * Save a timezones.
     *
     * @param timezonesDTO the entity to save.
     * @return the persisted entity.
     */
    TimezonesDTO save(TimezonesDTO timezonesDTO);

    /**
     * Get all the timezones.
     *
     * @return the list of entities.
     */
    List<TimezonesDTO> findAll();


    /**
     * Get timezones by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TimezonesDTO> findOne(Long id);

    /**
     * Delete timezones by primary key.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get all the timezones order by display order.
     *
     * @return the list of entities.
     */
    List<TimezonesDTO> findAllDisplayOrder();
}
