/**
 * 
 */
package jp.co.softbrain.esales.commons.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.ListViewSettingsFilters;
import jp.co.softbrain.esales.commons.repository.ListViewSettingsFiltersRepository;
import jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;
import jp.co.softbrain.esales.commons.service.mapper.ListViewSettingsFiltersMapper;

/**
 * Class handle the service method, implement from
 * {@link ListViewSettingsFiltersService}
 * 
 * @author nguyenvanchien3
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ListViewSettingsFiltersServiceImpl implements ListViewSettingsFiltersService {

    private final Logger log = LoggerFactory.getLogger(ListViewSettingsFiltersServiceImpl.class);

    public static final String READ_ONLY_CONNECTION = "@ReadOnlyConnection";

    @Autowired
    private ListViewSettingsFiltersMapper listViewSettingsFiltersMapper;

    @Autowired
    private ListViewSettingsFiltersRepository listViewSettingsFiltersRepository;

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService#
     * save(jp.co.softbrain.esales.commons.service.dto.
     * ListViewSettingsFiltersDTO)
     */
    @Override
    public ListViewSettingsFiltersDTO save(ListViewSettingsFiltersDTO listViewSettingsFiltersDTO) {
        log.debug("Request to save ListViewSettingsFiltersDTO : {}", listViewSettingsFiltersDTO);
        ListViewSettingsFilters entity = listViewSettingsFiltersMapper.toEntity(listViewSettingsFiltersDTO);
        entity = listViewSettingsFiltersRepository.save(entity);
        return listViewSettingsFiltersMapper.toDto(entity);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService#
     * findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<ListViewSettingsFiltersDTO> findAll(Pageable pageable) {
        log.debug(READ_ONLY_CONNECTION);
        log.debug("Request to get all ListViewSettingsFilters");
        return listViewSettingsFiltersRepository.findAll(pageable).map(listViewSettingsFiltersMapper::toDto);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService#
     * findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<ListViewSettingsFiltersDTO> findOne(Long id) {
        log.debug(READ_ONLY_CONNECTION);
        log.debug("Request to get ListViewSettingsFilters : {}", id);
        return listViewSettingsFiltersRepository.findById(id).map(listViewSettingsFiltersMapper::toDto);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService#
     * delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ListViewSettingsFilters : {}", id);
        listViewSettingsFiltersRepository.deleteById(id);
    }

}
