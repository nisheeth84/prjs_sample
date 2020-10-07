package jp.co.softbrain.esales.uaa.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.uaa.service.dto.UaPasswordsDTO;
import jp.co.softbrain.esales.uaa.service.dto.UserDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.uaa.domain.UaPasswords}.
 */
@XRayEnabled
public interface UaPasswordsService {

    /**
     * Save a uaPasswords.
     *
     * @param uaPasswordsDTO the entity to save.
     * @return the persisted entity.
     */
    UaPasswordsDTO save(UaPasswordsDTO uaPasswordsDTO);

    /**
     * Get all the uaPasswords.
     *
     * @return the list of entities.
     */
    List<UaPasswordsDTO> findAll();


    /**
     * Get the "id" uaPasswords.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UaPasswordsDTO> findOne(Long id);

    /**
     * Delete the "id" uaPasswords.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * get account info
     *
     * @return
     */
    Optional<UserDTO> getUserWithAuthorities();

    /**
     * request Password Reset
     *
     * @param employeeCode
     * @return
     */
    Optional<UserDTO> requestPasswordReset(String employeeCode);

    /**
     * password Reset complete
     *
     * @param newPassword
     * @param key
     * @return
     */
    Optional<UaPasswordsDTO> completePasswordReset(String newPassword, String key);

    /**
     * change password
     *
     * @param currentClearTextPassword
     * @param newPassword
     * @return
     */
    boolean processChangePassword(String currentClearTextPassword, String newPassword);
}
