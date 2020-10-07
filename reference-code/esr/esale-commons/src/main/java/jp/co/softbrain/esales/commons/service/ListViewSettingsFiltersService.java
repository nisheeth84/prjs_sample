package jp.co.softbrain.esales.commons.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.ListViewSettingsFilters;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;

/**
 * Service Interface for managing {@link ListViewSettingsFilters}
 * 
 * @author nguyenvanchien3
 */
@XRayEnabled
public interface ListViewSettingsFiltersService {

    /**
     * Save a ListViewSettingsFilters
     * 
     * @param listViewSettingsFiltersDTO - entity to save
     * @return the persisted entity.
     */
    public ListViewSettingsFiltersDTO save(ListViewSettingsFiltersDTO listViewSettingsFiltersDTO);

    /**
     * Get all the ListViewSettingsFilters
     * 
     * @param pageable - the pagination information.
     * @return the list of entities.
     */
    public Page<ListViewSettingsFiltersDTO> findAll(Pageable pageable);

    /**
     * Get the "id" ListViewSettingsFilters
     * 
     * @param id - the id of the entity
     * @return - the entity
     */
    public Optional<ListViewSettingsFiltersDTO> findOne(Long id);

    /**
     * Delete the "id" ListViewSettingsFilters
     * 
     * @param id - the id of the entity
     */
    public void delete(Long id);
}
