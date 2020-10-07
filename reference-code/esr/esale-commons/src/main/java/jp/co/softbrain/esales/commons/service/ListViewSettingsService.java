package jp.co.softbrain.esales.commons.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateListViewSettingInDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.ListViewSettings}
 * 
 * @author nguyenvanchien3
 */
@XRayEnabled
public interface ListViewSettingsService {

    /**
     * Save a ListViewSetting
     * 
     * @param listViewSettingsDTO - the entity to save
     * @return the persisted entity.
     */
    public ListViewSettingsDTO save(ListViewSettingsDTO listViewSettingsDTO);

    /**
     * Get the "id" listViewSetting
     * 
     * @param id - the id of the entity
     * @return the entity
     */
    public Optional<ListViewSettingsDTO> findOne(Long id);

    /**
     * Get all the listViewSettings
     * 
     * @param pageable - the pagination information.
     * @return the list of entities.
     */
    public Page<ListViewSettingsDTO> findAll(Pageable pageable);

    /**
     * Delete the "id" listViewSetting
     * 
     * @param id - id the id of the entity.
     */
    public void delete(Long id);

    /**
     * Update informations on display list
     * 
     * @param input - object contains data input
     * @return updated status.
     */
    public String updateListViewSetting(UpdateListViewSettingInDTO input);

    /**
     * Get initialize list info
     * 
     * @param fieldBelong fieldBelong
     * @param employeeId employeeId from token
     * @param languageCode languageCode from token
     * @return information create list screen.
     */
    public GetInitializeListInfoOutDTO getInitializeListInfo(Integer fieldBelong, Long employeeId, String languageCode);
}
