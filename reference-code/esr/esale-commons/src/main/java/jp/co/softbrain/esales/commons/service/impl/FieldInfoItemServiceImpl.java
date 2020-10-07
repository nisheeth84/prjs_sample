package jp.co.softbrain.esales.commons.service.impl;

import jp.co.softbrain.esales.commons.service.FieldInfoItemService;
import jp.co.softbrain.esales.commons.domain.FieldInfoItem;
import jp.co.softbrain.esales.commons.repository.FieldInfoItemRepository;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemDTO;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoItemMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link FieldInfoItem}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FieldInfoItemServiceImpl implements FieldInfoItemService {

    private final Logger log = LoggerFactory.getLogger(FieldInfoItemServiceImpl.class);

    private final FieldInfoItemRepository fieldInfoItemRepository;

    private final FieldInfoItemMapper fieldInfoItemMapper;

    public FieldInfoItemServiceImpl(FieldInfoItemRepository fieldInfoItemRepository,
            FieldInfoItemMapper fieldInfoItemMapper) {
        this.fieldInfoItemRepository = fieldInfoItemRepository;
        this.fieldInfoItemMapper = fieldInfoItemMapper;
    }

    /**
     * Save a fieldInfoItem.
     *
     * @param fieldInfoItemDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public FieldInfoItemDTO save(FieldInfoItemDTO fieldInfoItemDTO) {
        log.debug("Request to save FieldInfoItem : {}", fieldInfoItemDTO);
        FieldInfoItem fieldInfoItem = fieldInfoItemMapper.toEntity(fieldInfoItemDTO);
        fieldInfoItem = fieldInfoItemRepository.save(fieldInfoItem);
        return fieldInfoItemMapper.toDto(fieldInfoItem);
    }

    /**
     * Get all the fieldInfoItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<FieldInfoItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FieldInfoItems");
        return fieldInfoItemRepository.findAll(pageable).map(fieldInfoItemMapper::toDto);
    }

    /**
     * Get one fieldInfoItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<FieldInfoItemDTO> findByItemId(Long id) {
        log.debug("Request to get FieldInfoItem : {}", id);
        return fieldInfoItemRepository.findByItemId(id).map(fieldInfoItemMapper::toDto);
    }

    /**
     * Delete the fieldInfoItem by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete FieldInfoItem : {}", id);
        fieldInfoItemRepository.deleteById(id);
    }
}
