package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfoTab;
import jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabsRepositoryCustom;
import jp.co.softbrain.esales.commons.service.FieldInfoTabService;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType2ResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType3ResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsResponseDTO;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoTabMapper;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * Service Implementation for managing {@link FieldInfoTab}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FieldInfoTabServiceImpl implements FieldInfoTabService {

    private final Logger log = LoggerFactory.getLogger(FieldInfoTabServiceImpl.class);

    private final FieldInfoTabRepository fieldInfoTabRepository;

    private final FieldInfoTabMapper fieldInfoTabMapper;

    private static final String VALIDATE_FAIL = "Validate failded.";

    @Autowired
    private FieldInfoTabsRepositoryCustom fieldInfoTabsRepositoryCustom;

    @Autowired
    private CommonFieldInfoRepository commonFieldInfoRepository;

    Gson gson = new Gson();

    public FieldInfoTabServiceImpl(FieldInfoTabRepository fieldInfoTabRepository,
            FieldInfoTabMapper fieldInfoTabMapper) {
        this.fieldInfoTabRepository = fieldInfoTabRepository;
        this.fieldInfoTabMapper = fieldInfoTabMapper;
    }

    /**
     * Save a fieldInfoTab.
     *
     * @param fieldInfoTabDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public FieldInfoTabDTO save(FieldInfoTabDTO fieldInfoTabDTO) {
        log.debug("Request to save FieldInfoTab : {}", fieldInfoTabDTO);
        FieldInfoTab fieldInfoTab = fieldInfoTabMapper.toEntity(fieldInfoTabDTO);
        fieldInfoTab = fieldInfoTabRepository.save(fieldInfoTab);
        return fieldInfoTabMapper.toDto(fieldInfoTab);
    }

    /**
     * Get all the fieldInfoTabs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<FieldInfoTabDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FieldInfoTabs");
        return fieldInfoTabRepository.findAll(pageable).map(fieldInfoTabMapper::toDto);
    }

    /**
     * Get one fieldInfoTab by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<FieldInfoTabDTO> findByFieldInfoTabId(Long id) {
        log.debug("Request to get FieldInfoTab : {}", id);
        return fieldInfoTabRepository.findByFieldInfoTabId(id).map(fieldInfoTabMapper::toDto);
    }

    /**
     * Delete the fieldInfoTab by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete FieldInfoTab : {}", id);
        fieldInfoTabRepository.deleteById(id);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.FieldInfoTabService#
     * getFieldInfoTabs(java.lang.Long, java.lang.Long, java.lang.String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetFieldInfoTabsResponseDTO getFieldInfoTabs(Integer tabBelong, Integer tabId) {
        // 1. validate parameter
        // tabBelong
        if (tabBelong == null) {
            throw new CustomException(VALIDATE_FAIL, ConstantsCommon.PARAM_TAB_BELONG, Constants.RIQUIRED_CODE);
        }

        // tabId
        if (tabId == null) {
            throw new CustomException(VALIDATE_FAIL, ConstantsCommon.PARAM_TAB_ID, Constants.RIQUIRED_CODE);
        }

        // 2. Get list fieldInfoTabs
        GetFieldInfoTabsResponseDTO listResponse = new GetFieldInfoTabsResponseDTO();
        List<GetFieldInfoTabsOutSubType3ResponseDTO> lstFieldResponse = new ArrayList<>();
        List<GetFieldInfoTabsOutSubType2ResponseDTO> lstDataResponse = new ArrayList<>();
        List<GetFieldInfoTabsOutSubType2DTO> listFieldInfoTabs = fieldInfoTabsRepositoryCustom.getFieldInfoTabs(tabBelong,
                tabId);
        List<GetFieldInfoTabsOutSubType3DTO> listFieldOfFunction = commonFieldInfoRepository.getListField(tabBelong);
        GetFieldInfoTabsOutSubType3ResponseDTO fieldResponse = null;
        GetFieldInfoTabsOutSubType2ResponseDTO dataResponse = null;

        Map<Long, List<GetFieldInfoTabsOutSubType1DTO>> mapFieldItem = new HashMap<>();
        List<GetFieldInfoTabsOutSubType1DTO> listFieldItem;
        for (GetFieldInfoTabsOutSubType3DTO fieldInfos : listFieldOfFunction) {
            fieldResponse = new GetFieldInfoTabsOutSubType3ResponseDTO();
            fieldResponse.setFieldId(fieldInfos.getFieldId());
            fieldResponse.setFieldOrder(fieldInfos.getFieldOrder());
            fieldResponse.setFieldName(fieldInfos.getFieldName());
            fieldResponse.setFieldLabel(fieldInfos.getFieldLabel());
            fieldResponse.setFieldType(fieldInfos.getFieldType());
            fieldResponse.setUpdatedDate(fieldInfos.getUpdatedDate());
            lstFieldResponse.add(fieldResponse);

            listFieldItem = new ArrayList<>();
            mapFieldItem.put(fieldInfos.getFieldId(), listFieldItem);
            GetFieldInfoTabsOutSubType1DTO fieldItem = new GetFieldInfoTabsOutSubType1DTO();
            fieldItem.setItemId(fieldInfos.getItemId());
            fieldItem.setItemLabel(fieldInfos.getItemLabel());
            listFieldItem.add(fieldItem);
        }
        for (Entry<Long, List<GetFieldInfoTabsOutSubType1DTO>> entry : mapFieldItem.entrySet()) {
        	lstFieldResponse.forEach(response -> {
                if (entry.getKey().equals(response.getFieldId())) {
                    response.setFieldItem(entry.getValue());
                }
            });
        }

        for (GetFieldInfoTabsOutSubType2DTO fieldInfoTabs : listFieldInfoTabs) {
            dataResponse = new GetFieldInfoTabsOutSubType2ResponseDTO();
            dataResponse.setFieldId(fieldInfoTabs.getFieldId());
            dataResponse.setFieldInfoTabId(fieldInfoTabs.getFieldInfoTabId());
            dataResponse.setFieldInfoTabPersonalId(fieldInfoTabs.getFieldInfoTabPersonalId());
            dataResponse.setFieldOrder(fieldInfoTabs.getFieldOrder());
            dataResponse.setFieldName(fieldInfoTabs.getFieldName());
            dataResponse.setFieldLabel(fieldInfoTabs.getFieldLabel());
            dataResponse.setFieldType(fieldInfoTabs.getFieldType());
            dataResponse.setIsColumnFixed(fieldInfoTabs.getIsColumnFixed());
            dataResponse.setColumnWidth(fieldInfoTabs.getColumnWidth());
            dataResponse.setUpdatedDate(fieldInfoTabs.getUpdatedDate());
            lstDataResponse.add(dataResponse);
        }
        listResponse.setData(lstDataResponse);
        listResponse.setFields(lstFieldResponse);
        return listResponse;
    }
}
