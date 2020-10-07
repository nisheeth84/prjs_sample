package jp.co.softbrain.esales.commons.service;

import jp.co.softbrain.esales.commons.service.dto.DateFormatsDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.DateFormats}.
 */
@XRayEnabled
public interface DateFormatsService {

    /**
     * Save a dateFormats.
     *
     * @param dateFormatsDTO the entity to save.
     * @return the persisted entity.
     */
    DateFormatsDTO save(DateFormatsDTO dateFormatsDTO);

    /**
     * Get all the dateFormats.
     *
     * @return the list of entities.
     */
    List<DateFormatsDTO> findAll();

    /**
     * Get the "id" dateFormats.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DateFormatsDTO> findOne(Long id);

    /**
     * Delete the "id" dateFormats.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
