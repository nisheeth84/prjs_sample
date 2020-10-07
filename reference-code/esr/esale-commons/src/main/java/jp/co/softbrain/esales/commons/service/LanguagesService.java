package jp.co.softbrain.esales.commons.service;

import jp.co.softbrain.esales.commons.service.dto.LanguagesDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.Language}.
 */
@XRayEnabled
public interface LanguagesService {

    /**
     * Save a language.
     *
     * @param languageDTO the entity to save.
     * @return the persisted entity.
     */
    LanguagesDTO save(LanguagesDTO languageDTO);

    /**
     * Get all the languages.
     *
     * @return the list of entities.
     */
    List<LanguagesDTO> findAll();

    /**
     * Get the "id" language.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LanguagesDTO> findOne(Long id);

    /**
     * Delete the "id" language.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get all the languages order by displayOrder.
     *
     * @return the list of languages order by displayOrder.
     */
    List<LanguagesDTO> findAllByOrderByDisplayOrderAsc();
}
