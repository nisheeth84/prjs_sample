package jp.co.softbrain.esales.uaa.service;

import jp.co.softbrain.esales.uaa.service.dto.UaPasswordResetAuthKeyDTO;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.uaa.domain.UaPasswordResetAuthKey}.
 */
@XRayEnabled
public interface UaPasswordResetAuthKeyService {

    /**
     * Save a uaPasswordResetAuthKey.
     *
     * @param uaPasswordResetAuthKeyDTO the entity to save.
     * @return the persisted entity.
     */
    UaPasswordResetAuthKeyDTO save(UaPasswordResetAuthKeyDTO uaPasswordResetAuthKeyDTO);

    /**
     * Get all the uaPasswordResetAuthKeys.
     *
     * @return the list of entities.
     */
    List<UaPasswordResetAuthKeyDTO> findAll();


    /**
     * Get the "id" uaPasswordResetAuthKey.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UaPasswordResetAuthKeyDTO> findOne(Long id);

    /**
     * Delete the "id" uaPasswordResetAuthKey.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * check key reset password
     *
     * @param key
     * @return
     */
    Optional<UaPasswordResetAuthKeyDTO> checkKeyPasswordReset(String key);
}
