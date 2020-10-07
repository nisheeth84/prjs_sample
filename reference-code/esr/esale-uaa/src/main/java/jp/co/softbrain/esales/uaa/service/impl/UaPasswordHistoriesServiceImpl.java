package jp.co.softbrain.esales.uaa.service.impl;

import jp.co.softbrain.esales.uaa.service.UaPasswordHistoriesService;
import jp.co.softbrain.esales.uaa.domain.UaPasswordHistories;
import jp.co.softbrain.esales.uaa.repository.UaPasswordHistoriesRepository;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordHistoriesDTO;
import jp.co.softbrain.esales.uaa.service.mapper.UaPasswordHistoriesMapper;

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
 * Service Implementation for managing {@link UaPasswordHistories}.
 */
@Service
@Transactional(transactionManager="tenantTransactionManager")
public class UaPasswordHistoriesServiceImpl implements UaPasswordHistoriesService {

    private final Logger log = LoggerFactory.getLogger(UaPasswordHistoriesServiceImpl.class);

    private final UaPasswordHistoriesRepository uaPasswordHistoriesRepository;

    private final UaPasswordHistoriesMapper uaPasswordHistoriesMapper;

    public UaPasswordHistoriesServiceImpl(UaPasswordHistoriesRepository uaPasswordHistoriesRepository, UaPasswordHistoriesMapper uaPasswordHistoriesMapper) {
        this.uaPasswordHistoriesRepository = uaPasswordHistoriesRepository;
        this.uaPasswordHistoriesMapper = uaPasswordHistoriesMapper;
    }

    /**
     * Save a uaPasswordHistories.
     *
     * @param uaPasswordHistoriesDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public UaPasswordHistoriesDTO save(UaPasswordHistoriesDTO uaPasswordHistoriesDTO) {
        log.debug("Request to save UaPasswordHistories : {}", uaPasswordHistoriesDTO);
        UaPasswordHistories uaPasswordHistories = uaPasswordHistoriesMapper.toEntity(uaPasswordHistoriesDTO);
        uaPasswordHistories = uaPasswordHistoriesRepository.save(uaPasswordHistories);
        return uaPasswordHistoriesMapper.toDto(uaPasswordHistories);
    }

    /**
     * Get all the uaPasswordHistories.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<UaPasswordHistoriesDTO> findAll() {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get all UaPasswordHistories");
        return uaPasswordHistoriesRepository.findAll().stream()
            .map(uaPasswordHistoriesMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one uaPasswordHistories by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<UaPasswordHistoriesDTO> findOne(Long id) {
        log.debug("@ReadOnlyConnection");
        log.debug("Request to get UaPasswordHistories : {}", id);
        return uaPasswordHistoriesRepository.findById(id)
            .map(uaPasswordHistoriesMapper::toDto);
    }

    /**
     * Delete the uaPasswordHistories by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete UaPasswordHistories : {}", id);
        uaPasswordHistoriesRepository.deleteById(id);
    }
}
