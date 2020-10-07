package jp.co.softbrain.esales.uaa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.uaa.service.dto.AuthorityDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.uaa.domain.Authority}.
 */
@XRayEnabled
@Service
public interface AuthorityService {

    /**
     * Save a authority.
     *
     * @param authorityDTO the entity to save.
     * @return the persisted entity.
     */
    AuthorityDTO save(AuthorityDTO authorityDTO);

    /**
     * Get all the authorities.
     *
     * @return the list of entities.
     */
    List<AuthorityDTO> findAll();

    /**
     * Get the "id" authority.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AuthorityDTO> findOne(Long id);

    /**
     * Delete the "id" authority.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
