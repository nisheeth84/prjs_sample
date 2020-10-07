package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoInDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.UserPoolDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.tenants.domain.CognitoSettings}.
 */
public interface CognitoSettingsService {

    /**
     * Save a cognitoSettings.
     *
     * @param cognitoSettingsDTO the entity to save.
     * @return the persisted entity.
     */
    CognitoSettingsDTO save(CognitoSettingsDTO cognitoSettingsDTO);

    /**
     * Get all the cognitoSettings.
     *
     * @return the list of entities.
     */
    List<CognitoSettingsDTO> findAll();

    /**
     * Get the "id" cognitoSettings.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CognitoSettingsDTO> findOne(Long id);

    /**
     * Delete the "id" cognitoSettings.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * get last record
     *
     * @return {@link CognitoSettingInfoDTO}
     */
    CognitoSettingInfoDTO getCognitoSetting();

    /**
     * get user pool id
     *
     * @return
     */
    UserPoolDTO getUserPool();

    /**
     *
     * @param data : data parameter
     * @param file : file
     * @return UpdateCognitoOutDTO : cognitoSettingId
     */
    UpdateCognitoOutDTO updateCognitoSetting(UpdateCognitoInDTO data, List<MultipartFile> metaData , List<String> filesMap);

}
