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

import jp.co.softbrain.esales.customers.domain.CustomersListParticipants;
import jp.co.softbrain.esales.customers.repository.CustomersListParticipantsRepository;
import jp.co.softbrain.esales.customers.service.CustomersListParticipantsService;
import jp.co.softbrain.esales.customers.service.dto.CustomersListParticipantsDTO;
import jp.co.softbrain.esales.customers.service.mapper.CustomersListParticipantsMapper;

/**
 * Service Implementation for managing {@link CustomersListParticipants}
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersListParticipantsServiceImpl implements CustomersListParticipantsService {

    @Autowired
    private CustomersListParticipantsRepository customersListParticipantsRepository;

    @Autowired
    private CustomersListParticipantsMapper customersListParticipantsMapper;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#save(jp.co.softbrain.esales.customers.service.dto.CustomersListParticipantsDTO)
     */
    @Override
    public CustomersListParticipantsDTO save(CustomersListParticipantsDTO dto) {
        CustomersListParticipants entity = customersListParticipantsMapper.toEntity(dto);
        entity = customersListParticipantsRepository.save(entity);
        return customersListParticipantsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        customersListParticipantsRepository.deleteByCustomerListParticipantId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersListParticipantsDTO> findOne(Long id) {
        return customersListParticipantsRepository.findByCustomerListParticipantId(id)
                .map(customersListParticipantsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersListParticipantsDTO> findAll(Pageable pageable) {
        return customersListParticipantsRepository.findAll(pageable).map(customersListParticipantsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListParticipantsDTO> findAll() {
        return customersListParticipantsRepository.findAll().stream().map(customersListParticipantsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#saveAll(java.util.List)
     */
    @Override
    public List<CustomersListParticipantsDTO> saveAll(List<CustomersListParticipantsDTO> listParticipantsDTOs) {
        List<CustomersListParticipants> customersListParticipants = customersListParticipantsMapper
                .toEntity(listParticipantsDTOs);
        customersListParticipantsRepository.saveAll(customersListParticipants);
        return customersListParticipantsMapper.toDto(customersListParticipants);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#getListParticipants(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListParticipantsDTO> getListParticipants(Long customerListId) {
        return customersListParticipantsMapper
                .toDto(customersListParticipantsRepository.findByCustomerListId(customerListId));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListParticipantsService#deleteByCustomerListId(java.lang.Long)
     */
    @Override
    @Transactional
    public void deleteByCustomerListId(Long cutomersListId) {
        customersListParticipantsRepository.deleteByCustomerListId(cutomersListId);
    }
}
