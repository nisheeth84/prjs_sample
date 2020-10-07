package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import jp.co.softbrain.esales.commons.domain.ListViewSettings;
import jp.co.softbrain.esales.commons.repository.ListViewSettingsFiltersRepository;
import jp.co.softbrain.esales.commons.repository.ListViewSettingsRepository;
import jp.co.softbrain.esales.commons.service.CommonFieldInfoService;
import jp.co.softbrain.esales.commons.service.ListViewSettingsFiltersService;
import jp.co.softbrain.esales.commons.service.ListViewSettingsService;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsDTO;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateListViewSettingInDTO;
import jp.co.softbrain.esales.commons.service.mapper.ListViewSettingsMapper;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.ExtensionBelong;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.ReflectionUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Class handle the service method, implement from
 * {@link ListViewSettingsService}
 * 
 * @author nguyenvanchien3
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ListViewSettingsServiceImpl implements ListViewSettingsService {
    private final Logger log = LoggerFactory.getLogger(ListViewSettingsServiceImpl.class);

    private static final String READ_ONLY_CONNECTION = "@ReadOnlyConnection";
    private static final String ITEM_VALUE_INVALID = "Item's value is invalid";
    private static final String FIELD_BELONG_PARAM = "fieldBelong";
    private static final String SELECTED_TARGET_TYPE_PARAM = "selectedTargetType";
    private static final String SELECTED_TARGET_ID_PARAM = "selectedTargetId";
    private static final String SUCCESS_MESSAGE = "Executed successful";
    private static final String KEYWORD_SEARCH = ".keyword";

    @Autowired
    private CommonFieldInfoService commonFieldInfoService;

    @Autowired
    private ListViewSettingsMapper listViewSettingsMapper;

    @Autowired
    private ListViewSettingsRepository listViewSettingsRepository;

    @Autowired
    private ListViewSettingsFiltersService listViewSettingsFiltersService;

    @Autowired
    private ListViewSettingsFiltersRepository listViewSettingsFiltersRepository;

    @Autowired
    private ObjectMapper objectMapper;

    Gson gson = new Gson();

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsService#save(jp.
     * co.softbrain.esales.commons.service.dto.ListViewSettingsDTO)
     */
    @Override
    public ListViewSettingsDTO save(ListViewSettingsDTO listViewSettingsDTO) {
        log.debug("Request to save ListViewSettings: '{}'", listViewSettingsDTO);
        ListViewSettings listViewSettings = listViewSettingsMapper.toEntity(listViewSettingsDTO);
        listViewSettings = listViewSettingsRepository.save(listViewSettings);
        return listViewSettingsMapper.toDto(listViewSettings);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsService#findOne(
     * java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<ListViewSettingsDTO> findOne(Long id) {
        log.debug(READ_ONLY_CONNECTION);
        log.debug("Request to get ListViewSettings : {}", id);
        return listViewSettingsRepository.findById(id).map(listViewSettingsMapper::toDto);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsService#findAll(
     * org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<ListViewSettingsDTO> findAll(Pageable pageable) {
        log.debug(READ_ONLY_CONNECTION);
        log.debug("Request to get all ListViewSettings");
        return listViewSettingsRepository.findAll(pageable).map(listViewSettingsMapper::toDto);
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ListViewSettingsService#delete(
     * java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ListViewSettings : {}", id);
        listViewSettingsRepository.deleteById(id);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.ListViewSettingsService#
     * updateListViewSetting(jp.co.softbrain.esales.commons.service.dto.
     * UpdateListViewSettingInDTO)
     */
    @Override
    public String updateListViewSetting(UpdateListViewSettingInDTO input) {
        log.debug("Start API updateListViewSetting to update update information on display list");
        // 1. Validate parameters
        // Validate require
        if (input.getFieldBelong() == null) {
            throw new CustomException(ITEM_VALUE_INVALID, FIELD_BELONG_PARAM, Constants.RIQUIRED_CODE);
        }
        if (input.getSelectedTargetType() == null) {
            throw new CustomException(ITEM_VALUE_INVALID, SELECTED_TARGET_TYPE_PARAM, Constants.RIQUIRED_CODE);
        }
        if (input.getSelectedTargetId() == null) {
            throw new CustomException(ITEM_VALUE_INVALID, SELECTED_TARGET_ID_PARAM, Constants.RIQUIRED_CODE);
        }
        Long employeeId = input.getEmployeeId();
        Integer fieldBelong = input.getFieldBelong();
        Integer selectedTargetType = input.getSelectedTargetType();
        Long selectedTargetId = input.getSelectedTargetId();
        // 2. Check existed list's saved informations
        ListViewSettings existEntity = listViewSettingsRepository.findOneByFieldBelongAndEmployeeId(fieldBelong,
                employeeId);
        if (existEntity == null) {
            existEntity = new ListViewSettings();
            existEntity.setEmployeeId(employeeId);
            existEntity.setFieldBelong(fieldBelong);
        }
        existEntity.setSelectedTargetType(selectedTargetType);
        existEntity.setSelectedTargetId(selectedTargetId);
        // remove KEYWORD_SEARCH orderby
        List<OrderValue> listOrder = input.getOrderBy();
        if (listOrder != null) {
            listOrder.forEach(obj -> {
                String fieldNameOrder = obj.getKey();
                if (!StringUtil.isNull(fieldNameOrder) && fieldNameOrder.endsWith(KEYWORD_SEARCH)) {
                    obj.setKey(fieldNameOrder.substring(0, fieldNameOrder.lastIndexOf(KEYWORD_SEARCH)));
                }
            });
        }

        try {
            if (input.getExtraSettings() != null) {
                existEntity.setExtraSettings(objectMapper.writeValueAsString(input.getExtraSettings()));
            }
            existEntity.setOrderBy(objectMapper.writeValueAsString(listOrder));
        } catch (JsonProcessingException e) {
            throw new CustomException(e.getLocalizedMessage());
        } 

        existEntity.setCreatedUser(employeeId);
        existEntity.setUpdatedUser(employeeId);
        Long savedId = this.save(listViewSettingsMapper.toDto(existEntity)).getListViewSettingId();

        // 5. Update filter informations
        if (selectedTargetType == 0) {
            return SUCCESS_MESSAGE;
        }
        // Delete old filter informations
        log.debug("Request to delete old filter information");
        listViewSettingsFiltersRepository.deleteByListViewSettingIdAndTargetTypeAndTargetId(savedId, selectedTargetType,
                selectedTargetId);

        // Insert new filter information
        if (input.getFilterConditions() == null || input.getFilterConditions().isEmpty()) {
            return SUCCESS_MESSAGE;
        }
        input.getFilterConditions().stream().forEach(filterCondition -> {
            ListViewSettingsFiltersDTO inDto = new ListViewSettingsFiltersDTO();

            inDto.setListViewSettingId(savedId);
            inDto.setTargetType(selectedTargetType);
            inDto.setTargetId(selectedTargetId);
            String fieldName = filterCondition.getFieldName();
            if (fieldName.endsWith(KEYWORD_SEARCH)) {
                filterCondition.setFieldName(fieldName.substring(0, fieldName.lastIndexOf(KEYWORD_SEARCH)));
            }

            try {
                inDto.setFilterValue(objectMapper.writeValueAsString(filterCondition));
            } catch (JsonProcessingException e) {
                throw new CustomException(e.getLocalizedMessage());
            }
            inDto.setCreatedUser(employeeId);
            inDto.setUpdatedUser(employeeId);
            listViewSettingsFiltersService.save(inDto);
        });
        return SUCCESS_MESSAGE;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.ListViewSettingsService#
     * getInitializeListInfo(java.lang.Integer, java.lang.Long,
     * java.lang.String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetInitializeListInfoOutDTO getInitializeListInfo(Integer fieldBelong, Long employeeId,
            String languageCode) {
        // 1.validate parameter
        if (fieldBelong == null) {
            throw new CustomException("Param[fieldBelong] is null", FIELD_BELONG_PARAM, Constants.RIQUIRED_CODE);
        }

        // 2. Information of list screen
        ListViewSettings informationListScreen = listViewSettingsRepository
                .findOneByFieldBelongAndEmployeeId(fieldBelong, employeeId);

        // 3. Get information filter list
        List<ListViewSettingsFiltersDTO> informationFilterList = new ArrayList<>();
        if (informationListScreen != null) {
            informationFilterList = listViewSettingsFiltersRepository
                    .getInformationFilterList(informationListScreen.getListViewSettingId());
        }
        // 4. Get user item information
        FieldInfoPersonalsInputDTO searchConditionDTO = new FieldInfoPersonalsInputDTO();
        searchConditionDTO.setEmployeeId(employeeId);
        searchConditionDTO.setFieldBelong(fieldBelong);
        searchConditionDTO.setExtensionBelong(ExtensionBelong.SHOW_IN_LIST.getValue());
        List<FieldInfoPersonalsOutDTO> fieldInfoPersonals = commonFieldInfoService
                .getFieldInfoPersonals(searchConditionDTO);

        // 5. Create response
        TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<Map<String, Object>>() {};
        List<GetInitializeListInfoSubType2DTO> infoSubType2DTOs = new ArrayList<>();
        List<Integer> ob = new ArrayList<>();
        for (ListViewSettingsFiltersDTO informationFilter : informationFilterList) {
            GetInitializeListInfoSubType2DTO infoSubType2DTO = new GetInitializeListInfoSubType2DTO();
            infoSubType2DTO.setTargetType(informationFilter.getTargetType());
            infoSubType2DTO.setTargetId(informationFilter.getTargetId());

            List<SearchItem> infoSubType3DTOs = new ArrayList<>();
            for (int i = 0; i < informationFilterList.size(); i++) {
                if (!(informationFilterList.get(i).getTargetType().equals(informationFilter.getTargetType())
                        && informationFilterList.get(i).getTargetId().equals(informationFilter.getTargetId()))
                        || ob.contains(i)) {
                    continue;
                }
                SearchItem searchItem = new SearchItem();
                infoSubType3DTOs.add((SearchItem) ReflectionUtils.jsonToObject(objectMapper, searchItem,
                        informationFilterList.get(i).getFilterValue(), mapTypeRef));
                ob.add(i);
            }
            infoSubType2DTO.setFilterConditions(infoSubType3DTOs);
            infoSubType2DTOs.add(infoSubType2DTO);
        }

        TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<List<Map<String, Object>>>() {};
        GetInitializeListInfoSubType1DTO infoSubType1DTO = null;
        if (informationListScreen != null) {
            infoSubType1DTO = new GetInitializeListInfoSubType1DTO();
            infoSubType1DTO.setSelectedTargetType(informationListScreen.getSelectedTargetType());
            infoSubType1DTO.setSelectedTargetId(informationListScreen.getSelectedTargetId());
            infoSubType1DTO.setExtraSettings(convertJsonbToKeyValueList(informationListScreen.getExtraSettings()));

            List<Map<String, Object>> listOrderValue = null;
            try {
                listOrderValue = objectMapper.readValue(informationListScreen.getOrderBy(), listTypeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }

            if (listOrderValue != null) {
                List<OrderValue> listOrderBy = new ArrayList<>();
                listOrderValue.forEach(orderBy -> {
                    OrderValue orderValue = new OrderValue();
                    listOrderBy.add(
                            (OrderValue) ReflectionUtils.jsonToObject(objectMapper, orderValue, orderBy, mapTypeRef));
                });
                infoSubType1DTO.setOrderBy(listOrderBy);
            }

            infoSubType1DTO.setFilterListConditions(infoSubType2DTOs);
            infoSubType1DTO.setUpdatedDate(informationListScreen.getUpdatedDate());
        }

        GetInitializeListInfoOutDTO initializeListInfoDTO = new GetInitializeListInfoOutDTO();
        initializeListInfoDTO.setInitializeInfo(infoSubType1DTO);
        initializeListInfoDTO.setFields(fieldInfoPersonals);
        return initializeListInfoDTO;
    }

    /**
     * Convert jsonb to key value list
     * 
     * @param jsonbString json convert
     * @return key value list
     */
    private List<KeyValue> convertJsonbToKeyValueList(String jsonbString) {
        List<KeyValue> listKeyValue = new ArrayList<>();
        if (jsonbString == null) {
            return listKeyValue;
        }

        TypeReference<Map<String, Object>> typeRef = new TypeReference<>() {};
        Map<String, Object> jsonMap = new HashMap<>();
        try {
            jsonMap = objectMapper.readValue(jsonbString, typeRef);
            jsonMap.forEach((key, value) -> {
                KeyValue keyValue = new KeyValue();
                keyValue.setKey(key);
                keyValue.setValue(value.toString());
                listKeyValue.add(keyValue);
            });
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
        }

        return listKeyValue;
    }
}
