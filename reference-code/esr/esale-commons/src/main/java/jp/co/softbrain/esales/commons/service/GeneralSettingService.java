package jp.co.softbrain.esales.commons.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.GeneralSetting;
import jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateGeneralSettingOutDTO;

/**
 * Service Interface for managing {@link GeneralSetting}
 *
 * @author phamminhphu
 */
@XRayEnabled
public interface GeneralSettingService {

    /**
     * Save a GeneralSetting
     *
     * @param generalSettingDTO entity to save
     * @return the persisted entity.
     */
    public GeneralSettingDTO save(GeneralSettingDTO generalSettingDTO);

    /**
     * Get all the GeneralSetting
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<GeneralSettingDTO> findAll(Pageable pageable);

    /**
     * Get the "id" GeneralSetting
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<GeneralSettingDTO> findOne(Long id);

    /**
     * Delete the "id" GeneralSetting
     *
     * @param id the id of the entity
     */
    public void delete(Long id);

    /**
     * Get setting info by setting name
     *
     * @param settingName the name of settting
     * @return the list DTO response
     */
    GeneralSettingDTO getGeneralSetting(String settingName);

    /**
     * update General Setting
     *
     * @param generalSettingId : general Setting Id
     * @param settingName : setting Name
     * @param settingValue : setting Value
     * @return the list DTO response
     */
    UpdateGeneralSettingOutDTO updateGeneralSetting(Long generalSettingId, String settingName, String settingValue , Instant updatedDate);
}
