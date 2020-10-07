package jp.co.softbrain.esales.commons.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsResponseDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.FieldInfoTab}.
 */
@XRayEnabled
public interface FieldInfoTabService {

    /**
     * Save a fieldInfoTab.
     *
     * @param fieldInfoTabDTO the entity to save.
     * @return the persisted entity.
     */
    FieldInfoTabDTO save(FieldInfoTabDTO fieldInfoTabDTO);

    /**
     * Get all the fieldInfoTabs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FieldInfoTabDTO> findAll(Pageable pageable);


    /**
     * Get the "id" fieldInfoTab.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FieldInfoTabDTO> findByFieldInfoTabId(Long id);

    /**
     * Delete the "id" fieldInfoTab.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get list of items and the order displayed in the list on the details
     * screen
     * 
     * @param tabBelong Functional use
     * @param tabId Usage tab
     * @return list field item
     */
    GetFieldInfoTabsResponseDTO getFieldInfoTabs(Integer tabBelong, Integer tabId);

}
