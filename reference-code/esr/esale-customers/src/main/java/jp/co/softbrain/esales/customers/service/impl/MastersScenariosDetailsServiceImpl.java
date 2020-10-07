package jp.co.softbrain.esales.customers.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;
import jp.co.softbrain.esales.customers.repository.MastersScenariosDetailsRepository;
import jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDetailsDTO;
import jp.co.softbrain.esales.customers.service.mapper.MastersScenariosDetailsMapper;

/**
 * Class Implement from {@link MastersScenariosDetailsService}
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MastersScenariosDetailsServiceImpl implements MastersScenariosDetailsService {

    @Autowired
    MastersScenariosDetailsMapper mastersScenariosDetailsMapper;

    @Autowired
    MastersScenariosDetailsRepository mastersScenariosDetailsRepository;

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService#save(jp.co.softbrain.esales.customers.service.dto.MastersScenariosDetailsDTO)
     */
    @Override
    public MastersScenariosDetailsDTO save(MastersScenariosDetailsDTO dto) {
        MastersScenariosDetails entity = mastersScenariosDetailsMapper.toEntity(dto);
        entity = mastersScenariosDetailsRepository.save(entity);
        return mastersScenariosDetailsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        mastersScenariosDetailsRepository.deleteByScenarioDetailId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<MastersScenariosDetailsDTO> findOne(Long id) {
        return mastersScenariosDetailsRepository.findByScenarioDetailId(id).map(mastersScenariosDetailsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<MastersScenariosDetailsDTO> findAll(Pageable pageable) {
        return mastersScenariosDetailsRepository.findAll(pageable).map(mastersScenariosDetailsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersScenariosDetailsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersScenariosDetailsDTO> findAll() {
        return mastersScenariosDetailsRepository.findAll().stream().map(mastersScenariosDetailsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

}
