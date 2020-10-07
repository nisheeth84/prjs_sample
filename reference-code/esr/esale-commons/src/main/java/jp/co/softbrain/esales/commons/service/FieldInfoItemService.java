package jp.co.softbrain.esales.commons.service;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import java.util.Optional;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.FieldInfoItem}.
 */
@XRayEnabled
public interface FieldInfoItemService {

    /**
     * Save a fieldInfoItem.
     *
     * @param fieldInfoItemDTO the entity to save.
     * @return the persisted entity.
     */
    FieldInfoItemDTO save(FieldInfoItemDTO fieldInfoItemDTO);

    /**
     * Get all the fieldInfoItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FieldInfoItemDTO> findAll(Pageable pageable);


    /**
     * Get the "id" fieldInfoItem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FieldInfoItemDTO> findByItemId(Long id);

    /**
     * Delete the "id" fieldInfoItem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
