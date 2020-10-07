package jp.co.softbrain.esales.commons.service.impl;

import jp.co.softbrain.esales.commons.domain.Languages;
import jp.co.softbrain.esales.commons.repository.LanguagesRepository;
import jp.co.softbrain.esales.commons.service.LanguagesService;
import jp.co.softbrain.esales.commons.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.commons.service.mapper.LanguagesMapper;

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
 * Service Implementation for managing {@link Language}.
 */
@Service
@Transactional
public class LanguagesServiceImpl implements LanguagesService {

    private final Logger log = LoggerFactory.getLogger(LanguagesServiceImpl.class);

    private final LanguagesRepository languageRepository;

    private final LanguagesMapper languageMapper;

    public LanguagesServiceImpl(LanguagesRepository languageRepository, LanguagesMapper languageMapper) {
        this.languageRepository = languageRepository;
        this.languageMapper = languageMapper;
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.LanguagesService#save(jp.co.softbrain.esales.commons.service.dto.LanguagesDTO)
     */
    @Override
    public LanguagesDTO save(LanguagesDTO languageDTO) {
        log.debug("Request to save Language : {}", languageDTO);
        Languages language = languageMapper.toEntity(languageDTO);
        language = languageRepository.save(language);
        return languageMapper.toDto(language);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.LanguagesService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<LanguagesDTO> findAll() {
        log.debug("Request to get all Languages");
        return languageRepository.findAll().stream()
                .map(languageMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.LanguagesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<LanguagesDTO> findOne(Long id) {
        log.debug("Request to get Language : {}", id);
        return languageRepository.findById(id)
                .map(languageMapper::toDto);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.LanguagesService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Language : {}", id);
        languageRepository.deleteById(id);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.LanguagesService#findAllByOrderByDisplayOrderAsc()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<LanguagesDTO> findAllByOrderByDisplayOrderAsc() {
        log.debug("Request to get Language order by displayOrder ASC");
        return languageRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(languageMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }
}
