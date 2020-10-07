package jp.co.softbrain.esales.uaa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlDTO;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlInDTO;
import jp.co.softbrain.esales.uaa.service.dto.GetAuthenticationSAMLDTO;
import jp.co.softbrain.esales.uaa.service.dto.UpdateAuthenticationSAMLOutDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.uaa.domain.AuthenticationSaml}.
 *
 * @author TuanLV
 */
@XRayEnabled
public interface AuthenticationSamlService {

    /**
     * Save a authenticationSaml.
     *
     * @param authenticationSamlDTO the entity to save.
     * @return the persisted entity.
     */
    AuthenticationSamlDTO save(AuthenticationSamlDTO authenticationSamlDTO);

    /**
     * Get all the authenticationSamls.
     *
     * @return the list of entities.
     */
    List<AuthenticationSamlDTO> findAll();

    /**
     * Get the "id" authenticationSaml.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AuthenticationSamlDTO> findOne(Long id);

    /**
     * Delete the "id" authenticationSaml.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * getAuthenticationSAML : get Authentication SAML
     *
     * @return GetAuthenticationSAMLDTO : info of a Authentication SAML
     */
    GetAuthenticationSAMLDTO getAuthenticationSAML();

    /**
     * Update Authentication SAML
     *
     * @param data of saml
     * @param files : file upload , delete
     * @return id of authenticationSaml
     */
    UpdateAuthenticationSAMLOutDTO updateAuthenticationSAML(AuthenticationSamlInDTO data,
            List<MultipartFile> files);
}
