package jp.co.softbrain.esales.uaa.service.impl;

import jp.co.softbrain.esales.uaa.service.UaPasswordResetAuthKeyService;
import jp.co.softbrain.esales.uaa.domain.UaPasswordResetAuthKey;
import jp.co.softbrain.esales.uaa.repository.UaPasswordResetAuthKeyRepository;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordResetAuthKeyDTO;
import jp.co.softbrain.esales.uaa.service.mapper.UaPasswordResetAuthKeyMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link UaPasswordResetAuthKey}.
 */
@Service
@Transactional(transactionManager="tenantTransactionManager")
public class UaPasswordResetAuthKeyServiceImpl implements UaPasswordResetAuthKeyService {

    private final Logger log = LoggerFactory.getLogger(UaPasswordResetAuthKeyServiceImpl.class);

    private final UaPasswordResetAuthKeyRepository uaPasswordResetAuthKeyRepository;

    private final UaPasswordResetAuthKeyMapper uaPasswordResetAuthKeyMapper;

    public UaPasswordResetAuthKeyServiceImpl(UaPasswordResetAuthKeyRepository uaPasswordResetAuthKeyRepository, UaPasswordResetAuthKeyMapper uaPasswordResetAuthKeyMapper) {
        this.uaPasswordResetAuthKeyRepository = uaPasswordResetAuthKeyRepository;
        this.uaPasswordResetAuthKeyMapper = uaPasswordResetAuthKeyMapper;
    }

    /**
     * Save a uaPasswordResetAuthKey.
     *
     * @param uaPasswordResetAuthKeyDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public UaPasswordResetAuthKeyDTO save(UaPasswordResetAuthKeyDTO uaPasswordResetAuthKeyDTO) {
        log.debug("Request to save UaPasswordResetAuthKey : {}", uaPasswordResetAuthKeyDTO);
        UaPasswordResetAuthKey uaPasswordResetAuthKey = uaPasswordResetAuthKeyMapper.toEntity(uaPasswordResetAuthKeyDTO);
        uaPasswordResetAuthKey = uaPasswordResetAuthKeyRepository.save(uaPasswordResetAuthKey);
        return uaPasswordResetAuthKeyMapper.toDto(uaPasswordResetAuthKey);
    }

    /**
     * Get all the uaPasswordResetAuthKeys.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<UaPasswordResetAuthKeyDTO> findAll() {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get all UaPasswordResetAuthKeys");
        return uaPasswordResetAuthKeyRepository.findAll().stream()
            .map(uaPasswordResetAuthKeyMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one uaPasswordResetAuthKey by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<UaPasswordResetAuthKeyDTO> findOne(Long id) {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get UaPasswordResetAuthKey : {}", id);
        return uaPasswordResetAuthKeyRepository.findById(id)
            .map(uaPasswordResetAuthKeyMapper::toDto);
    }

    /**
     * Delete the uaPasswordResetAuthKey by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete UaPasswordResetAuthKey : {}", id);
        uaPasswordResetAuthKeyRepository.deleteById(id);
    }

    /**
     * check key reset password
     *
     * @param key
     * @return
     */
    public Optional<UaPasswordResetAuthKeyDTO> checkKeyPasswordReset(String key) {
        log.debug("Reset user password for reset key {}", key);

        // check reset key
        return uaPasswordResetAuthKeyRepository.findOneByAuthKeyNumber(key)
            .filter(resetPass -> resetPass.getAuthKeyExpirationDate().isAfter(Instant.now()))
            .map(uaPasswordResetAuthKeyMapper::toDto);
    }
}
