package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import io.micrometer.core.instrument.util.StringUtils;
import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.domain.FieldInfoItem;
import jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoItemRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoPersonalRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabPersonalRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabRepository;
import jp.co.softbrain.esales.commons.repository.ListViewSettingsFiltersRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.FieldInfoItemService;
import jp.co.softbrain.esales.commons.service.FieldInfoService;
import jp.co.softbrain.esales.commons.service.FieldInfoTabService;
import jp.co.softbrain.esales.commons.service.TabsInfoService;
import jp.co.softbrain.esales.commons.service.dto.CopyFieldDTO;
import jp.co.softbrain.esales.commons.service.dto.ElasticsearchFieldDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoQueryDTO;
import jp.co.softbrain.esales.commons.service.dto.RelationDataDTO;
import jp.co.softbrain.esales.commons.service.dto.SelectOrganizationDataDTO;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoInDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoSubType4DTO;
import jp.co.softbrain.esales.commons.service.dto.activities.ActivitiesFormatDTO;
import jp.co.softbrain.esales.commons.service.dto.activities.UpdateActivityFormatOutDTO;
import jp.co.softbrain.esales.commons.service.dto.activities.UpdateActivityFormatsRequest;
import jp.co.softbrain.esales.commons.service.dto.activities.UpdateActivityFormatsSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.products.UpdateProductTypeFieldIdUse;
import jp.co.softbrain.esales.commons.service.dto.products.UpdateProductTypesLst;
import jp.co.softbrain.esales.commons.service.dto.products.UpdateProductTypesRequest;
import jp.co.softbrain.esales.commons.service.dto.products.UpdateProductTypesResponse;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoItemMapper;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoMapper;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoWithoutDataMapper;
import jp.co.softbrain.esales.commons.service.mapper.FieldsInfoQueryMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Implementation for managing {@link FieldInfo}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FieldInfoServiceImpl implements FieldInfoService {
    private static final int FISRT_RELARION_FIELD = 1;
    private static final int SECOND_RELARION_FIELD = 2;
    private static final int DEFAULT_VALUE_STATISTICS = 1;
    @Autowired
    private CommonFieldInfoRepository commonFieldInfoRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();

    private Gson gson = new Gson();

    private final Logger log = LoggerFactory.getLogger(FieldInfoServiceImpl.class);
    @Autowired
    private final FieldInfoRepository fieldInfoRepository;
    @Autowired
    private final FieldInfoMapper fieldInfoMapper;
    @Autowired
    private FieldInfoItemService fieldInfoItemService;
    @Autowired
    private FieldInfoWithoutDataMapper fieldInfoWithoutDataMapper;
    @Autowired
    private TabsInfoService tabsInfoService;
    @Autowired
    private FieldInfoTabService fieldInfoTabService;
    @Autowired
    private FieldInfoItemRepository fieldInfoItemRepository;
    @Autowired
    private FieldInfoTabPersonalRepository fieldInfoTabPersonalRepository;
    @Autowired
    private FieldInfoTabRepository fieldInfoTabRepository;
    @Autowired
    private FieldInfoPersonalRepository fieldInfoPersonalRepository;
    @Autowired
    private CommonFieldInfoService commonFieldInfoService;
    @Autowired
    private FieldsInfoQueryMapper fieldsInfoQueryMapper;
    @Autowired
    private ListViewSettingsFiltersRepository listViewSettingsFiltersRepository;
    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FieldInfoItemMapper fieldInfoItemMapper;

    @Autowired
    private RestHighLevelClient client;

    public FieldInfoServiceImpl(FieldInfoRepository fieldInfoRepository, FieldInfoMapper fieldInfoMapper) {
        this.fieldInfoRepository = fieldInfoRepository;
        this.fieldInfoMapper = fieldInfoMapper;
    }

    /**
     * Save a fieldInfo.
     *
     * @param fieldInfoDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public FieldInfoDTO save(FieldInfoDTO fieldInfoDTO) {
        log.debug("Request to save FieldInfo : {}", fieldInfoDTO);
        FieldInfo fieldInfo = fieldInfoMapper.toEntity(fieldInfoDTO);
        fieldInfo = fieldInfoRepository.save(fieldInfo);
        return fieldInfoMapper.toDto(fieldInfo);
    }

    /**
     * Get all the fieldInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<FieldInfoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FieldInfos");
        return fieldInfoRepository.findAll(pageable).map(fieldInfoMapper::toDto);
    }

    /**
     * Get one fieldInfo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<FieldInfoDTO> findOne(Long id) {
        log.debug("Request to get FieldInfo : {}", id);
        return fieldInfoRepository.findById(id).map(fieldInfoMapper::toDto);
    }

    /**
     * Delete the fieldInfo by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete FieldInfo : {}", id);
        fieldInfoRepository.deleteById(id);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.FieldInfoService#
     * updateCustomFieldInfo(java.lang.Integer, java.util.List, java.util.List,
     * java.util.List, java.util.List, java.util.List)
     */
    @SuppressWarnings({})
    @Override
    @Transactional
    public UpdateCustomFieldsInfoOutDTO updateCustomFieldsInfo(Integer fieldBelong, List<Long> deletedFields,
            List<UpdateCustomFieldsInfoInDTO> fields, List<TabsInfoDTO> tabs, List<Long> deletedFieldsTab,
            List<FieldInfoTabDTO> fieldsTab) {

        UpdateCustomFieldsInfoOutDTO updateCustomFieldsInfoOutDTO = new UpdateCustomFieldsInfoOutDTO();
        List<Long> fieldIdsCreatedOrUpdate = new ArrayList<>();
        List<Long> tabInfoIdsCreatedOrUpdate = new ArrayList<>();
        List<Long> fieldInfoTabIdsCreatedOrUpdate = new ArrayList<>();
        List<ElasticsearchFieldDTO> elasticsearchFieldList = new ArrayList<>();
        FieldInfo tabField = null;
        List<Long> tabData = new ArrayList<>();
        int indexRelation = 0;
        FieldInfo relationFisrt = null;
        FieldInfo relationSecond = null;
        UpdateCustomFieldsInfoSubType3DTO dataRelationUpdate = new UpdateCustomFieldsInfoSubType3DTO();
        Map<Long, FieldInfo> updatedReflectLookup = new HashMap<>();
        Map<Long, UpdateCustomFieldsInfoInDTO> updatedReflectLookupDTO = new HashMap<>();
        Map<Long, Long> mapFieldIdTempAndReal = new HashMap<>();
        Map<Long, Long> mapFieldId = new HashMap<>();
        List<CopyFieldDTO> copyField = new ArrayList<>();
        // 0. get employeeId
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1.validate fieldBelong
        if (fieldBelong == null || !FieldBelong.getFieldBelongList().contains(fieldBelong)) {
            throw new CustomException("fieldBelong must be valid", ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.RIQUIRED_CODE);
        }

        if (!FieldBelong.getFieldBelongList().contains(fieldBelong)) {
            throw new CustomException("Invalid fieldBelong value ", ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.INVALID_PARAMETER);
        }

        // 2.1 Check the location using items
        checkLocationUsingItem(deletedFields) ;

        // 2.2.get id relationData
        List<String> relationDataIds = fieldInfoRepository
                .getRelationDataIdsByDeletedFields(Integer.valueOf(FieldTypeEnum.RELATION.getCode()), deletedFields);
        if (relationDataIds != null && !relationDataIds.isEmpty()) {
            for (String relationId : relationDataIds) {
                if (relationId != null) {
                    String stringRelationId = relationId.replace("\"", "");
                    deletedFields.add(Long.valueOf(stringRelationId));
                }
            }
        }
        // 2.3 delete data
        List<String> fieldInfoList = fieldInfoRepository.findFieldNameAllWithFieldIds(deletedFields);
        updateRelationFields(copyField);
        List<Long> copyFieldIds = copyField.stream().map(CopyFieldDTO::getFrom).collect(Collectors.toList());
        deleteFields(deletedFields, copyFieldIds);

        // create fields
        if (fields != null && !fields.isEmpty()) {
            for (int i = 0; i < fields.size(); i++) {
                Long idFieldCreateOrUpdate = null;
                UpdateCustomFieldsInfoInDTO field = fields.get(i);
                mapFieldId.put(field.getFieldId(), field.getFieldId());
                // 4.1. Insert data into table field_info
                if (field.getFieldId() == null || field.getFieldId() <= 0) {
                    FieldInfo fieldInfoPersistedEntity = createFieldInfo(fieldBelong, fieldIdsCreatedOrUpdate,
                            employeeId, field, mapFieldIdTempAndReal);
                    idFieldCreateOrUpdate = fieldInfoPersistedEntity.getFieldId();

                    if (fieldInfoPersistedEntity != null) {
                        mapFieldId.put(field.getFieldId(), fieldInfoPersistedEntity.getFieldId());

                        // add data to create column in elasticsearch
                        elasticsearchFieldList.add(new ElasticsearchFieldDTO(fieldInfoPersistedEntity.getFieldId(),
                                fieldInfoPersistedEntity.getFieldType(), fieldInfoPersistedEntity.getFieldName()));
                    }
                    if (field.isInTab()) {
                        tabData.add(fieldInfoPersistedEntity.getFieldId());
                    }
                    if (!tabData.isEmpty() && tabField != null && ((!field.isInTab() && !isFieldRelationChildren(field, fieldBelong))  || i == fields.size() - 1)) {
                        tabField.setTabData(gson.toJson(tabData));
                        fieldInfoRepository.save(tabField);
                        tabData = new ArrayList<>();

                    }
                    if (FieldTypeEnum.TAB.getCode().equals(String.valueOf(field.getFieldType()))) {
                        tabField = fieldInfoPersistedEntity;
                        if(i == fields.size() - 1){
                            fieldInfoRepository.save(tabField);
                        }
                    }
                    if (FieldTypeEnum.RELATION.getCode().equals(String.valueOf(field.getFieldType()))) {
                        if (field.getFieldId().longValue() == field.getRelationData().getFieldId().longValue() &&
                            fieldBelong.equals(field.getRelationData().getFieldBelong())) {
                            UpdateCustomFieldsInfoSubType3DTO relationData = field.getRelationData();
                            relationData.setFieldId(fieldInfoPersistedEntity.getFieldId());
                            Map<String, Object> dataRelationUpdateMap = getMapDataRelation(relationData);
                            fieldInfoPersistedEntity.setRelationData(gson.toJson(dataRelationUpdateMap));
                            fieldInfoRepository.save(fieldInfoPersistedEntity);
                        } else {
                            indexRelation++;
                            if (indexRelation == FISRT_RELARION_FIELD) {
                                relationFisrt = fieldInfoPersistedEntity;
                                dataRelationUpdate = field.getRelationData();
                            }
                            if (indexRelation == SECOND_RELARION_FIELD && relationFisrt != null) {
                                relationSecond = fieldInfoPersistedEntity;
                                dataRelationUpdate.setFieldId(relationSecond.getFieldId());
                                Map<String, Object> dataRelationUpdateMap = getMapDataRelation(dataRelationUpdate);
                                relationFisrt.setRelationData(gson.toJson(dataRelationUpdateMap));
                                dataRelationUpdate = field.getRelationData();
                                dataRelationUpdate.setFieldId(relationFisrt.getFieldId());
                                dataRelationUpdateMap.clear();
                                dataRelationUpdateMap = getMapDataRelation(dataRelationUpdate);
                                relationSecond.setRelationData(gson.toJson(dataRelationUpdateMap));
                                fieldInfoRepository.save(relationFisrt);
                                fieldInfoRepository.save(relationSecond);
                                indexRelation = 0;
                            }
                            // process when relation field chage from multi to
                            // single.
                            if (field.getCopyField() != null) {
                                copyField.add(new CopyFieldDTO(field.getCopyField().getFrom(),
                                    fieldInfoPersistedEntity.getFieldId()));
                            }
                        }
                    }
                } else {
                    // 5. Update field
                    // 5.1. update data table field_info
                    FieldInfo fieldDTO = null;
                    Optional<FieldInfo> find = fieldInfoRepository.findByFieldId(field.getFieldId());
                    if (find.isPresent()) {
                        fieldDTO = find.get();
                    }
                    if (fieldDTO != null) {
                        if (field.isUserModifyFlg()) {
                            if (field.getLookupFieldId() != null && field.getLookupFieldId() > 0) {
                                fieldDTO.setFieldLabel(field.getFieldLabel());
                                fieldDTO.setFieldOrder(field.getFieldOrder() != null ? field.getFieldOrder() : fieldDTO.getFieldOrder());
                                fieldInfoRepository.save(fieldDTO);
                            } else {
                                fieldDTO = updateFieldInfo(fieldIdsCreatedOrUpdate, employeeId, field,
                                        fieldInfoMapper.toDto(fieldDTO));
                                idFieldCreateOrUpdate = fieldDTO.getFieldId();
                                if (field.getLookupData() != null && field.getLookupData().getItemReflect() != null
                                        && !field.getLookupData().getItemReflect().isEmpty()) {
                                    for (int j = 0; j < field.getLookupData().getItemReflect().size(); j++) {
                                        UpdateCustomFieldsInfoSubType2DTO itemReflect = field.getLookupData()
                                                .getItemReflect().get(j);
                                        if (itemReflect.getFieldId() < 0) {
                                            updatedReflectLookup.put(itemReflect.getFieldId(), fieldDTO);
                                            updatedReflectLookupDTO.put(itemReflect.getFieldId(), field);
                                        }
                                    }
                                    field.getLookupData().getItemReflect().forEach(itemReflect -> {
                                    });
                                }
                            }
                        }
                        if (field.isInTab()) {
                            tabData.add(fieldDTO.getFieldId());
                        }
                        if (!tabData.isEmpty() && ((!field.isInTab() && !isFieldRelationChildren(field, fieldBelong)) || i == fields.size() - 1)) {
                            tabField.setTabData(gson.toJson(tabData));
                            fieldInfoRepository.save(tabField);
                            tabData = new ArrayList<>();
                        }
                        if (FieldTypeEnum.TAB.getCode().equals(String.valueOf(field.getFieldType()))) {
                            tabField = fieldDTO;
                        }
                        // 5.3 Update data for table field_info_item
                        if (field.isUserModifyFlg()
                                && FieldTypeEnum.PULLDOWN.getCode().equals(field.getFieldType().toString())
                                || FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(field.getFieldType().toString())
                                || FieldTypeEnum.CHECKBOX.getCode().equals(field.getFieldType().toString())
                                || FieldTypeEnum.RADIO.getCode().equals(field.getFieldType().toString())) {
                            updateFieldInfoItems(employeeId, field);
                        }
                    } else {
                        throw new CustomException(
                                ConstantsCommon.EXCLUSIVE_ERROR + " : fieldId = [ " + field.getFieldId()
                                        + " ]  not found",
                                ConstantsCommon.UPDATE_DATE, Constants.EXCLUSIVE_CODE);
                    }
                }
                // 6. Update data to Activity Function, Product
                if (field.getSalesProcess() != null) {
                    if (FieldBelong.ACTIVITY.getValue() == fieldBelong.intValue() ||
                        (field.getFieldBelong() != null && FieldBelong.ACTIVITY.getValue() == field.getFieldBelong().intValue())) {
                        UpdateActivityFormatsRequest updateActivityFormatsRequest = new UpdateActivityFormatsRequest();
                        UpdateActivityFormatsSubType1DTO updateActivityFormatsSubType = new UpdateActivityFormatsSubType1DTO();
                        updateActivityFormatsSubType.setFieldId(idFieldCreateOrUpdate);
                        updateActivityFormatsSubType.setActivityFormatIds(field.getSalesProcess());
                        updateActivityFormatsRequest.setUpdateFieldIdUse(updateActivityFormatsSubType);
                        List<Long> deletedActivityFormats = new ArrayList<>();
                        updateActivityFormatsRequest.setDeletedActivityFormats(deletedActivityFormats);
                        List<ActivitiesFormatDTO> listActivitiesFormat = new ArrayList<>();
                        updateActivityFormatsRequest.setActivityFormats(listActivitiesFormat);
                        try {
                            UpdateActivityFormatOutDTO updateActivityFormatsResponse = restOperationUtils
                                    .executeCallApi(Constants.PathEnum.ACTIVITIES,
                                            ConstantsCommon.URL_API_UPDATE_ACTIVITY_FORMATS, HttpMethod.POST,
                                            updateActivityFormatsRequest, UpdateActivityFormatOutDTO.class,
                                            SecurityUtils.getTokenValue().orElse(null),
                                            jwtTokenUtil.getTenantIdFromToken());
                            if (updateActivityFormatsResponse == null) {
                                throw new CustomException(ConstantsCommon.URL_API_UPDATE_ACTIVITY_FORMATS + "fail");
                            }
                        } catch (Exception e) {
                            throw new CustomException(e.getLocalizedMessage());
                        }
                    } else if (FieldBelong.PRODUCT.getValue() == fieldBelong.intValue() ||
                        (field.getFieldBelong() != null && FieldBelong.PRODUCT.getValue() == field.getFieldBelong().intValue())) {
                        UpdateProductTypesRequest updateProductTypesRequest = new UpdateProductTypesRequest();
                        UpdateProductTypeFieldIdUse updateProductTypeFieldIdUse = new UpdateProductTypeFieldIdUse();
                        updateProductTypeFieldIdUse.setFieldId(idFieldCreateOrUpdate);
                        updateProductTypeFieldIdUse.setProductTypeIds(field.getSalesProcess());
                        updateProductTypesRequest.setUpdateFieldIdUse(updateProductTypeFieldIdUse);
                        List<Long> deletedProductTypes = new ArrayList<>();
                        updateProductTypesRequest.setDeletedProductTypes(deletedProductTypes);
                        List<UpdateProductTypesLst> listUpdateProductTypesLst = new ArrayList<>();
                        updateProductTypesRequest.setProductTypes(listUpdateProductTypesLst);
                        try {
                            UpdateProductTypesResponse updateProductTypesResponse = restOperationUtils.executeCallApi(
                                    Constants.PathEnum.PRODUCTS, ConstantsCommon.URL_API_UPDATE_PRODUCT_TYPES,
                                    HttpMethod.POST, updateProductTypesRequest, UpdateProductTypesResponse.class,
                                    SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());
                            if (updateProductTypesResponse == null) {
                                throw new CustomException(ConstantsCommon.URL_API_UPDATE_PRODUCT_TYPES + "fail");
                            }
                        } catch (Exception e) {
                            throw new CustomException(e.getLocalizedMessage());
                        }

                    }
                }
            }
        }

        // 3.1 Make a copy to create the field
        // if LOOKUP field
        // insert field_info for lookup
        // re update lookup data
        List<UpdateCustomFieldsInfoInDTO> fieldsLookup = fields.stream()
                .filter(p -> FieldTypeEnum.LOOKUP.getCode().equals(p.getFieldType().toString()))
                .collect(Collectors.toList());
        for (UpdateCustomFieldsInfoInDTO field : fieldsLookup) {
            UpdateCustomFieldsInfoSubType1DTO lookupData = field.getLookupData();
            if (lookupData == null || lookupData.getItemReflect() == null) {
                continue;
            }
            Optional<FieldInfo> fieldLookup = fieldInfoRepository.findByFieldId(mapFieldId.get(field.getFieldId()));
            lookupData.getItemReflect().forEach(itemReflect -> {
                Long oldFieldId = itemReflect.getFieldId();
                itemReflect.setFieldId(mapFieldId.get(oldFieldId));
                Optional<FieldInfo> newFieldInfo = fieldInfoRepository.findByFieldId(mapFieldId.get(oldFieldId));
                FieldInfo newFieldDTO = null;
                if (newFieldInfo.isPresent()) {
                    newFieldDTO = newFieldInfo.get();
                    newFieldDTO.setLookupFieldId(mapFieldId.get(field.getFieldId()));
                }
                Long itemReflectId = null;
                String itemReflectFieldType = null;
                if (oldFieldId != null && oldFieldId <= 0 && newFieldDTO != null) {
                    Optional<FieldInfo> copyFieldInfo = fieldInfoRepository.findByFieldId(itemReflect.getItemReflect());
                    if (copyFieldInfo.isPresent()) {
                        itemReflectId = itemReflect.getItemReflect();
                        itemReflectFieldType = copyFieldInfo.get().getFieldType().toString();
                        newFieldDTO.setFieldBelong(fieldBelong);
                        newFieldDTO.setAvailableFlag(copyFieldInfo.get().getAvailableFlag());
                        newFieldDTO.setStatisticsConditionFlag(copyFieldInfo.get().getStatisticsConditionFlag());
                        newFieldDTO.setStatisticsItemFlag(copyFieldInfo.get().getStatisticsItemFlag());
                        newFieldDTO.setConfigValue(copyFieldInfo.get().getConfigValue());
                        newFieldDTO.setCurrencyUnit(copyFieldInfo.get().getCurrencyUnit());
                        newFieldDTO.setDecimalPlace(copyFieldInfo.get().getDecimalPlace());
                        newFieldDTO.setDefaultValue(copyFieldInfo.get().getDefaultValue());
                        newFieldDTO.setIsDoubleColumn(copyFieldInfo.get().getIsDoubleColumn());
                        newFieldDTO.setIsLinkedGoogleMap(copyFieldInfo.get().getIsLinkedGoogleMap());
                        newFieldDTO.setLinkTarget(copyFieldInfo.get().getLinkTarget());
                        newFieldDTO.setIframeHeight(copyFieldInfo.get().getIframeHeight());
                        newFieldDTO.setMaxLength(copyFieldInfo.get().getMaxLength());
                        newFieldDTO.setModifyFlag(copyFieldInfo.get().getModifyFlag());
                        newFieldDTO.setRelationData(copyFieldInfo.get().getRelationData());
                        newFieldDTO.setSelectOrganizationData(copyFieldInfo.get().getSelectOrganizationData());
                        newFieldDTO.setTypeUnit(copyFieldInfo.get().getTypeUnit());
                        newFieldDTO.setUrlTarget(copyFieldInfo.get().getUrlTarget());
                        newFieldDTO.setUrlText(copyFieldInfo.get().getUrlText());
                        newFieldDTO.setUrlType(copyFieldInfo.get().getUrlType());
                        newFieldDTO.setAvailableFlag(copyFieldInfo.get().getAvailableFlag() != null ?
                                copyFieldInfo.get().getAvailableFlag() : Constants.AvailableFlag.AVAILABLE.getValue());
                    }
                }
                if (newFieldDTO != null) {
                    newFieldDTO = fieldInfoRepository.save(newFieldDTO);
                    if (itemReflectId != null && itemReflectId > 0
                            && (FieldTypeEnum.CHECKBOX.getCode().equals(itemReflectFieldType)
                                    || FieldTypeEnum.RADIO.getCode().equals(itemReflectFieldType)
                                    || FieldTypeEnum.PULLDOWN.getCode().equals(itemReflectFieldType)
                                    || FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(itemReflectFieldType))) {
                        List<FieldInfoItem> listFieldInfoItem = fieldInfoItemRepository.findByFieldId(itemReflectId);
                        if (listFieldInfoItem != null && !listFieldInfoItem.isEmpty()) {
                            for (FieldInfoItem fieldInfoItem : listFieldInfoItem) {
                                FieldInfoItem fieldInfoCopy = new FieldInfoItem();
                                fieldInfoCopy.setFieldId(newFieldDTO.getFieldId());
                                fieldInfoCopy.setIsAvailable(fieldInfoItem.getIsAvailable());
                                fieldInfoCopy.setItemOrder(fieldInfoItem.getItemOrder());
                                fieldInfoCopy.setIsDefault(fieldInfoItem.getIsDefault());
                                fieldInfoCopy.setItemLabel(fieldInfoItem.getItemLabel());
                                fieldInfoCopy.setCreatedUser(employeeId);
                                fieldInfoCopy.setUpdatedUser(employeeId);
                                fieldInfoItemRepository.save(fieldInfoCopy);
                            }
                        }
                    }
                }
            });
            if (fieldLookup.isPresent()) {
                FieldInfo fieldDTO = fieldLookup.get();
                fieldDTO.setLookupData(getLookupData(lookupData));
                fieldInfoRepository.save(fieldDTO);
            }
        }

        // 8. Update tab
        if (tabs != null && !tabs.isEmpty()) {
            for (TabsInfoDTO tab : tabs) {
                if (tab.getTabInfoId() != null) {
                    tabsInfoService.findByTabInfoId(tab.getTabInfoId()).ifPresentOrElse(tabInfoDTO -> {
                        tabInfoDTO.setTabOrder(tab.getTabOrder());
                        tabInfoDTO.setIsDisplay(tab.getIsDisplay());
                        tabInfoDTO.setIsDisplaySummary(tab.getIsDisplaySummary());
                        tabInfoDTO.setMaxRecord(tab.getMaxRecord());
                        tabInfoDTO.setUpdatedUser(employeeId);
                        tabsInfoService.save(tabInfoDTO);
                        tabInfoIdsCreatedOrUpdate.add(tabInfoDTO.getTabInfoId());
                    }, () -> {
                        throw new CustomException(
                                ConstantsCommon.EXCLUSIVE_ERROR + ": TabInfoId =  [" + tab.getTabInfoId()
                                        + "] not  found",
                                ConstantsCommon.UPDATE_DATE, Constants.EXCLUSIVE_CODE);
                    });
                }
            }
        }
        // 9. Delete field in deletedFieldsTab
        if (deletedFieldsTab != null && !deletedFieldsTab.isEmpty()) {
            for (Long fieldInfoTabId : deletedFieldsTab) {
                fieldInfoTabService.delete(fieldInfoTabId);
            }
        }
        if (fieldsTab != null && !fieldsTab.isEmpty()) {
            for (FieldInfoTabDTO fieldTabInfo : fieldsTab) {
                // 11. Insert field tab
                if (fieldTabInfo.getFieldInfoTabId() == null) {
                    fieldTabInfo.setCreatedUser(employeeId);
                    fieldTabInfo.setUpdatedUser(employeeId);
                    fieldTabInfo.setTabBelong(fieldBelong);
                    FieldInfoTabDTO fieldInfoTabCreated = fieldInfoTabService.save(fieldTabInfo);
                    fieldInfoTabIdsCreatedOrUpdate.add(fieldInfoTabCreated.getFieldInfoTabId());
                } else {
                    // 12. Update field tab
                    fieldInfoTabService.findByFieldInfoTabId(fieldTabInfo.getFieldInfoTabId())
                            .ifPresentOrElse(fieldTabInfoDTO -> {
                                fieldTabInfoDTO.setFieldOrder(fieldTabInfo.getFieldOrder());
                                fieldTabInfoDTO.setUpdatedUser(employeeId);
                                fieldInfoTabService.save(fieldTabInfoDTO);
                                fieldInfoTabIdsCreatedOrUpdate.add(fieldTabInfoDTO.getFieldInfoTabId());
                            }, () -> {
                                throw new CustomException(
                                        ConstantsCommon.EXCLUSIVE_ERROR + ": FieldInfoTabId = ["
                                                + fieldTabInfo.getFieldInfoTabId() + "] not found",
                                        ConstantsCommon.UPDATE_DATE, Constants.EXCLUSIVE_CODE);
                            });
                }
            }
        }
        updateCustomFieldsInfoOutDTO.setFieldIds(fieldIdsCreatedOrUpdate);
        updateCustomFieldsInfoOutDTO.setTabInfoIds(tabInfoIdsCreatedOrUpdate);
        updateCustomFieldsInfoOutDTO.setFieldInfoTabIds(fieldInfoTabIdsCreatedOrUpdate);
        // update item for elasticsearch
        updateColumnElastichsearch(elasticsearchFieldList, fieldBelong, fieldInfoList);
        return updateCustomFieldsInfoOutDTO;
    }

    /**
     * @param deletedFields
     */
    private void checkLocationUsingItem(List<Long> deletedFields) {
       // a. Check items that are Lookup data
        Integer checkStatusLookupItems = commonFieldInfoRepository.countItemLookupData(deletedFields);
        if (checkStatusLookupItems > 0) {
            throw new CustomException("Items that are being lookup to", ConstantsCommon.FIELD_ID,
                    Constants.LOOK_UP_ERROR);
        }
        // b. Check if the selected items are Key when Lookup data
        Integer checkStatusLookupKey = commonFieldInfoRepository.countKeyLookupData(deletedFields);
        if (checkStatusLookupKey > 0) {
            throw new CustomException("The item is a key look up ", ConstantsCommon.FIELD_ID,
                    Constants.KEY_LOOK_UP_ERROR);
        }
        // c. Check for related items
        // 1. Check the items displayed on the List screen
        Integer checkStatusRelationList = commonFieldInfoRepository.countItemRelationList(deletedFields);
        if (checkStatusRelationList > 0) {
            throw new CustomException("The item displayed on the List screen", ConstantsCommon.FIELD_ID,
                    Constants.RELATION_ERROR);
        }
        // 2. Check the items displayed on the Detail screen
        Integer checkStatusRelationDetail = commonFieldInfoRepository.countItemRelationDetail(deletedFields);
        if (checkStatusRelationDetail > 0) {
            throw new CustomException("The item displayed on the List screen", ConstantsCommon.FIELD_ID,
                    Constants.RELATION_ERROR);
        }
        // d. Check items that are used for calculation
        // Get item information
        List<String> listItemNumberic = fieldInfoItemRepository.getNumbericByFieldId(deletedFields);
        // Check the calculated items
        if (listItemNumberic != null && !listItemNumberic.isEmpty()) {
            Integer checkStatusNumberic = commonFieldInfoRepository.countCalculatorItems(listItemNumberic);
            if (checkStatusNumberic > 0) {
                throw new CustomException("Items that are being calculated", ConstantsCommon.FIELD_ID,
                        Constants.CALCULATOR_ERROR);
            }
        }
    }

    private boolean isFieldRelationChildren(UpdateCustomFieldsInfoInDTO field, Integer fieldBelong) {
        if (!FieldTypeEnum.RELATION.getCode().equals(String.valueOf(field.getFieldType())) || field.getRelationData() == null) {
            return  false;
        }
        if (field.getRelationData().getAsSelf() != null && field.getRelationData().getAsSelf() == 1) {
            return true;
        } else {
            if (field.getRelationData().getFieldBelong().equals(fieldBelong)) {
                return true;
            }
        }
        return false;
    }

    /**
     * get Map data relation by data Relation
     *
     * @param dataRelationUpdate data need for get Map
     * @return Map data relation
     */
    private Map<String, Object> getMapDataRelation(UpdateCustomFieldsInfoSubType3DTO dataRelationUpdate) {
        Map<String, Object> dataRelationUpdateMap = new HashMap<>();
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_FIELD_BELONG, dataRelationUpdate.getFieldBelong());
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_FIELD_ID, dataRelationUpdate.getFieldId().toString());
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_FORMAT, dataRelationUpdate.getFormat());
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_DISPLAY_FIELD_ID,
                dataRelationUpdate.getDisplayFieldId() != null ? dataRelationUpdate.getDisplayFieldId().toString()
                        : null);
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_DISPLAY_TAB, dataRelationUpdate.getDisplayTab());
        List<Map<String, Object>> displayField = new ArrayList<>();
        if (dataRelationUpdate.getDisplayFields() != null && !dataRelationUpdate.getDisplayFields().isEmpty()) {
            for (UpdateCustomFieldsInfoSubType4DTO data : dataRelationUpdate.getDisplayFields()) {
                Map<String, Object> dataField = new HashMap<>();
                dataField.put(ConstantsCommon.KEY_RELATION_FIELD_NAME, data.getFieldName());
                dataField.put(ConstantsCommon.KEY_RELATION_FIELD_ID, data.getFieldId());
                dataField.put(ConstantsCommon.KEY_RELATION_RELATION_ID, data.getRelationId());
                dataField.put(ConstantsCommon.KEY_RELATION_FIELD_BELONG, data.getFieldBelong());
                displayField.add(dataField);
            }
        }
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_DISPLAY_FIELDS, displayField);
        dataRelationUpdateMap.put(ConstantsCommon.KEY_RELATION_ASSELF, dataRelationUpdate.getAsSelf());
        return dataRelationUpdateMap;
    }

    /**
     * update column elastic search
     *
     * @param elasticsearchFieldList
     * @param employeeId
     * @param fieldBelong
     */
    private void updateColumnElastichsearch(List<ElasticsearchFieldDTO> elasticsearchFieldList, int fieldBelong,
            List<String> fieldInfoList) {

        String indexName = Constants.Elasticsearch.getIndexName(fieldBelong);
        if (org.apache.commons.lang3.StringUtils.isBlank(indexName)) {
            return;
        }

        // doc id default
        String targetId = "0";
        String elasticsearchIndex = String.format(Constants.Elasticsearch.ELASTICSEARCH_INDEX_FORMAT,
                jwtTokenUtil.getTenantIdFromToken(), indexName);

        // delete old item
        if (fieldInfoList != null && !fieldInfoList.isEmpty()) {

            for (String fieldName : fieldInfoList) {

                // update column for elasticsearch for delete attribute
                Map<String, Object> sourceMap = new HashMap<>();
                sourceMap.put("source", String.format("ctx._source.employee_data.remove('%s')", fieldName));

                // update column for elasticsearch
                UpdateRequest removeRequest = new UpdateRequest();
                removeRequest.index(elasticsearchIndex);
                removeRequest.doc(sourceMap, XContentType.JSON).id(targetId);
                try {
                    client.update(removeRequest, RequestOptions.DEFAULT);
                } catch (IOException ex) {
                    log.error(ex.getLocalizedMessage());
                }
            }
        }

        // add new item
        if (elasticsearchFieldList.isEmpty()) {
            return;
        }

        Map<String, Object> columnMap = new HashMap<>();
        elasticsearchFieldList.forEach(fieldObj -> {
            if (fieldObj.getFieldType() == null) {
                return;
            }

            Optional<FieldInfo> newFieldInfo = fieldInfoRepository.findByFieldId(fieldObj.getFieldId());
            String fieldName = newFieldInfo.get().getFieldName();

            if (CommonUtils.isTextType(fieldObj.getFieldType())) {
                if (FieldTypeEnum.FILE.getCode().equals(String.valueOf(fieldObj.getFieldType()))) {
                    columnMap.put(fieldName, new ArrayList<Object>());
                } else {
                    columnMap.put(fieldName, "");
                }
            }
        });

        if (!columnMap.isEmpty()) {
            Map<String, Object> docMap = new HashMap<>();
            docMap.put(Constants.Elasticsearch.getColumnData(fieldBelong), columnMap);

            // update column for elasticsearch
            UpdateRequest updateRequest = new UpdateRequest();
            updateRequest.index(elasticsearchIndex);
            updateRequest.doc(docMap, XContentType.JSON).id(targetId);

            try {
                client.update(updateRequest, RequestOptions.DEFAULT);
            } catch (IOException ex) {
                log.error(ex.getLocalizedMessage());
            }
        }
    }

    /**
     * Update field items
     *
     * @param employeeId
     * @param field
     */
    private void updateFieldInfoItems(Long employeeId, UpdateCustomFieldsInfoInDTO field) {
        // 5.3.1. Get information from table field_info_item
        List<Long> listItemId = fieldInfoItemRepository.getItemIdByFieldId(field.getFieldId());
        // 5.3.2. Get the copy data item's lookup information
        String stringFieldId = "%" + field.getFieldId() + "}%";
        List<String> listItemReflect = fieldInfoRepository.getItemReflectByLookupFieldId(stringFieldId);
        List<Long> lookupCopyFieldIds = new ArrayList<>();
        for (String itemReflect : listItemReflect) {
            TypeReference<List<Map<String, Long>>> typeRef = new TypeReference<List<Map<String, Long>>>() {};
            List<Map<String, Long>> listMapItemReflect;
            try {
                listMapItemReflect = objectMapper.readValue(itemReflect, typeRef);
                for (Map<String, Long> mapItemReflect : listMapItemReflect) {
                    for (Map.Entry<String, Long> entry : mapItemReflect.entrySet()) {
                        if (field.getFieldId().equals(entry.getValue())) {
                            Long fieldIdCopy = Long.parseLong(entry.getKey());
                            lookupCopyFieldIds.add(fieldIdCopy);
                        }
                    }
                }
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
        List<Long> listItemIdInScreen = new ArrayList<>();
        List<Long> fieldCreatedAndUpdated = new ArrayList<>();
        for (FieldInfoItemDTO fieldItem : field.getFieldItems()) {
            // insert data
            if (fieldItem.getItemId() == null) {
                fieldItem.setFieldId(field.getFieldId());
                fieldItem.setUpdatedUser(employeeId);
                fieldItem.setCreatedUser(employeeId);
                FieldInfoItemDTO newField = fieldInfoItemService.save(fieldItem);
                listItemIdInScreen.add(newField.getItemId());
                if (lookupCopyFieldIds != null && !lookupCopyFieldIds.isEmpty()) {
                    for (Long lookupCopyFieldId : lookupCopyFieldIds) {
                        FieldInfoItemDTO fieldItemCopy = new FieldInfoItemDTO();
                        fieldItemCopy.setFieldId(lookupCopyFieldId);
                        fieldItemCopy.setUpdatedUser(employeeId);
                        fieldItemCopy.setCreatedUser(employeeId);
                        fieldItemCopy.setItemLabel(fieldItem.getItemLabel());
                        fieldItemCopy.setIsAvailable(fieldItem.getIsAvailable());
                        fieldItemCopy.setItemOrder(fieldItem.getItemOrder());
                        fieldItemCopy.setIsDefault(fieldItem.getIsDefault());
                        Long fieldIdItemCopy = fieldInfoItemService.save(fieldItemCopy).getItemId();
                        fieldCreatedAndUpdated.add(fieldIdItemCopy);
                    }
                }
            } else {
                // 5.3.3. Update data table field_info_item
                if (listItemId.contains(fieldItem.getItemId())) {
                    Optional<FieldInfoItemDTO> getFieldItemByItemId = fieldInfoItemService
                            .findByItemId(fieldItem.getItemId());
                    if (getFieldItemByItemId.isPresent()) {
                        FieldInfoItemDTO fieldItemDTO = getFieldItemByItemId.get();
                        Integer oldOrder = fieldItemDTO.getItemOrder();
                        fieldItemDTO.setItemLabel(fieldItem.getItemLabel());
                        fieldItemDTO.setIsAvailable(fieldItem.getIsAvailable());
                        fieldItemDTO.setItemOrder(fieldItem.getItemOrder());
                        fieldItemDTO.setIsDefault(fieldItem.getIsDefault());
                        fieldItemDTO.setUpdatedUser(employeeId);
                        fieldInfoItemService.save(fieldItemDTO);
                        listItemIdInScreen.add(fieldItemDTO.getItemId());
                        if (lookupCopyFieldIds != null && !lookupCopyFieldIds.isEmpty()) {
                            for (Long lookupCopyFieldId : lookupCopyFieldIds) {
                                List<FieldInfoItem> listFieldInfoItem = fieldInfoItemRepository
                                        .findByFieldId(lookupCopyFieldId);
                                if (listFieldInfoItem != null && !listFieldInfoItem.isEmpty()) {
                                    for (FieldInfoItem fieldInfoItem : listFieldInfoItem) {
                                        if (fieldInfoItem.getItemOrder().equals(oldOrder)) {
                                            FieldInfoItemDTO fieldInfoItemCopy = fieldInfoItemMapper
                                                    .toDto(fieldInfoItem);
                                            fieldInfoItemCopy.setItemLabel(fieldItem.getItemLabel());
                                            fieldInfoItemCopy.setIsAvailable(fieldItem.getIsAvailable());
                                            fieldInfoItemCopy.setItemOrder(fieldItem.getItemOrder());
                                            fieldInfoItemCopy.setIsDefault(fieldItem.getIsDefault());
                                            fieldInfoItemCopy.setUpdatedUser(employeeId);
                                            fieldInfoItemService.save(fieldInfoItemCopy);
                                            fieldCreatedAndUpdated.add(fieldInfoItemCopy.getItemId());
                                        }
                                    }
                                }

                            }
                        }
                    } else {
                        throw new CustomException(ConstantsCommon.EXCLUSIVE_ERROR + ": ItemId = ["
                                + fieldItem.getItemId() + "] not found", ConstantsCommon.UPDATE_DATE,
                                Constants.EXCLUSIVE_CODE);
                    }
                }
            }
        }
        // 5.3.5 delete record field_info_item
        for (Long itemId : listItemId) {
            if (!listItemIdInScreen.contains(itemId)) {
                Integer oldOrder = 0;
                Optional<FieldInfoItem> fieldItemDelete = fieldInfoItemRepository.findByItemId(itemId);
                if (fieldItemDelete.isPresent()) {
                    oldOrder = fieldItemDelete.get().getItemOrder();
                }
                fieldInfoItemService.delete(itemId);
                if (oldOrder != 0 && lookupCopyFieldIds != null && !lookupCopyFieldIds.isEmpty()) {
                    for (Long lookupCopyFieldId : lookupCopyFieldIds) {
                        List<FieldInfoItem> listFieldInfoItem = fieldInfoItemRepository
                                .findByFieldId(lookupCopyFieldId);
                        if (listFieldInfoItem != null && !listFieldInfoItem.isEmpty()) {
                            for (FieldInfoItem fieldInfoItem : listFieldInfoItem) {
                                if (fieldInfoItem.getItemOrder().equals(oldOrder)
                                        && !fieldCreatedAndUpdated.contains(fieldInfoItem.getItemId())) {
                                    fieldInfoItemService.delete(fieldInfoItem.getItemId());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * update field
     *
     * @param fieldIdsCreatedOrUpdate
     * @param employeeId
     * @param field
     * @param fieldDTO
     * @return
     */
    private FieldInfo updateFieldInfo(List<Long> fieldIdsCreatedOrUpdate, Long employeeId,
            UpdateCustomFieldsInfoInDTO field, FieldInfoDTO fieldDTO) {
        FieldInfoDTO newfieldDTO = fieldInfoWithoutDataMapper.toFieldInfoDTOWithoutSomeData(field);
        if (field.getRelationData() != null) {
            Map<String, Object> dataRelationUpdateMap = getMapDataRelation(field.getRelationData());
            newfieldDTO.setRelationData(gson.toJson(dataRelationUpdateMap));
        }
        if (field.getSelectOrganizationData() != null) {
            newfieldDTO.setSelectOrganizationData(gson.toJson(field.getSelectOrganizationData()));
        }
        if (field.getLookupData() != null) {
            newfieldDTO.setLookupData(gson.toJson(field.getLookupData()));
        }
        if (field.getDifferenceSetting() != null) {
            newfieldDTO.setDifferenceSetting(gson.toJson(field.getDifferenceSetting()));
        }
        newfieldDTO.setFieldType(fieldDTO.getFieldType());
        newfieldDTO.setFieldBelong(fieldDTO.getFieldBelong());
        newfieldDTO.setFieldName(fieldDTO.getFieldName());
        newfieldDTO.setFieldId(fieldDTO.getFieldId());
        newfieldDTO.setStatisticsConditionFlag(fieldDTO.getStatisticsConditionFlag());
        newfieldDTO.setStatisticsItemFlag(fieldDTO.getStatisticsItemFlag());
        newfieldDTO.setIsDefault(fieldDTO.getIsDefault());
        newfieldDTO.setMaxLength(fieldDTO.getMaxLength());
        newfieldDTO.setUpdatedUser(employeeId);
        newfieldDTO.setFieldOrder(field.getFieldOrder());
        FieldInfo fieldToSave = fieldInfoMapper.toEntity(newfieldDTO);
        FieldInfo savefieldDTO = fieldInfoRepository.save(fieldToSave);
        fieldIdsCreatedOrUpdate.add(savefieldDTO.getFieldId());
        return savefieldDTO;
    }

    /**
     * get fieldName and fieldOrder
     *
     * @param fieldBelong
     * @param fieldType
     * @return
     */
    private FieldInfo getFieldNameAndOrder(Integer fieldBelong, Integer fieldType) {

        String fieldTypePrefix = Constants.Elasticsearch.getFieldTypePrefix(String.valueOf(fieldType));
        String sequenceName = Constants.Elasticsearch.getFieldTypeSequence(String.valueOf(fieldType));
        String fieldName = String.format(ConstantsCommon.FORMAT_ELASTICSEARCH_INDEX, fieldTypePrefix,
                commonFieldInfoRepository.getSequenceForFieldName(sequenceName));

        Integer order = fieldInfoRepository.getMaxFieldOrder(fieldBelong, fieldType);
        if (order == null) {
            order = 1;
        }
        FieldInfo fieldInfo = new FieldInfo();
        fieldInfo.setFieldName(fieldName);
        fieldInfo.setFieldOrder(order);
        return fieldInfo;
    }

    /**
     * create field
     *
     * @param fieldBelong
     * @param fieldIdsCreatedOrUpdate output
     * @param employeeId
     * @param field
     */
    private FieldInfo createFieldInfo(Integer fieldBelong, List<Long> fieldIdsCreatedOrUpdate, Long employeeId,
            UpdateCustomFieldsInfoInDTO field, Map<Long, Long> mapFieldIdTempAndReal) {
        Long tempFieldId = field.getFieldId();
        FieldInfoDTO fieldInfoDTO = fieldInfoWithoutDataMapper.toFieldInfoDTOWithoutSomeData(field);
        fieldInfoDTO.setFieldBelong(field.getFieldBelong() == null ? fieldBelong : field.getFieldBelong());
        fieldInfoDTO.setIsDefault(false);
        fieldInfoDTO.setMaxLength(null);
        fieldInfoDTO.setStatisticsItemFlag(DEFAULT_VALUE_STATISTICS);
        fieldInfoDTO.setStatisticsConditionFlag(DEFAULT_VALUE_STATISTICS);
        if(fieldInfoDTO.getAvailableFlag() == null) {
            fieldInfoDTO.setAvailableFlag(Constants.AvailableFlag.AVAILABLE.getValue());
        }
        if (field.getRelationData() != null) {
            fieldInfoDTO.setRelationData(gson.toJson(field.getRelationData()));
        }
        if (field.getSelectOrganizationData() != null) {
            fieldInfoDTO.setSelectOrganizationData(gson.toJson(field.getSelectOrganizationData()));
        }
        if (field.getDifferenceSetting() != null) {
            fieldInfoDTO.setDifferenceSetting(gson.toJson(field.getDifferenceSetting()));
        }
        fieldInfoDTO.setUpdatedUser(employeeId);
        fieldInfoDTO.setCreatedUser(employeeId);

        // set null to run trigger auto_update_field_name
        FieldInfo fieldObj = getFieldNameAndOrder(fieldBelong, field.getFieldType());
        fieldInfoDTO.setFieldName(fieldObj.getFieldName());
        if (fieldInfoDTO.getFieldOrder() == null || fieldInfoDTO.getFieldOrder().intValue() <= 0) {
            fieldInfoDTO.setFieldOrder(fieldObj.getFieldOrder());
        }

        FieldInfo fieldInfo = fieldInfoMapper.toEntity(fieldInfoDTO);
        fieldInfo = fieldInfoRepository.save(fieldInfo);
        fieldIdsCreatedOrUpdate.add(fieldInfo.getFieldId());
        // 4.2. Insert data into table field_info_item
        if (field.getFieldItems() != null && !field.getFieldItems().isEmpty()) {
            for (FieldInfoItemDTO fieldItem : field.getFieldItems()) {
                fieldItem.setItemId(null);
                fieldItem.setFieldId(fieldInfo.getFieldId());
                fieldItem.setUpdatedUser(employeeId);
                fieldItem.setCreatedUser(employeeId);
                fieldInfoItemService.save(fieldItem);
            }
        }
        // //key is fieldId (copy)
        // //value is fieldId root
        if (tempFieldId != null && tempFieldId <= 0) {
            // save fieldid temp - fieldid in db
            // key: -xxx
            // value: yyy
            mapFieldIdTempAndReal.put(tempFieldId, fieldInfo.getFieldId());
        }

        return fieldInfo;
    }

    /**
     * delete fields
     *
     * @param deletedFields list of field_id
     */
    private void deleteFields(List<Long> deletedFields, List<Long> copyFieldIds) {
        if (deletedFields != null && !deletedFields.isEmpty()) {
            // field_info_item
            fieldInfoItemRepository.deleteByFieldIds(deletedFields);
            // field_info
            fieldInfoRepository.deleteByFieldIds(deletedFields);
            deletedFields = deletedFields.stream().filter(d -> !copyFieldIds.contains(d)).collect(Collectors.toList());
            // field_info_tab_personal
            fieldInfoTabPersonalRepository.deleteByFieldIds(deletedFields);
            // field_info_tab
            fieldInfoTabRepository.deleteByFieldIds(deletedFields);
            // field_info_personal
            fieldInfoPersonalRepository.deleteByFieldIds(deletedFields);
            // delete field relation in field info personal
            fieldInfoPersonalRepository.deleteByRelationFieldIds(deletedFields);
        }
    }

    /**
     * update Relation field that are converted from multi to single relation
     *
     * @param copyField list of old and new Id of field converted
     */
    private void updateRelationFields(List<CopyFieldDTO> copyField) {
        if (copyField != null && !copyField.isEmpty()) {
            copyField.forEach(field -> {
                fieldInfoTabRepository.updateFieldId(field.getFrom(), field.getTo());
                fieldInfoPersonalRepository.updateFieldId(field.getFrom(), field.getTo());
                listViewSettingsFiltersRepository.updateFieldId(field.getFrom(), field.getTo());
            });
        }
    }

    /**
     * Convert lookupData to json
     *
     * @param lookupData data need convert
     * @return string json data
     */
    private String getLookupData(UpdateCustomFieldsInfoSubType1DTO lookupData) {
        HashMap<String, Object> lookupDataMap = new HashMap<>();
        if (lookupData.getFieldBelong() != null) {
            lookupDataMap.put(ConstantsCommon.FIELD_BELONG, lookupData.getFieldBelong());
        }
        if (lookupData.getSearchKey() != null) {
            lookupDataMap.put(ConstantsCommon.SEARCH_KEY, lookupData.getSearchKey());
        }
        if (lookupData.getItemReflect() != null) {
            List<Object> valueItemReflect = new ArrayList<>();
            for (UpdateCustomFieldsInfoSubType2DTO item : lookupData.getItemReflect()) {
                HashMap<String, Object> itemMap = new HashMap<>();
                if (item.getFieldId() != null) {
                    itemMap.put(item.getFieldId().toString(), item.getItemReflect());
                    valueItemReflect.add(itemMap);
                }
            }
            lookupDataMap.put(ConstantsCommon.ITEM_REFLECT, valueItemReflect);
        }
        return gson.toJson(lookupDataMap);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.FieldInfoService#getFieldsInfo(
     * java.lang.Integer, java.lang.Integer, java.lang.Long)
     */
    @SuppressWarnings("unchecked")
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<FieldsInfoOutDTO> getFieldsInfo(Integer fieldBelong, Integer fieldType, Long fieldId) {
        // 1. Check field Belong
        if (fieldBelong == null || !FieldBelong.getFieldBelongList().contains(fieldBelong)) {
            return Collections.emptyList();
        }
        List<FieldsInfoOutDTO> fields = new ArrayList<>();
        List<FieldsInfoQueryDTO> fieldInfoList = commonFieldInfoRepository.getFieldsInfoByFieldBelongTypeId(fieldBelong,
                fieldType, fieldId);
        fieldInfoList.forEach(field -> {
            FieldsInfoOutDTO out = fieldsInfoQueryMapper.toFieldInfoOut(field);
            if (field.getLookupData() != null) {
                out.setLookupData(commonFieldInfoService.getLookupData(Collections.emptyMap(), objectMapper,
                        field.getLookupData()));
            }
            if (StringUtils.isNotBlank(field.getRelationData())) {
                RelationDataDTO relationDataDto = new RelationDataDTO();
                try {
                    relationDataDto = objectMapper.readValue(field.getRelationData(), RelationDataDTO.class);
                } catch (IOException e2) {
                    log.error("Relation Data Error", e2);
                }
                out.setRelationData(relationDataDto);
            }
            if (StringUtils.isNotBlank(field.getSelectOrganizationData())) {
                SelectOrganizationDataDTO selectOrganizationData = new SelectOrganizationDataDTO();
                try {
                    selectOrganizationData = objectMapper.readValue(field.getSelectOrganizationData(),
                            SelectOrganizationDataDTO.class);
                } catch (IOException e2) {
                    log.error("selectOrganization Data Error", e2);
                }
                out.setSelectOrganizationData(selectOrganizationData);
            }

            if (StringUtils.isNotBlank(field.getTabData())) {
                List<Integer> tabData = new ArrayList<>();
                try {
                    tabData = objectMapper.readValue(field.getTabData(), List.class);
                } catch (IOException e3) {
                    log.error("Tab Data Error", e3);
                }
                out.setTabData(tabData);
            }
            List<FieldInfoItem> fieldItems = fieldInfoItemRepository.findByFieldId(field.getFieldId());
            if(fieldItems != null) {
                out.setFieldItems(fieldInfoItemMapper.toDto(fieldItems));
            }
            fields.add(out);
        });
        // 2. get fields Info
        return fields;
    }
}
