package jp.co.softbrain.esales.customers.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.domain.MastersStands;
import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.repository.MastersStandsRepository;
import jp.co.softbrain.esales.customers.repository.NetworksStandsRepository;
import jp.co.softbrain.esales.customers.service.MastersStandsService;
import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMasterStandsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO;
import jp.co.softbrain.esales.customers.service.mapper.MastersStandsMapper;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link MastersStands}
 *
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MastersStandsServiceImpl implements MastersStandsService {

    public static final String MASTER_STAND_IDS = "masterStandIds";

    private static final String MASTER_STAND_IDS_NULL = "Param [mastersStandsIds ] is null.";

    @Autowired
    private NetworksStandsRepository networksStandsRepository;

    @Autowired
    private MastersStandsRepository mastersStandsRepository;

    @Autowired
    private MastersStandsMapper networksStandsMapper;

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersStandsService#save(jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO)
     */
    @Override
    public MastersStandsDTO save(MastersStandsDTO dto) {
        MastersStands entity = networksStandsMapper.toEntity(dto);
        entity = mastersStandsRepository.save(entity);
        return networksStandsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersStandsService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        mastersStandsRepository.deleteByMasterStandId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersStandsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<MastersStandsDTO> findOne(Long id) {
        return mastersStandsRepository.findByMasterStandId(id).map(networksStandsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersStandsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersStandsDTO> findAll() {
        return mastersStandsRepository.findAll().stream().map(networksStandsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.MastersStandsService#findByIsAvailable(java.lang.Boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<MastersStandsDTO> findByIsAvailable(Boolean isAvailable) {
        return networksStandsMapper.toDto(mastersStandsRepository.findByIsAvailable(isAvailable));
    }

    /*
     * @see jp.co.softbrain.esales.customers.service
     * MastersStandsService#checkDeleteMasterStands(List Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CheckDeteleMasterStandsOutDTO checkDeleteMasterStands(List<Long> masterStandIds) {
        CheckDeteleMasterStandsOutDTO checkDeteleMasterStandsOutDTO = new CheckDeteleMasterStandsOutDTO();
        // 1. Validate prameter
        if (masterStandIds == null || masterStandIds.isEmpty()) {
            throw new CustomRestException(CommonUtils.putError(MASTER_STAND_IDS_NULL, Constants.RIQUIRED_CODE));
        }
        // 2. Get masterMotivationIds
        List<NetworksStands> checkDeleteMastersStands = networksStandsRepository.findByStandIdIn(masterStandIds);
        // 3. create response
        List<Long> lstMasterStanIds = checkDeleteMastersStands.stream().map(NetworksStands::getStandId)
                .collect(Collectors.toList());
        checkDeteleMasterStandsOutDTO.setMasterStandIds(lstMasterStanIds);
        return checkDeteleMasterStandsOutDTO;
    }

}
