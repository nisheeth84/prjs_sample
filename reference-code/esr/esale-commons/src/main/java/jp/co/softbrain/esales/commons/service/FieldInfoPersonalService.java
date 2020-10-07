package jp.co.softbrain.esales.commons.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.FieldInfoPersonal}.
 */
@XRayEnabled
public interface FieldInfoPersonalService {

    /**
     * Save a fieldInfoPersonal.
     *
     * @param fieldInfoPersonalDTO the entity to save.
     * @return the persisted entity.
     */
    FieldInfoPersonalDTO save(FieldInfoPersonalDTO fieldInfoPersonalDTO);

    /**
     * Get all the fieldInfoPersonals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FieldInfoPersonalDTO> findAll(Pageable pageable);


    /**
     * Get the "id" fieldInfoPersonal.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FieldInfoPersonalDTO> findOne(Long id);

    /**
     * Delete the "id" fieldInfoPersonal.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
