package jp.co.softbrain.esales.commons.service.impl;

import jp.co.softbrain.esales.commons.service.DateFormatsService;
import jp.co.softbrain.esales.commons.domain.DateFormats;
import jp.co.softbrain.esales.commons.repository.DateFormatsRepository;
import jp.co.softbrain.esales.commons.service.dto.DateFormatsDTO;
import jp.co.softbrain.esales.commons.service.mapper.DateFormatsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link DateFormats}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DateFormatsServiceImpl implements DateFormatsService {

    private final Logger log = LoggerFactory.getLogger(DateFormatsServiceImpl.class);

    private final DateFormatsRepository dateFormatsRepository;

    private final DateFormatsMapper dateFormatsMapper;

    public DateFormatsServiceImpl(DateFormatsRepository dateFormatsRepository, DateFormatsMapper dateFormatsMapper) {
        this.dateFormatsRepository = dateFormatsRepository;
        this.dateFormatsMapper = dateFormatsMapper;
    }

    /**
     * Save a dateFormats.
     *
     * @param dateFormatsDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public DateFormatsDTO save(DateFormatsDTO dateFormatsDTO) {
        log.debug("Request to save DateFormats : {}", dateFormatsDTO);
        DateFormats dateFormats = dateFormatsMapper.toEntity(dateFormatsDTO);
        dateFormats = dateFormatsRepository.save(dateFormats);
        return dateFormatsMapper.toDto(dateFormats);
    }

    /**
     * Get all the dateFormats.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<DateFormatsDTO> findAll() {
        log.debug("Request to get all DateFormats");
        return dateFormatsRepository.findAll().stream()
            .map(dateFormatsMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one dateFormats by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<DateFormatsDTO> findOne(Long id) {
        log.debug("Request to get DateFormats : {}", id);
        return dateFormatsRepository.findById(id)
            .map(dateFormatsMapper::toDto);
    }

    /**
     * Delete the dateFormats by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DateFormats : {}", id);
        dateFormatsRepository.deleteById(id);
    }
}
