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

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.repository.MastersMotivationsRepository;
import jp.co.softbrain.esales.customers.repository.NetworksStandsRepository;
import jp.co.softbrain.esales.customers.service.MastersMotivationsService;
import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMastersMotivationsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;
import jp.co.softbrain.esales.customers.service.mapper.MastersMotivationsMapper;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link MastersMotivations}
 *
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MastersMotivationsServiceImpl implements MastersMotivationsService {

    @Autowired
    private MastersMotivationsRepository mastersMotivationsRepository;

    @Autowired
    private MastersMotivationsMapper mastersMotivationsMapper;

    @Autowired
    private NetworksStandsRepository networksStandsRepository;

    private static final String MASTER_MOTIVATIONIDS_NULL = "Param [masterMotivationIds ] is null.";

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#save(jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO)
     */
    @Override
    @Transactional
    public MastersMotivationsDTO save(MastersMotivationsDTO dto) {
        MastersMotivations entity = mastersMotivationsMapper.toEntity(dto);
        entity = mastersMotivationsRepository.save(entity);
        return mastersMotivationsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        mastersMotivationsRepository.deleteByMasterMotivationId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<MastersMotivationsDTO> findOne(Long id) {
        return mastersMotivationsRepository.findByMasterMotivationId(id).map(mastersMotivationsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<MastersMotivationsDTO> findAll(Pageable pageable) {
        return mastersMotivationsRepository.findAll(pageable).map(mastersMotivationsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersMotivationsDTO> findAll() {
        return mastersMotivationsRepository.findAll().stream().map(mastersMotivationsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersMotivationsService#findByIsAvailable(java.lang.Boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersMotivationsDTO> findByIsAvailable(Boolean isAvailable) {
        return mastersMotivationsMapper.toDto(mastersMotivationsRepository.findByIsAvailable(isAvailable));
    }

    /*
     * @see jp.co.softbrain.esales.customers.service
     * MastersMotivationsService#checkDeleteMasterMotivations(List Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CheckDeteleMastersMotivationsOutDTO checkDeleteMasterMotivations(List<Long> masterMotivationIds) {
        CheckDeteleMastersMotivationsOutDTO checkDeteleMastersMotivationsOutDTO = new CheckDeteleMastersMotivationsOutDTO();
        // 1. Validate parameter
        if (masterMotivationIds == null || masterMotivationIds.isEmpty()) {
            throw new CustomRestException(CommonUtils.putError(MASTER_MOTIVATIONIDS_NULL, Constants.RIQUIRED_CODE));
        }
        // 2. Get masterMotivationIds
        List<NetworksStands> checkDeleteMastersMotivations = networksStandsRepository
                .findByMotivationIdIn(masterMotivationIds);
        // 3. create response
        List<Long> lstMastersMotivationIds = checkDeleteMastersMotivations.stream().map(NetworksStands::getMotivationId)
                .collect(Collectors.toList());
        checkDeteleMastersMotivationsOutDTO.setMasterMotivationIds(lstMastersMotivationIds);
        return checkDeteleMastersMotivationsOutDTO;
    }
}
