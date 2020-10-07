package jp.co.softbrain.esales.uaa.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.uaa.domain.Authority;
import jp.co.softbrain.esales.uaa.repository.AuthorityRepository;
import jp.co.softbrain.esales.uaa.service.AuthorityService;
import jp.co.softbrain.esales.uaa.service.dto.AuthorityDTO;
import jp.co.softbrain.esales.uaa.service.mapper.AuthorityMapper;

/**
 * Service Implementation for managing {@link Authority}.
 */
@Service
@Transactional(transactionManager="tenantTransactionManager")
public class AuthorityServiceImpl implements AuthorityService {

    private final Logger log = LoggerFactory.getLogger(AuthorityServiceImpl.class);

    private final AuthorityRepository authorityRepository;

    private final AuthorityMapper authorityMapper;

    public AuthorityServiceImpl(AuthorityRepository authorityRepository, AuthorityMapper authorityMapper) {
        this.authorityRepository = authorityRepository;
        this.authorityMapper = authorityMapper;
    }

    /**
     * Save a authority.
     *
     * @param authorityDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public AuthorityDTO save(AuthorityDTO authorityDTO) {
        log.debug("Request to save Authority : {}", authorityDTO);
        Authority authority = authorityMapper.toEntity(authorityDTO);
        authority = authorityRepository.save(authority);
        return authorityMapper.toDto(authority);
    }

    /**
     * Get all the authorities.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<AuthorityDTO> findAll() {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get all Authorities");
        return authorityRepository.findAll().stream()
            .map(authorityMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one authority by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<AuthorityDTO> findOne(Long id) {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get Authority : {}", id);
        return authorityRepository.findById(id)
            .map(authorityMapper::toDto);
    }

    /**
     * Delete the authority by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Authority : {}", id);
        authorityRepository.deleteById(id);
    }

}
