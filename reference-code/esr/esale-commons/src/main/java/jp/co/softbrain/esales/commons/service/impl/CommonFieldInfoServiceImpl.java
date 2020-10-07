package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.micrometer.core.instrument.util.StringUtils;
import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfoPersonal;
import jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoItemRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoPersonalRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.DifferenceSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.DisplayFieldDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemLabelDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalFieldItemOutDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType10DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType11DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType4DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType5DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType6DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType7DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType8DTO;
import jp.co.softbrain.esales.commons.service.dto.GetRelationDataSubType9DTO;
import jp.co.softbrain.esales.commons.service.dto.ItemReflectDTO;
import jp.co.softbrain.esales.commons.service.dto.LookupDataDTO;
import jp.co.softbrain.esales.commons.service.dto.SelectOrganizationDataDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn1DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn2DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn3DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutOutDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateFieldInfoPersonalInDTO;
import jp.co.softbrain.esales.commons.service.mapper.CustomFieldInfoResponseMapper;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoPersonalResponseMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsRequest;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType1DTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType2DTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType3DTO;
import jp.co.softbrain.esales.utils.dto.RelationDataDTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType1DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType2DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType3DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType4DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType5DTO;

/**
 * Service Implementation for managing {@link FieldInfoPersonal}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CommonFieldInfoServiceImpl implements CommonFieldInfoService {

    private final Logger log = LoggerFactory.getLogger(CommonFieldInfoServiceImpl.class);

    private static final String MSG_VALIDATE_FAILDED = "Validate failded.";

    private static final String EMPLOYEE_ID = "employeeId";

    @Autowired
    private CommonFieldInfoRepository commonFieldInfoRepository;

    @Autowired
    private FieldInfoItemRepository fieldInfoItemRepository;

    private final FieldInfoPersonalRepository fieldInfoPersonalRepository;
    private final CustomFieldInfoResponseMapper customFieldInfoResponseMapper;
    private final FieldInfoPersonalResponseMapper fieldInfoPersonalResponseMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Constructor
     *
     * @param fieldInfoPersonalRepository
     * @param customFieldInfoResponseMapper
     * @param fieldInfoPersonalResponseMapper
     */
    public CommonFieldInfoServiceImpl(FieldInfoPersonalRepository fieldInfoPersonalRepository,
            CustomFieldInfoResponseMapper customFieldInfoResponseMapper,
            FieldInfoPersonalResponseMapper fieldInfoPersonalResponseMapper) {
        this.fieldInfoPersonalRepository = fieldInfoPersonalRepository;
        this.customFieldInfoResponseMapper = customFieldInfoResponseMapper;
        this.fieldInfoPersonalResponseMapper = fieldInfoPersonalResponseMapper;
    }

    /**
     * Validate parameter of API getFieldInfoPersonal
     *
     * @param searchConditions parameter object
     */
    private void validateFieldInfoPersonalsParam(FieldInfoPersonalsInputDTO searchConditions) {
        if (searchConditions.getEmployeeId() == null) {
            throw new CustomException(MSG_VALIDATE_FAILDED, EMPLOYEE_ID, Constants.RIQUIRED_CODE);
        }
        if (searchConditions.getEmployeeId() <= 0) {
            throw new CustomException(MSG_VALIDATE_FAILDED, EMPLOYEE_ID, Constants.NUMBER_MIN_CODE,
                    new String[] { "1" });
        }

        // field_belong
        if (searchConditions.getFieldBelong() == null) {
            throw new CustomException(MSG_VALIDATE_FAILDED, ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.RIQUIRED_CODE);
        }
        if (searchConditions.getFieldBelong() <= 0) {
            throw new CustomException(MSG_VALIDATE_FAILDED, ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.NUMBER_MIN_CODE, new String[] { "1" });
        }

        // extensionBelong
        if (searchConditions.getExtensionBelong() == null) {
            throw new CustomException(MSG_VALIDATE_FAILDED, ConstantsCommon.EXTENSION_BELONG_KEY_WORD,
                    Constants.RIQUIRED_CODE);
        }
        if (searchConditions.getExtensionBelong() <= 0) {
            throw new CustomException(MSG_VALIDATE_FAILDED, ConstantsCommon.EXTENSION_BELONG_KEY_WORD,
                    Constants.NUMBER_MIN_CODE, new String[] { "1" });
        }
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getFieldInfoPersonals(jp.co.softbrain.esales.commons.service.dto.
     * FieldInfoPersonalsInputDTO)
     */
    @SuppressWarnings("unchecked")
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<FieldInfoPersonalsOutDTO> getFieldInfoPersonals(FieldInfoPersonalsInputDTO searchConditions) {
        // 1. Validate parameters
        // employee_id
        validateFieldInfoPersonalsParam(searchConditions);

		// 2. Get field personal info
		List<FieldInfoPersonalResponseDTO> fieldInfoList = commonFieldInfoRepository
				.getFieldInfoPersonals(searchConditions);
		// if field info list hollow then get field info list default
		if(fieldInfoList.isEmpty()) {
			searchConditions.setSelectedTargetType(0);
			searchConditions.setSelectedTargetId(0L);
			fieldInfoList = commonFieldInfoRepository
					.getFieldInfoPersonals(searchConditions);
		}
		List<FieldInfoPersonalsOutDTO> fieldInfoRtnList = new ArrayList<>();
		Map<String, FieldInfoPersonalsOutDTO> fieldInfoInMap = new HashMap<>();
		Map<Long, List<FieldInfoPersonalFieldItemOutDTO>> fieldInfoOutMap = new HashMap<>();
		Map<Long, LookupDataDTO> lookupDataRtnMap = new HashMap<>();
		Map<Long, jp.co.softbrain.esales.commons.service.dto.RelationDataDTO> relationDataRtnMap = new HashMap<>();
        Map<Long, SelectOrganizationDataDTO> selectOrganizationDataRtnMap = new HashMap<>();
        Map<Long, List<Long>> lstTabData = new HashMap<>();
        Map<Long, String> itemReflectLabelMap = new HashMap<>();
        Map<Long, DifferenceSettingDTO> differenceSettingRtnMap = new HashMap<>();

        fieldInfoList.forEach(field -> itemReflectLabelMap.put(field.getFieldId(), field.getFieldLabel()));

        fieldInfoList.forEach(e -> {
            // Copy flat fields to Wrapper DTO
            FieldInfoPersonalsOutDTO c = fieldInfoPersonalResponseMapper.toResponseWrapper(e);
            String key = c.getFieldId()
                    + (c.getRelationFieldId() != null ? "_" + c.getRelationFieldId().longValue() : "_0");
            if (!fieldInfoInMap.containsKey(key)) {
                fieldInfoInMap.put(key, c);
            }

            // Prepare field items map
            FieldInfoPersonalFieldItemOutDTO fieldItemDto = new FieldInfoPersonalFieldItemOutDTO();
            fieldItemDto.setItemId(e.getItemId());
            fieldItemDto.setItemLabel(e.getItemLabel());
            fieldItemDto.setItemOrder(e.getItemOrder());
            fieldItemDto.setIsDefault(e.getItemIsDefault());
            fieldItemDto.setIsAvailable(e.getItemIsAvailable());
            fieldItemDto.setUpdatedDate(e.getItemUpdatedDate());

            lookupDataRtnMap.put(c.getFieldId(), getLookupData(itemReflectLabelMap, objectMapper, e.getLookupData()));
            jp.co.softbrain.esales.commons.service.dto.RelationDataDTO relationDataDto = new jp.co.softbrain.esales.commons.service.dto.RelationDataDTO();
            if (StringUtils.isNotBlank(e.getRelationData())) {
                try {
                    relationDataDto = objectMapper.readValue(e.getRelationData(), jp.co.softbrain.esales.commons.service.dto.RelationDataDTO.class);
                } catch (IOException e2) {
                    log.error("Relation Data Error", e2);
                }
            }
            relationDataRtnMap.put(c.getFieldId(), relationDataDto);

            if (StringUtils.isNotBlank(e.getDifferenceSetting())) {
                DifferenceSettingDTO differenceSettingDto = new DifferenceSettingDTO();
                try {
                    differenceSettingDto = objectMapper.readValue(e.getDifferenceSetting(), DifferenceSettingDTO.class);
                } catch (IOException e2) {
                    log.error(" differenceSetting Data Error", e2);
                }
                differenceSettingRtnMap.put(c.getFieldId(), differenceSettingDto);
            }

            SelectOrganizationDataDTO selectOrganizationDataDto = new SelectOrganizationDataDTO();
            if (StringUtils.isNotBlank(e.getSelectOrganizationData())) {
                try {
                    selectOrganizationDataDto = objectMapper.readValue(e.getSelectOrganizationData(), SelectOrganizationDataDTO.class);
                } catch (IOException e2) {
                    log.error("SelectOrganization Data Data Error", e2);
                }
            }
            selectOrganizationDataRtnMap.put(c.getFieldId(), selectOrganizationDataDto);

            List<Long> tabData = new ArrayList<>();
            if (StringUtils.isNotBlank(e.getTabData())) {
                try {
                    tabData = objectMapper.readValue(e.getTabData(), List.class);
                } catch (IOException e3) {
                    log.error("Tab Data Error", e3);
                }
            }
            lstTabData.put(c.getFieldId(), tabData);

            if (!fieldInfoOutMap.containsKey(c.getFieldId())) {
                List<FieldInfoPersonalFieldItemOutDTO> fieldItemList = new ArrayList<>();
                if(fieldItemDto.getItemId() != null) {
                    fieldItemList.add(fieldItemDto);
                }
                fieldInfoOutMap.put(c.getFieldId(), fieldItemList);
            } else {
                if(fieldItemDto.getItemId() != null) {
                    fieldInfoOutMap.get(c.getFieldId()).add(fieldItemDto);
                }
            }
        });
        fieldInfoInMap.forEach((k, v) -> {
            Long key = Long.parseLong(k.split("_")[0]);
            v.setFieldItems(fieldInfoOutMap.get(key));
            v.setLookupData(lookupDataRtnMap.get(key));
            v.setRelationData(relationDataRtnMap.get(key));
            v.setSelectOrganizationData(selectOrganizationDataRtnMap.get(key));
            v.setTabData(lstTabData.get(key));
            v.setDifferenceSetting(differenceSettingRtnMap.get(key));
            fieldInfoRtnList.add(v);
        });
        return fieldInfoRtnList;
    }

    /**
     * validate parameter field belong
     *
     * @param fieldBelong field belong
     */
    private void validateCustomFieldsInfo(Integer fieldBelong) {
        // 1. validate parameter
        if (fieldBelong == null || !FieldBelong.getFieldBelongList().contains(fieldBelong)) {
            throw new CustomException(MSG_VALIDATE_FAILDED, ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.RIQUIRED_CODE);
        }
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getCustomFieldInfo(java.lang.Integer)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomFieldsInfoOutDTO> getCustomFieldsInfo(Integer fieldBelong) {
        validateCustomFieldsInfo(fieldBelong);
        // 2. Get custom field info
        List<CustomFieldsInfoResponseDTO> fieldInfoList = commonFieldInfoRepository.getCustomFieldsInfo(fieldBelong,
                null);
        return getDataCustomFields(fieldInfoList);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getLookupData(java.util.Map, com.fasterxml.jackson.databind.ObjectMapper,
     * java.lang.String)
     */
    @SuppressWarnings("unchecked")
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public LookupDataDTO getLookupData(Map<Long, String> itemReflectLabelMap, ObjectMapper mapper,
            String lookupDataString) {
        if (StringUtils.isNotBlank(lookupDataString)) {
            TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
            Map<String, Object> lookupDataMap = new HashMap<>();
            try {
                lookupDataMap = mapper.readValue(lookupDataString, typeRef);
            } catch (IOException e2) {
                log.error("Error when read employeeData: ", e2);
            }
            LookupDataDTO lookupDataDTOFinal = new LookupDataDTO();
            Optional.ofNullable((Number) lookupDataMap.get(ConstantsCommon.FIELD_BELONG))
                    .ifPresent(ext -> lookupDataDTOFinal.setFieldBelong(ext.intValue()));
            Optional.ofNullable((Number) lookupDataMap.get(ConstantsCommon.SEARCH_KEY))
                    .ifPresent(searhKey -> lookupDataDTOFinal.setSearchKey(searhKey.longValue()));
            Object itemReflect = lookupDataMap.get(ConstantsCommon.ITEM_REFLECT);
            if (itemReflect != null && !ConstantsCommon.EMPTY_JSON_OBJECT_STRING.equals(itemReflect.toString())) {
                Optional.ofNullable((ArrayList<Object>) itemReflect)
                        .ifPresent(itemReflectList -> itemReflectList.forEach(obj -> {
                            Map<String, Object> map = mapper.convertValue(obj, Map.class);
                            if (map != null) {
                                map.forEach((key, value) -> {
                                    ItemReflectDTO dataField = new ItemReflectDTO();
                                    dataField.setFieldId(Long.valueOf(key));
                                    dataField.setFieldLabel(itemReflectLabelMap.get(dataField.getFieldId()));
                                    dataField.setItemReflect(((Number) value).longValue());
                                    lookupDataDTOFinal.getItemReflect().add(dataField);
                                });
                            }
                        }));
            }
            return lookupDataDTOFinal;
        }
        return null;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * updateFieldInfoPersonals(java.lang.Integer, java.lang.Integer,
     * java.util.List)
     */
    @Override
    @Transactional
    public List<Long> updateFieldInfoPersonals(Integer fieldBelong, Integer extensionBelong, Integer selectedTargetType,
            Long selectedTargetId, List<UpdateFieldInfoPersonalInDTO> updateInfoList) {
        // Get employee id from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1 validate Parameter
        this.validateUpdateFieldInfoPersonals(employeeId, extensionBelong, updateInfoList, fieldBelong);
        // 2. delete data in fieldInfoPersonal
        // get data
        // share list then change employee id -1
        if (ConstantsCommon.SHARE_LIST.equals(selectedTargetType)) {
            employeeId = ConstantsCommon.EMPLOYEE_ID_SHARE_LIST;
        }
        List<FieldInfoPersonal> fieldInfoPersonalList = fieldInfoPersonalRepository
                .findByEmployeeIdAndExtensionBelongAndFieldBelongAndSelectedTargetTypeAndSelectedTargetId(employeeId,
                        extensionBelong,
                        fieldBelong, selectedTargetType, selectedTargetId);
        if (fieldInfoPersonalList != null && !fieldInfoPersonalList.isEmpty()) {
            // delete
            fieldInfoPersonalRepository.deleteAll(fieldInfoPersonalList);
        }
        // 3. insert data into fieldInfoPersonal
        List<Long> entityIdList = new ArrayList<>();
        List<FieldInfoPersonal> entityList = new ArrayList<>();
        for (UpdateFieldInfoPersonalInDTO item : updateInfoList) {
            if (item.getFieldId() == null)
                continue;
            FieldInfoPersonal entity = new FieldInfoPersonal();
            entity.setEmployeeId(employeeId);
            entity.setFieldId(item.getFieldId());
            entity.setExtensionBelong(extensionBelong);
            entity.setFieldBelong(fieldBelong);
            entity.setFieldOrder(item.getFieldOrder());
            entity.setCreatedUser(employeeId);
            entity.setUpdatedUser(employeeId);
            entity.setIsColumnFixed(item.getIsColumnFixed());
            entity.setColumnWidth(item.getColumnWidth());
            entity.setRelationFieldId(item.getRelationFieldId());
            entity.setSelectedTargetType(selectedTargetType);
            entity.setSelectedTargetId(selectedTargetId);
            entityList.add(entity);
        }
        entityList = fieldInfoPersonalRepository.saveAll(entityList);
        entityList.forEach(entity -> entityIdList.add(entity.getFieldInfoPersonalId()));
        return entityIdList;
    }

    /**
     * validate Parameter UpdateFieldInfoPersonals
     *
     * @param employeeId id of employee
     * @param extensionBelong functions used field_info_personal
     * @param updateInfoList Field info personal update
     */
    private void validateUpdateFieldInfoPersonals(Long employeeId, Integer extensionBelong,
            List<UpdateFieldInfoPersonalInDTO> updateInfoList, Integer fieldBelong) {
        // 1. validate parameter
        // employeeId > 0
        if (employeeId == null || employeeId.longValue() <= 0) {
            throw new CustomException("employeeId must greater than 0", ConstantsCommon.EMPLOYEE_ID,
                    Constants.RIQUIRED_CODE);
        }
        // extensionBelong > 0
        if (extensionBelong == null || extensionBelong.intValue() <= 0) {
            throw new CustomException("extensionBelong must greater than 0",
                    ConstantsCommon.EXTENSION_BELONG_KEY_WORD, Constants.RIQUIRED_CODE);
        }
        // fieldBelong > 0
        if (fieldBelong == null || fieldBelong.longValue() <= 0) {
            throw new CustomException("fieldBelong must greater than 0", ConstantsCommon.PARAM_FIELD_BELONG,
                    Constants.RIQUIRED_CODE);
        }
        // check updateInfoList
        if (updateInfoList == null || updateInfoList.isEmpty()) {
            throw new CustomException("fieldinfos must be having data", ConstantsCommon.FIELD_INFOS,
                    Constants.RIQUIRED_CODE);
        }
        // Step 1, Iterate this updateInfoList for getting each
        // field_info_personal
        List<Long> fieldIds = new ArrayList<>();
        for (UpdateFieldInfoPersonalInDTO input : updateInfoList) {
            if (input.getFieldId() == null)
                continue;
            fieldIds.add(input.getFieldId());
        }
        // check fieldIds
        if (fieldIds.isEmpty()) {
            throw new CustomException("fieldInfos.fieldId must be having data", ConstantsCommon.FIELD_INFOS,
                    Constants.RIQUIRED_CODE);
        }
        // Check field id is available
        List<Long> fieldIdsDistinct = fieldIds.stream().distinct().collect(Collectors.toList());
        Long count = commonFieldInfoRepository.countFieldInfoPersonalByFieldIds(fieldIdsDistinct);
        if (count == null || count.longValue() != fieldIdsDistinct.size()) {
            // error_code
            throw new CustomException("fieldInfos.fieldIds not valid", ConstantsCommon.FIELD_INFOS,
                    Constants.EXCLUSIVE_CODE);
        }
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * updateDetailScreenLayout(java.lang.Integer, java.util.List,
     * java.util.List, java.util.List, java.util.List, java.util.List,
     * java.util.List)
     */
    @Override
    public UpdateDetailScreenLayoutOutDTO updateDetailScreenLayout(Integer fieldBelong, List<Long> deleteFields,
            List<UpdateDetailScreenLayoutIn1DTO> fields, List<Long> deleteTabs,
            List<UpdateDetailScreenLayoutIn2DTO> tabs, List<Long> deleteFieldsTab,
            List<UpdateDetailScreenLayoutIn3DTO> fieldsTab) {
        UpdateDetailScreenLayoutOutDTO outDTO = new UpdateDetailScreenLayoutOutDTO();
        outDTO.setCode("200");
        outDTO.setMessage("??");
        return outDTO;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getFieldInfoItemByFieldBelong(java.lang.Integer)
     */
    public List<FieldInfoItemLabelDTO> getFieldInfoItemByFieldBelong(Integer fieldBelong) {
        return fieldInfoItemRepository.findFieldInfoItemByFieldBelong(fieldBelong);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getCustomFieldsInfoByFieldIds(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomFieldsInfoOutDTO> getCustomFieldsInfoByFieldIds(List<Long> fieldIds) {
        List<CustomFieldsInfoResponseDTO> fieldInfoList = commonFieldInfoRepository.getCustomFieldsInfo(null, fieldIds);
        return getDataCustomFields(fieldInfoList);
    }

    /**
     * @param fieldInfoList get
     * @return
     */
    @SuppressWarnings("unchecked")
    private List<CustomFieldsInfoOutDTO> getDataCustomFields(List<CustomFieldsInfoResponseDTO> fieldInfoList) {
        List<CustomFieldsInfoOutDTO> fieldInfoRtnList = new ArrayList<>();
        Map<Long, CustomFieldsInfoOutDTO> fieldInfoMap = new HashMap<>();
        Map<Long, List<CustomFieldsItemResponseDTO>> fieldInfoRtnMap = new HashMap<>();
        Map<Long, LookupDataDTO> lookupDataRtnMap = new HashMap<>();
        Map<Long, jp.co.softbrain.esales.commons.service.dto.RelationDataDTO> relationDataRtnMap = new HashMap<>();
        Map<Long, SelectOrganizationDataDTO> selectOrganizationDataRtnMap = new HashMap<>();
        Map<Long, List<Integer>> lstTabData = new HashMap<>();
        Map<Long, String> itemReflectLabelMap = new HashMap<>();
        Map<Long, DifferenceSettingDTO> differenceSettingRtnMap = new HashMap<>();

        fieldInfoList.forEach(field -> itemReflectLabelMap.put(field.getFieldId(), field.getFieldLabel()));

        fieldInfoList.forEach(e -> {
            // Copy flat fields to Wrapper DTO
            CustomFieldsInfoOutDTO c = customFieldInfoResponseMapper.toResponseWrapper(e);
            if (!fieldInfoMap.containsKey(c.getFieldId())) {
                fieldInfoMap.put(c.getFieldId(), c);
            }
            // Prepare field items map
            CustomFieldsItemResponseDTO fieldItemDto = new CustomFieldsItemResponseDTO();
            fieldItemDto.setItemId(e.getItemItemId());
            fieldItemDto.setIsDefault(e.getItemIsDefault());
            fieldItemDto.setIsAvailable(e.getItemIsAvailable());
            fieldItemDto.setItemOrder(e.getItemItemOrder());
            fieldItemDto.setItemLabel(e.getItemItemLabel());
            fieldItemDto.setUpdatedDate(e.getUpdatedDate());
            lookupDataRtnMap.put(c.getFieldId(), getLookupData(itemReflectLabelMap, objectMapper, e.getLookupData()));

            if (StringUtils.isNotBlank(e.getRelationData())) {
                jp.co.softbrain.esales.commons.service.dto.RelationDataDTO relationDataDto = new jp.co.softbrain.esales.commons.service.dto.RelationDataDTO();
                try {
                    relationDataDto = objectMapper.readValue(e.getRelationData(),
                            jp.co.softbrain.esales.commons.service.dto.RelationDataDTO.class);
                } catch (IOException e2) {
                    log.error("Relation Data Error", e2);
                }
                relationDataRtnMap.put(c.getFieldId(), relationDataDto);
            }

            if (StringUtils.isNotBlank(e.getDifferenceSetting())) {
                DifferenceSettingDTO differenceSettingDto = new DifferenceSettingDTO();
                try {
                    differenceSettingDto = objectMapper.readValue(e.getDifferenceSetting(), DifferenceSettingDTO.class);
                } catch (IOException e2) {
                    log.error(" differenceSetting Data Error", e2);
                }
                differenceSettingRtnMap.put(c.getFieldId(), differenceSettingDto);
            }

            if (StringUtils.isNotBlank(e.getSelectOrganizationData())) {
                SelectOrganizationDataDTO selectOrganizationDataDto = new SelectOrganizationDataDTO();
                try {
                    selectOrganizationDataDto = objectMapper.readValue(e.getSelectOrganizationData(),
                            SelectOrganizationDataDTO.class);
                } catch (IOException e2) {
                    log.error("selectOrganization Data Error", e2);
                }
                selectOrganizationDataRtnMap.put(c.getFieldId(), selectOrganizationDataDto);
            }

            List<Integer> tabData = new ArrayList<>();
            if (StringUtils.isNotBlank(e.getTabData())) {
                try {
                    tabData = objectMapper.readValue(e.getTabData(), List.class);
                } catch (IOException e3) {
                    log.error("Tab Data Error", e3);
                }
            }
            lstTabData.put(c.getFieldId(), tabData);
            if (!fieldInfoRtnMap.containsKey(c.getFieldId())) {
                List<CustomFieldsItemResponseDTO> fieldItemList = new ArrayList<>();
                if (fieldItemDto.getItemId() != null) {
                    fieldItemList.add(fieldItemDto);
                }
                fieldInfoRtnMap.put(c.getFieldId(), fieldItemList);
            } else {
                if (fieldItemDto.getItemId() != null) {
                    fieldInfoRtnMap.get(c.getFieldId()).add(fieldItemDto);
                }
            }
        });

        fieldInfoMap.forEach((k, v) -> {
            v.setFieldItems(fieldInfoRtnMap.get(k));
            v.setLookupData(lookupDataRtnMap.get(k));
            v.setRelationData(relationDataRtnMap.get(k));
            v.setSelectOrganizationData(selectOrganizationDataRtnMap.get(k));
            v.setTabData(lstTabData.get(k));
            v.setDifferenceSetting(differenceSettingRtnMap.get(k));
            fieldInfoRtnList.add(v);
        });
        return fieldInfoRtnList;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.CommonFieldInfoService#
     * getRelationData(java.lang.Integer, java.util.List, java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetRelationDataOutDTO getRelationData(Integer fieldBelong, List<Long> listIds, List<Long> fieldIds) {

        // 1. Validate parameter
        validateGetRelationData(fieldBelong, listIds, fieldIds);
        GetRelationDataOutDTO response = new GetRelationDataOutDTO();
        List<GetRelationDataSubType1DTO> listRelationData = new ArrayList<>();
        List<GetRelationDataSubType5DTO> listFieldItems = new ArrayList<>();
        List<GetRelationDataSubType6DTO> listEmployee = new ArrayList<>();
        List<GetRelationDataSubType8DTO> listDepartments = new ArrayList<>();
        List<GetRelationDataSubType10DTO> listGroups = new ArrayList<>();
        List<GetRelationDataSubType11DTO> listEmployees = new ArrayList<>();

        // 2. Get item information
        List<CustomFieldsInfoOutDTO> itemData = getCustomFieldsInfoByFieldIds(fieldIds);
        // 3. Get data functions
        GetDataByRecordIdsRequest request = new GetDataByRecordIdsRequest();
        if (itemData != null && !itemData.isEmpty()) {
            getDataRequest(listIds, itemData, request);
        } else {
            response.setRelationData(listRelationData);
            response.setDepartments(listDepartments);
            response.setEmployee(listEmployee);
            response.setEmployees(listEmployees);
            response.setFieldItems(listFieldItems);
            response.setGroups(listGroups);
            return response;
        }
        GetDataByRecordIdsOutDTO getDataByRecordIdsResponse = null;
        String token = SecurityUtils.getTokenValue().orElse(null);
        // call api GetDataByRecordIds
        getDataByRecordIdsResponse = restOperationUtils.executeCallApi(Constants.PATH_ENUM_MAP.get(fieldBelong),
                ConstantsCommon.API_GET_DATA_BY_RECORD_IDS, HttpMethod.POST, request, GetDataByRecordIdsOutDTO.class,
                token, jwtTokenUtil.getTenantIdFromToken());
        if (getDataByRecordIdsResponse != null) {
            getDataResponse(listRelationData, listFieldItems, listEmployee, listDepartments, listGroups, listEmployees,
                    getDataByRecordIdsResponse);
        }
        for (int i = 0; i < listRelationData.size(); i++) {
            List<GetRelationDataSubType2DTO> dataInfos = listRelationData.get(i).getDataInfos();
            if (dataInfos != null) {
                for (int j = 0; j < dataInfos.size(); j++) {
                    GetRelationDataSubType2DTO dataInfo = dataInfos.get(j);
                    itemData.forEach(field -> {
                        if (field.getFieldName().equals(dataInfo.getFieldName())) {
                            dataInfo.setDecimalPlace(field.getDecimalPlace());
                            dataInfo.setIsLinkedGoogleMap(field.getIsLinkedGoogleMap());
                        }
                    });
                }
            }
        }

        response.setRelationData(listRelationData);
        response.setDepartments(listDepartments);
        response.setEmployee(listEmployee);
        response.setEmployees(listEmployees);
        response.setFieldItems(listFieldItems);
        response.setGroups(listGroups);
        return response;
    }

    /**
     * get response for api
     *
     * @param listRelationData data need for get
     * @param listFieldItems data need for get
     * @param listEmployee data need for get
     * @param listDepartments data need for get
     * @param listGroups data need for get
     * @param listEmployees data need for get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getDataResponse(List<GetRelationDataSubType1DTO> listRelationData,
            List<GetRelationDataSubType5DTO> listFieldItems, List<GetRelationDataSubType6DTO> listEmployee,
            List<GetRelationDataSubType8DTO> listDepartments, List<GetRelationDataSubType10DTO> listGroups,
            List<GetRelationDataSubType11DTO> listEmployees, GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        if (getDataByRecordIdsResponse.getRelationData() != null
                && !getDataByRecordIdsResponse.getRelationData().isEmpty()) {
            getListRelationData(listRelationData, getDataByRecordIdsResponse);
        }
        if (getDataByRecordIdsResponse.getFieldItems() != null
                && !getDataByRecordIdsResponse.getFieldItems().isEmpty()) {
            getListFieldItems(listFieldItems, getDataByRecordIdsResponse);
        }
        if (getDataByRecordIdsResponse.getEmployee() != null && !getDataByRecordIdsResponse.getEmployee().isEmpty()) {
            getListEmployee(listEmployee, getDataByRecordIdsResponse);
        }
        if (getDataByRecordIdsResponse.getDepartments() != null
                && !getDataByRecordIdsResponse.getDepartments().isEmpty()) {
            getListDepartment(listDepartments, getDataByRecordIdsResponse);
        }
        if (getDataByRecordIdsResponse.getGroupId() != null && !getDataByRecordIdsResponse.getGroupId().isEmpty()) {
            getListGroup(listGroups, getDataByRecordIdsResponse);
        }
        if (getDataByRecordIdsResponse.getEmployees() != null && !getDataByRecordIdsResponse.getEmployees().isEmpty()) {
            getListEmployees(listEmployees, getDataByRecordIdsResponse);
        }
    }

    /**
     * get List Employees
     *
     * @param listEmployees data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListEmployees(List<GetRelationDataSubType11DTO> listEmployees,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (SelectedOrganizationInfoSubType4DTO employeesList : getDataByRecordIdsResponse.getEmployees()) {
            GetRelationDataSubType11DTO employees = new GetRelationDataSubType11DTO();
            employees.setEmployeeId(employeesList.getEmployeeId() != 0 ? employeesList.getEmployeeId() : null);
            employees.setEmployeeName(employeesList.getEmployeeName());
            listEmployees.add(employees);
        }
    }

    /**
     * get list Groups
     *
     * @param listGroups data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListGroup(List<GetRelationDataSubType10DTO> listGroups,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (SelectedOrganizationInfoSubType3DTO listGroupId : getDataByRecordIdsResponse.getGroupId()) {
            GetRelationDataSubType10DTO groupId = new GetRelationDataSubType10DTO();
            groupId.setGroupId(listGroupId.getGroupId() != 0 ? listGroupId.getGroupId() : null);
            groupId.setGroupName(listGroupId.getGroupName());
            if (listGroupId.getEmployeeIds() != null && !listGroupId.getEmployeeIds().isEmpty()) {
                groupId.setEmployeeIds(listGroupId.getEmployeeIds());
            }
            listGroups.add(groupId);
        }
    }

    /**
     * get list department
     *
     * @param listDepartments data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListDepartment(List<GetRelationDataSubType8DTO> listDepartments,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (SelectedOrganizationInfoSubType2DTO departmentsList : getDataByRecordIdsResponse.getDepartments()) {
            GetRelationDataSubType8DTO departments = new GetRelationDataSubType8DTO();
            departments.setDepartmentId(departments.getDepartmentId() != null && departments.getDepartmentId() != 0 ? departments.getDepartmentId() : null);
            departments.setDepartmentName(departmentsList.getDepartmentName());
            if (departmentsList.getEmployeeIds() != null && !departmentsList.getEmployeeIds().isEmpty()) {
                departments.setEmployeeIds(departmentsList.getEmployeeIds());
            }
            if (departmentsList.getParentDepartment() != null) {
                GetRelationDataSubType9DTO parentDepartment = new GetRelationDataSubType9DTO();
                parentDepartment.setDepartmentId(departmentsList.getParentDepartment().getDepartmentId() != 0
                        ? departmentsList.getParentDepartment().getDepartmentId()
                        : null);
                parentDepartment.setDepartmentName(departmentsList.getParentDepartment().getDepartmentName());
                departments.setParentDepartment(parentDepartment);
            }
            listDepartments.add(departments);
        }
    }

    /**
     * get list employee
     *
     * @param listEmployee data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListEmployee(List<GetRelationDataSubType6DTO> listEmployee,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (SelectedOrganizationInfoSubType1DTO employeeList : getDataByRecordIdsResponse.getEmployee()) {
            GetRelationDataSubType6DTO employee = new GetRelationDataSubType6DTO();
            List<GetRelationDataSubType7DTO> listDepartmentsOfEmployee = new ArrayList<>();
            employee.setEmployeeId(employeeList.getEmployeeId() != 0 ? employeeList.getEmployeeId() : null);
            employee.setEmployeeName(employeeList.getEmployeeName());
            employee.setEmployeeSurname(employeeList.getEmployeeSurname());
            employee.setPhotoFileName(employeeList.getPhotoFileName());
            employee.setPhotoFilePath(employeeList.getPhotoFilePath());
            employee.setPhotoFileUrl(employeeList.getPhotoFileUrl());
            if (employeeList.getDepartments() != null && !employeeList.getDepartments().isEmpty()) {
                for (SelectedOrganizationInfoSubType5DTO departmentsListOfEmployee : employeeList.getDepartments()) {
                    GetRelationDataSubType7DTO departmentsOfEmployee = new GetRelationDataSubType7DTO();
                    departmentsOfEmployee.setDepartmentId(departmentsListOfEmployee.getDepartmentId() != 0
                            ? departmentsListOfEmployee.getDepartmentId()
                            : null);
                    departmentsOfEmployee.setDepartmentName(departmentsListOfEmployee.getDepartmentName());
                    departmentsOfEmployee.setPositionId(departmentsListOfEmployee.getPositionId() != null &&
                                                        departmentsListOfEmployee.getPositionId() != 0 ? departmentsListOfEmployee.getPositionId() : null);
                    departmentsOfEmployee.setPositionName(departmentsListOfEmployee.getPositionName());
                    listDepartmentsOfEmployee.add(departmentsOfEmployee);
                }
            }
            employee.setDepartments(listDepartmentsOfEmployee);
            listEmployee.add(employee);
        }
    }

    /**
     * get List Field Items
     *
     * @param listFieldItems data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListFieldItems(List<GetRelationDataSubType5DTO> listFieldItems,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (GetDataByRecordIdsSubType3DTO fieldItems : getDataByRecordIdsResponse.getFieldItems()) {
            GetRelationDataSubType5DTO fieldItem = new GetRelationDataSubType5DTO();
            fieldItem.setIsAvailable(fieldItems.getIsAvailable());
            fieldItem.setIsDefault(fieldItems.getIsDefault());
            fieldItem.setItemId(fieldItems.getItemId() != 0 ? fieldItems.getItemId() : null);
            fieldItem.setItemLabel(fieldItems.getItemLabel());
            if (fieldItems.getItemOrder() != null) {
                fieldItem.setItemOrder(Long.valueOf(fieldItems.getItemOrder().toString()));
            }
            listFieldItems.add(fieldItem);
        }
    }

    /**
     * get list relation data
     *
     * @param listRelationData data after get
     * @param getDataByRecordIdsResponse data need for get
     */
    private void getListRelationData(List<GetRelationDataSubType1DTO> listRelationData,
            GetDataByRecordIdsOutDTO getDataByRecordIdsResponse) {
        for (GetDataByRecordIdsSubType1DTO relationDataRecursion : getDataByRecordIdsResponse.getRelationData()) {
            GetRelationDataSubType1DTO relationData = new GetRelationDataSubType1DTO();
            List<GetRelationDataSubType2DTO> listDataInfos = new ArrayList<>();
            relationData
                    .setRecordId(relationDataRecursion.getRecordId() != 0 ? relationDataRecursion.getRecordId() : null);
            if (relationDataRecursion.getDataInfos() != null && !relationDataRecursion.getDataInfos().isEmpty()) {
                for (GetDataByRecordIdsSubType2DTO dataInfosRecursion : relationDataRecursion.getDataInfos()) {
                    GetRelationDataSubType2DTO dataInfos = new GetRelationDataSubType2DTO();
                    List<GetRelationDataSubType3DTO> listChildrenRelationData = new ArrayList<>();
                    dataInfos.setFieldId(dataInfosRecursion.getFieldId() != 0 ? dataInfosRecursion.getFieldId() : null);
                    dataInfos.setFieldName(dataInfosRecursion.getFieldName());
                    dataInfos.setFieldType(
                            dataInfosRecursion.getFieldType() != 0 ? dataInfosRecursion.getFieldType() : null);
                    dataInfos.setValue(dataInfosRecursion.getValue());
                    if (dataInfosRecursion.getChildrenRelationDatas() != null
                            && !dataInfosRecursion.getChildrenRelationDatas().isEmpty()) {
                        for (GetDataByRecordIdsSubType1DTO childrenRelationDatas : dataInfosRecursion
                                .getChildrenRelationDatas()) {
                            GetRelationDataSubType3DTO childrenRelation = new GetRelationDataSubType3DTO();
                            List<GetRelationDataSubType4DTO> listDataInfosOfchildrenRelation = new ArrayList<>();
                            childrenRelation.setRecordId(
                                    childrenRelationDatas.getRecordId() != 0 ? childrenRelationDatas.getRecordId()
                                            : null);
                            if (childrenRelationDatas.getDataInfos() != null
                                    && !childrenRelationDatas.getDataInfos().isEmpty()) {
                                for (GetDataByRecordIdsSubType2DTO dataInfoOfChildrenRelationDatas : childrenRelationDatas
                                        .getDataInfos()) {
                                    GetRelationDataSubType4DTO dataInfosOfchildrenRelation = new GetRelationDataSubType4DTO();
                                    dataInfosOfchildrenRelation
                                            .setFieldId(dataInfoOfChildrenRelationDatas.getFieldId() != 0
                                                    ? dataInfoOfChildrenRelationDatas.getFieldId()
                                                    : null);
                                    dataInfosOfchildrenRelation
                                            .setFieldName(dataInfoOfChildrenRelationDatas.getFieldName());
                                    dataInfosOfchildrenRelation
                                            .setFieldType(dataInfoOfChildrenRelationDatas.getFieldType() != 0
                                                    ? dataInfoOfChildrenRelationDatas.getFieldType()
                                                    : null);
                                    dataInfosOfchildrenRelation.setValue(dataInfoOfChildrenRelationDatas.getValue());
                                    listDataInfosOfchildrenRelation.add(dataInfosOfchildrenRelation);
                                }
                                childrenRelation.setDataInfos(listDataInfosOfchildrenRelation);
                            }
                            listChildrenRelationData.add(childrenRelation);
                        }
                        dataInfos.setChildrenRelationDatas(listChildrenRelationData);
                    }
                    listDataInfos.add(dataInfos);
                }
            }
            relationData.setDataInfos(listDataInfos);
            listRelationData.add(relationData);
        }
    }

    /**
     * get data request for api getDataByRecordIds
     *
     * @param listIds data need for get data
     * @param itemData data need for get data
     * @param request data need for get data
     */
    private void getDataRequest(List<Long> listIds, List<CustomFieldsInfoOutDTO> itemData,
            GetDataByRecordIdsRequest request) {
        request.setRecordIds(listIds);
        List<GetDataByRecordIdsInDTO> lstField = new ArrayList<>();
        for (CustomFieldsInfoOutDTO fieldsInfo : itemData) {
            GetDataByRecordIdsInDTO field = new GetDataByRecordIdsInDTO();
            field.setFieldId(fieldsInfo.getFieldId());
            field.setFieldName(fieldsInfo.getFieldName());
            field.setFieldType(fieldsInfo.getFieldType());
            field.setIsDefault(fieldsInfo.getIsDefault());
            if (fieldsInfo.getRelationData() != null) {
                RelationDataDTO relationData = new RelationDataDTO();
                if (fieldsInfo.getRelationData().getFieldId() != null) {
                    relationData.setFieldId(fieldsInfo.getRelationData().getFieldId());
                }
                if (fieldsInfo.getRelationData().getAsSelf() != null) {
                    relationData.setAsSelf(fieldsInfo.getRelationData().getAsSelf());
                }
                if (fieldsInfo.getRelationData().getDisplayFieldId() != null) {
                    relationData.setDisplayFieldId(fieldsInfo.getRelationData().getDisplayFieldId());
                }
                if (fieldsInfo.getRelationData().getDisplayTab() != null) {
                    relationData.setDisplayTab(fieldsInfo.getRelationData().getDisplayTab());
                }
                if (fieldsInfo.getRelationData().getFieldBelong() != null) {
                    relationData.setFieldBelong(fieldsInfo.getRelationData().getFieldBelong());
                }
                if (fieldsInfo.getRelationData().getFormat() != null) {
                    relationData.setFormat(fieldsInfo.getRelationData().getFormat());
                }
                if (fieldsInfo.getRelationData().getDisplayFields() != null
                        && !fieldsInfo.getRelationData().getDisplayFields().isEmpty()) {
                    List<jp.co.softbrain.esales.utils.dto.DisplayFieldDTO> lstDisplayField = new ArrayList<>();
                    for (DisplayFieldDTO displayFields : fieldsInfo.getRelationData().getDisplayFields()) {
                        jp.co.softbrain.esales.utils.dto.DisplayFieldDTO displayField = new jp.co.softbrain.esales.utils.dto.DisplayFieldDTO();
                        if (displayFields.getFieldBelong() != null) {
                            displayField.setFieldBelong(displayFields.getFieldBelong());
                        }
                        if (displayFields.getFieldId() != null) {
                            displayField.setFieldId(displayFields.getFieldId());
                        }
                        if (displayFields.getFieldName() != null) {
                            displayField.setFieldName(displayFields.getFieldName());
                        }
                        if (displayFields.getRelationId() != null) {
                            displayField.setRelationId(displayFields.getRelationId());
                        }
                        lstDisplayField.add(displayField);
                    }
                    relationData.setDisplayFields(lstDisplayField);
                }
                field.setRelationData(relationData);
            }
            lstField.add(field);
        }
        request.setFieldInfo(lstField);
    }

    /**
     * validate parameter
     *
     * @param fieldBelong data need for validate
     * @param listIds data need for validate
     * @param fieldIds data need for validate
     */
    private void validateGetRelationData(Integer fieldBelong, List<Long> listIds, List<Long> fieldIds) {
        if (fieldBelong == null) {
            throw new CustomException("fieldBelong is require ", ConstantsCommon.FIELD_BELONG,
                    Constants.RIQUIRED_CODE);
        }
        if (listIds == null || listIds.isEmpty()) {
            throw new CustomException("listIds is require ", ConstantsCommon.LIST_IDS, Constants.RIQUIRED_CODE);
        }
        if (fieldIds == null || fieldIds.isEmpty()) {
            throw new CustomException("fieldIds is require ", ConstantsCommon.FIELD_IDS,
                    Constants.RIQUIRED_CODE);
        }
    }
}
