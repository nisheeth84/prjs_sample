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

import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import jp.co.softbrain.esales.customers.repository.CustomersHistoriesRepository;
import jp.co.softbrain.esales.customers.service.CustomersHistoriesService;
import jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO;
import jp.co.softbrain.esales.customers.service.mapper.CustomersHistoriesMapper;

/**
 * Service Implementation for managing {@link CustomersHistories}
 * 
 * @author buithingocanh
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersHistoriesServiceImpl implements CustomersHistoriesService {

    @Autowired
    private CustomersHistoriesMapper customersHistoriesMapper;

    @Autowired
    private CustomersHistoriesRepository customersHistoriesRepository;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#save(jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO)
     */
    @Override
    public CustomersHistoriesDTO save(CustomersHistoriesDTO dto) {
        CustomersHistories entity = customersHistoriesMapper.toEntity(dto);
        entity = customersHistoriesRepository.save(entity);
        return customersHistoriesMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        customersHistoriesRepository.deleteByCustomerHistoryId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersHistoriesDTO> findOne(Long id) {
        return customersHistoriesRepository.findByCustomerHistoryId(id).map(customersHistoriesMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersHistoriesDTO> findAll(Pageable pageable) {
        return customersHistoriesRepository.findAll(pageable).map(customersHistoriesMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersHistoriesDTO> findAll() {
        return customersHistoriesRepository.findAll().stream().map(customersHistoriesMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#deleteByCustomerId(java.lang.Long)
     */
    @Override
    @Transactional
    public void deleteByCustomerId(Long customerId) {
        customersHistoriesRepository.deleteByCustomerId(customerId);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersHistoriesService#saveAll(java.util.List)
     */
    @Override
    @Transactional
    public List<CustomersHistoriesDTO> saveAll(List<CustomersHistoriesDTO> customerHistoryList) {
        List<CustomersHistories> customerHistories = customersHistoriesMapper.toEntity(customerHistoryList);
        return customersHistoriesMapper.toDto(customersHistoriesRepository.saveAll(customerHistories));
    }

}
