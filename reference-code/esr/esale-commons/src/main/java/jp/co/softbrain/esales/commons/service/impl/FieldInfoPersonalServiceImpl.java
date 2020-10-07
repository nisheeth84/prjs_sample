package jp.co.softbrain.esales.commons.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.FieldInfoPersonal;
import jp.co.softbrain.esales.commons.repository.FieldInfoPersonalRepository;
import jp.co.softbrain.esales.commons.service.FieldInfoPersonalService;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalDTO;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoPersonalMapper;

/**
 * Service Implementation for managing {@link FieldInfoPersonal}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FieldInfoPersonalServiceImpl implements FieldInfoPersonalService {

    private final Logger log = LoggerFactory.getLogger(FieldInfoPersonalServiceImpl.class);

    private final FieldInfoPersonalRepository fieldInfoPersonalRepository;

    private final FieldInfoPersonalMapper fieldInfoPersonalMapper;

    public FieldInfoPersonalServiceImpl(FieldInfoPersonalRepository fieldInfoPersonalRepository,
            FieldInfoPersonalMapper fieldInfoPersonalMapper) {
        this.fieldInfoPersonalRepository = fieldInfoPersonalRepository;
        this.fieldInfoPersonalMapper = fieldInfoPersonalMapper;
    }

    /**
     * Save a fieldInfoPersonal.
     *
     * @param fieldInfoPersonalDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public FieldInfoPersonalDTO save(FieldInfoPersonalDTO fieldInfoPersonalDTO) {
        log.debug("Request to save FieldInfoPersonal : {}", fieldInfoPersonalDTO);
        FieldInfoPersonal fieldInfoPersonal = fieldInfoPersonalMapper.toEntity(fieldInfoPersonalDTO);
        fieldInfoPersonal = fieldInfoPersonalRepository.save(fieldInfoPersonal);
        return fieldInfoPersonalMapper.toDto(fieldInfoPersonal);
    }

    /**
     * Get all the fieldInfoPersonals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<FieldInfoPersonalDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FieldInfoPersonals");
        return fieldInfoPersonalRepository.findAll(pageable).map(fieldInfoPersonalMapper::toDto);
    }

    /**
     * Get one fieldInfoPersonal by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<FieldInfoPersonalDTO> findOne(Long id) {
        log.debug("Request to get FieldInfoPersonal : {}", id);
        return fieldInfoPersonalRepository.findById(id).map(fieldInfoPersonalMapper::toDto);
    }

    /**
     * Delete the fieldInfoPersonal by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete FieldInfoPersonal : {}", id);
        fieldInfoPersonalRepository.deleteById(id);
    }
}
