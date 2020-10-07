package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import io.grpc.internal.JsonParser;
import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.repository.FieldInfoRepository;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.validator.ItemValidationInfo;
import jp.co.softbrain.esales.commons.validator.errors.ValidateBaseException;
import jp.co.softbrain.esales.commons.validator.utils.ItemCheckUtil;
import jp.co.softbrain.esales.commons.validator.utils.ItemPropertyUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.ModifyFlag;
import jp.co.softbrain.esales.utils.CheckUtil;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;


/**
 * Service Implementation for managing {@link EmpDetail}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ValidateServiceImpl implements ValidateService {

    private final Logger log = LoggerFactory.getLogger(ValidateServiceImpl.class);

    private static final String FIELD_BELONG = "fieldBelong";
    private static final String FORMAT_DATE = "formatDate";
    private static final String CUSTOM_PARAMS = "customParams";
    private static final String REQUEST_DATA = "requestData";

    /** ItemCheckUtilのインスタンス */
    @Autowired
    private ItemCheckUtil itemCheckUtil;

    /** ItemPropertyUtilのインスタンス */
    @Autowired
    protected ItemPropertyUtil itemPropUtil;

    /** FieldInfoRepositoryのインスタンス */
    @Autowired
    private FieldInfoRepository fieldInfoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Gson object
     */
    private Gson gson = new Gson();

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.ValidateService#validate(java.lang
     * .String)
     */
    @SuppressWarnings("unchecked")
    @Override
    public List<Map<String, Object>> validate(String json) {
        List<Map<String, Object>> errors = new ArrayList<>();
        Map<String, Object> item;
        try {
            Object inputDataObj = JsonParser.parse(json);

            List<Object> inputList = new ArrayList<>();
            if (!(inputDataObj instanceof List)) {
                TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
                inputDataObj = objectMapper.readValue(json, typeRef);
                inputList.add(inputDataObj);
            } else {
                TypeReference<List<Map<String, Object>>> typeRef = new TypeReference<List<Map<String, Object>>>() {};
                inputDataObj = objectMapper.readValue(json, typeRef);
                inputList.addAll((List<Object>) inputDataObj);
            }

            inputList.forEach(itemObject -> {
                if (itemObject instanceof Map) {
                    processInput((Map<String, Object>) itemObject, errors);
                }
            });

        } catch (IOException e) {
            item = new HashMap<>();
            item.put(Constants.ERROR_ITEM, REQUEST_DATA);
            item.put(Constants.ERROR_CODE, Constants.INVALID_PARAMETER);
            errors.add(item);
        }
        return errors;
    }

    /**
     * validate all item
     *
     * @param inputMap : data need for process
     * @param errors : List errors
     */
    @SuppressWarnings("unchecked")
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public void processInput(Map<String, Object> inputMap, List<Map<String, Object>> errors) {
        Iterator<Entry<String, Object>> iterator = inputMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Object> entry = iterator.next();
            if (CUSTOM_PARAMS.equals(entry.getKey())
                    && (entry.getValue() instanceof Map || entry.getValue() instanceof List)) {
                validateCustomParams(inputMap, errors, entry);
            } else if (entry.getValue() instanceof Map) {
                processInput((Map<String, Object>) entry.getValue(), errors);
            } else if (entry.getValue() instanceof List) {
                validateFixedParamsList(inputMap, errors, entry);
            } else if (!StringUtils.isEmpty(entry.getValue())) {
                validateFixedParams(inputMap, errors, entry);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void validateCustomParams(Map<String, Object> inputMap, List<Map<String, Object>> errors,
            Map.Entry<String, Object> entry) {
        // check fieldBelongVal
        int fieldBelongVal = 0;
        if (inputMap.get(FIELD_BELONG) instanceof Double) {
            fieldBelongVal = Double.valueOf(inputMap.get(FIELD_BELONG).toString()).intValue();
        } else {
            fieldBelongVal = Integer.parseInt(inputMap.get(FIELD_BELONG).toString());
        }
        if (StringUtils.isEmpty(inputMap.get(FIELD_BELONG))
                || !FieldBelong.getFieldBelongList().contains(fieldBelongVal)) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ERROR_ITEM, FIELD_BELONG);
            item.put(Constants.ERROR_CODE, Constants.INVALID_PARAMETER);
            errors.add(item);
        } else {
            String formatDate = StringUtil.EMPTY;
            if (!StringUtils.isEmpty(inputMap.get(FORMAT_DATE))) {
                formatDate = inputMap.get(FORMAT_DATE).toString();
            }
            // get custom field by fieldBelongVal
            List<FieldInfo> fieldInfoList;
            fieldInfoList = fieldInfoRepository.findByFieldBelong(fieldBelongVal);
            Map<String, FieldInfo> fieldInfoMap = new HashMap<>();
            String fieldName;
            for (FieldInfo fieldInfo : fieldInfoList) {
                fieldInfoMap.put(fieldInfo.getFieldName(), fieldInfo);
                fieldName = CommonUtils.snakeToCamel(fieldInfo.getFieldName(), false);
                fieldInfoMap.put(fieldName, fieldInfo);
            }
            if (entry.getValue() instanceof Map) {
                processCustomParams((Map<String, Object>) entry.getValue(), errors, fieldInfoMap, formatDate);
            } else if (entry.getValue() instanceof List) {
                final String formatDateFinal = formatDate;
                ((List<Object>) entry.getValue()).forEach(itemObject -> {
                    if (itemObject instanceof Map) {
                        processCustomParams((Map<String, Object>) itemObject, errors, fieldInfoMap, formatDateFinal);
                    }
                });
            }
        }
    }

    private void validateFixedParams(Map<String, Object> inputMap, List<Map<String, Object>> errors,
            Map.Entry<String, Object> entry) {
        String formatDate = StringUtil.EMPTY;
        if (!StringUtils.isEmpty(inputMap.get(FORMAT_DATE))) {
            formatDate = inputMap.get(FORMAT_DATE).toString();
        }
        // check validate
        ItemValidationInfo itemInfo;
        itemInfo = itemPropUtil.getItemInfo(entry.getKey());
        if (itemInfo != null) {
            long rowId = 0;
            rowId = getRowId(inputMap);
            try {
                itemCheckUtil.checkItem(itemInfo, entry.getValue().toString(), entry.getKey(), formatDate);
            } catch (ValidateBaseException e) {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, e.getErrorId());
                item.put(Constants.ERROR_CODE, e.getCode());
                item.put(Constants.ERROR_PARAMS, e.getParam());
                errors.add(item);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void validateFixedParamsList(Map<String, Object> inputMap, List<Map<String, Object>> errors,
            Map.Entry<String, Object> entry) {
        String formatDate = StringUtil.EMPTY;
        if (!StringUtils.isEmpty(inputMap.get(FORMAT_DATE))) {
            formatDate = inputMap.get(FORMAT_DATE).toString();
        }
        final String formatDateFinal = formatDate;
        ((List<Object>) entry.getValue()).forEach(itemChild -> {
            if (itemChild instanceof Map) {
                processInput((Map<String, Object>) itemChild, errors);
            } else if (!StringUtils.isEmpty(itemChild)) {
                // check validate
                ItemValidationInfo itemInfo;
                itemInfo = itemPropUtil.getItemInfo(entry.getKey());
                if (itemInfo == null) {
                    return;
                }

                long rowId = 0;
                rowId = getRowId(inputMap);
                try {
                    itemCheckUtil.checkItem(itemInfo, itemChild.toString(), entry.getKey(), formatDateFinal);
                } catch (ValidateBaseException e) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ROW_ID, rowId);
                    item.put(Constants.ERROR_ITEM, e.getErrorId());
                    item.put(Constants.ERROR_CODE, e.getCode());
                    item.put(Constants.ERROR_PARAMS, e.getParam());
                    errors.add(item);
                } catch (Exception e) {
                    log.error(e.getMessage());
                }

            }
        });
    }

    /**
     * validate custom parameters
     *
     * @param customParamMap : data customParam need for process
     * @param errors : list errors
     * @param fieldInfoMap : data need for process
     */
    @SuppressWarnings("unchecked")
    private void processCustomParams(Map<String, Object> customParamMap, List<Map<String, Object>> errors,
            Map<String, FieldInfo> fieldInfoMap, String formatDate) {

        String itemValue = null;
        Iterator<Entry<String, Object>> iterator = customParamMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Object> entry = iterator.next();

            // check validate
            FieldInfo fieldInfo;
            fieldInfo = fieldInfoMap.get(entry.getKey());

            if (entry.getValue() instanceof Map && fieldInfo != null && fieldInfo.getFieldType() != null
                    && !FieldTypeEnum.FILE.getCode().equals(fieldInfo.getFieldType().toString())) {
                processCustomParams((Map<String, Object>) entry.getValue(), errors, fieldInfoMap, formatDate);
            } else {
                if (fieldInfo == null) {
                    continue;
                }
                String fieldType = StringUtils.isEmpty(fieldInfo.getFieldType()) ? StringUtil.EMPTY
                        : fieldInfo.getFieldType().toString();
                itemValue = getItemValue(entry, fieldType);
                long rowId = 0;
                rowId = getRowId(customParamMap);
                if (isRequired(fieldInfo, itemValue)) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ROW_ID, rowId);
                    item.put(Constants.ERROR_ITEM, entry.getKey());
                    item.put(Constants.ERROR_CODE, Constants.RIQUIRED_CODE);
                    errors.add(item);
                } else if (itemValue != null && !"".equals(itemValue)) {
                    // Check max length data of item
                    if (fieldInfo.getMaxLength() != null && 0 < fieldInfo.getMaxLength()
                            && itemValue.length() > fieldInfo.getMaxLength()) {
                        Map<String, Object> item = new HashMap<>();
                        item.put(Constants.ROW_ID, rowId);
                        item.put(Constants.ERROR_ITEM, entry.getKey());
                        item.put(Constants.ERROR_CODE, Constants.MAX_LENGTH);
                        List<Integer> listErr = new ArrayList<>();
                        listErr.add(fieldInfo.getMaxLength());
                        item.put(Constants.ERROR_PARAMS, listErr);
                        errors.add(item);
                        continue;
                    }
                    validateByFieldType(errors, formatDate, itemValue, entry, fieldInfo, fieldType, rowId);
                }
            }
        }
    }

    /**
     * Check field required
     *
     * @param modifyFlag data need for check
     * @param itemValue data need for check
     * @return true if field is required
     */
    private boolean isRequired(FieldInfo fieldInfo, String itemValue) {
        if (FieldTypeEnum.LINK.getCode().equals(fieldInfo.getFieldType().toString())) {
            return false;
        }
        return ((ModifyFlag.REQUIRED.getValue().equals(fieldInfo.getModifyFlag())
                || ModifyFlag.DEFAULT_REQUIRED.getValue().equals(fieldInfo.getModifyFlag())) && StringUtils.isEmpty(itemValue));
    }

    private long getRowId(Map<String, Object> customParamMap) {
        if (customParamMap.containsKey(Constants.ROW_ID)) {
            return Double.valueOf(customParamMap.get(Constants.ROW_ID).toString()).longValue();
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    private String getItemValue(Map.Entry<String, Object> entry, String fieldType) {
        String itemValue = StringUtil.EMPTY;
        if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(fieldType)
                || FieldTypeEnum.CHECKBOX.getCode().equals(fieldType)
                || FieldTypeEnum.RELATION.getCode().equals(fieldType)) {
            if (entry.getValue() != null) {
                List<Object> data = ((List<Object>) gson.fromJson(entry.getValue().toString(), List.class));
                if (data != null && !data.isEmpty()) {
                    StringBuilder sb = new StringBuilder();
                    data.forEach(sb::append);
                    itemValue = sb.toString();
                }
            }
        } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(fieldType)) {
            itemValue = getDataSelectOrganization(entry, itemValue);
        } else if (FieldTypeEnum.FILE.getCode().equals(fieldType)) {
            itemValue = getDataFile(entry, itemValue);
        } else if (FieldTypeEnum.OTHER.getCode().equals(fieldType)) {
            itemValue = getDataOther(entry, itemValue);
        } else {
            itemValue = StringUtils.isEmpty(entry.getValue()) ? StringUtil.EMPTY : entry.getValue().toString();
        }
        return itemValue;
    }

    /**
     * @param entry
     * @param itemValue
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getDataOther(Map.Entry<String, Object> entry, String itemValue) {
        try {
            List<Map<String, Double>> data = gson.fromJson(entry.getValue().toString(), List.class);
            if (data != null && !data.isEmpty()) {
                itemValue = "1";
            }
        } catch (Exception e) {
            try {
                itemValue = entry.getValue() == null ? StringUtil.EMPTY
                        : String.join(StringUtil.EMPTY,
                                (List<String>) gson.fromJson(entry.getValue().toString(), List.class));
            } catch (Exception e2) {
                itemValue = StringUtils.isEmpty(entry.getValue()) ? StringUtil.EMPTY : entry.getValue().toString();
            }
        }
        return itemValue;
    }

    /**
     * Get the data of the item File
     *
     * @param entry data need for get
     * @param itemValue data after get
     * @return itemValue
     */
    @SuppressWarnings("unchecked")
    private String getDataFile(Map.Entry<String, Object> entry, String itemValue) {
        if (entry.getValue() == null) {
            return null;
        }
        if (entry.getValue() instanceof Map) {
            Map<String, Object> fileDefault = (Map<String, Object>) entry.getValue();
            if (fileDefault != null) {
                itemValue = fileDefault.get("fileName") == null ? StringUtil.EMPTY
                        : fileDefault.get("fileName").toString();
            }
        } else {
            List<Map<String, Object>> updatedFilesData = null;
            List<FileInfosDTO> listFiles = new ArrayList<>();
            try {
                TypeReference<List<Map<String, Object>>> typeRefList = new TypeReference<List<Map<String, Object>>>() {};
                updatedFilesData = objectMapper.readValue((String) entry.getValue(), typeRefList);
            } catch (IOException e) {
                return "";
            }
            updatedFilesData.forEach(fileData -> {
                Object fileStatusObj = fileData.get("status");
                Integer fileStatus = -1;
                if (fileStatusObj != null) {
                    fileStatus = ((Number) fileStatusObj).intValue();
                }
                String filePath = (String) fileData.get("file_path");
                String fileName = (String) fileData.get("file_name");
                if(Constants.DELETED_FILE_STATUS != fileStatus) {
                    FileInfosDTO dto = new FileInfosDTO();
                    dto.setFileName(fileName);
                    dto.setFilePath(filePath);
                    listFiles.add(dto);
                }
            });
            if(!listFiles.isEmpty()) {
                itemValue = gson.toJson(listFiles);
            }
        }
        return itemValue;
    }

    /**
     * Get the data of the item SelectOrganization
     *
     * @param entry data need for get
     * @param itemValue data after get
     * @return itemValue
     */
    private String getDataSelectOrganization(Map.Entry<String, Object> entry, String itemValue) {
        @SuppressWarnings("unchecked")
        List<Map<String, Double>> data = gson.fromJson(entry.getValue().toString(), List.class);
        if (data == null || data.isEmpty()) {
            itemValue = StringUtil.EMPTY;
        } else {
            for (Map<String, Double> map : data) {
                for (Double value : map.values()) {
                    if (value != null && value > 0) {
                        itemValue = value.toString();
                        return itemValue;
                    } else {
                        itemValue = StringUtil.EMPTY;
                    }
                }
            }
        }
        return itemValue;
    }

    private void validateByFieldType(List<Map<String, Object>> errors, String formatDate, String itemValue,
            Map.Entry<String, Object> entry, FieldInfo fieldInfo, String fieldType, long rowId) {
        // validate number
        if (FieldTypeEnum.NUMBER.getCode().equals(fieldType)) {
            checkNumber(errors, itemValue, entry, fieldInfo, rowId);
        } else if (FieldTypeEnum.DATE.getCode().equals(fieldType)) {
            // validate Date
            checkDate(errors, formatDate, itemValue, entry, rowId);
            // validate Date time
        } else if (FieldTypeEnum.DATETIME.getCode().equals(fieldType)) {
            checkDateTime(errors, formatDate, itemValue, entry, rowId);
            // validate time
        } else if (FieldTypeEnum.TIME.getCode().equals(fieldType)) {
            checkTime(errors, itemValue, entry, rowId);
            // validate phone
        } else if (FieldTypeEnum.PHONE.getCode().equals(fieldType)) {
            checkPhone(errors, itemValue, entry, rowId);
            // validate email
        } else if (FieldTypeEnum.EMAIL.getCode().equals(fieldType) && !CheckUtil.isMailAddress(itemValue)) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(Constants.ERROR_ITEM, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.EMAIL_INVALID_CODE);
            errors.add(item);
            // validate Link
        } else if (FieldTypeEnum.LINK.getCode().equals(fieldType)) {
            validateLink(errors, itemValue, entry, rowId, fieldInfo);
        } else if (FieldTypeEnum.FILE.getCode().equals(fieldType)) {
            checkFile(errors, entry, rowId);
        }
    }

    /**
     * validate regex link
     *
     * @param errors
     * @param itemValue
     * @param entry
     * @param rowId
     * @param fieldInfo
     */
    private void validateLink(List<Map<String, Object>> errors, String itemValue, Map.Entry<String, Object> entry,
            long rowId, FieldInfo fieldInfo) {
        if (ConstantsCommon.URL_NO_FIXED.equals(fieldInfo.getUrlType())) {
            String urlTarget = "";
            String urlText = "";
            try {
                TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
                Map<String, String> inputDataObj = objectMapper.readValue(itemValue, typeRef);
                urlTarget = inputDataObj.get(ConstantsCommon.URL_TARGER);
                urlText = inputDataObj.get(ConstantsCommon.URL_TEXT);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
            List<Map<String, Object>> itemErros = new ArrayList<>();
            if (ModifyFlag.REQUIRED.getValue().equals(fieldInfo.getModifyFlag())
                    || ModifyFlag.DEFAULT_REQUIRED.getValue().equals(fieldInfo.getModifyFlag())) {
                if (StringUtils.isEmpty(urlTarget)) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ERROR_CODE, Constants.RIQUIRED_CODE);
                    item.put(ConstantsCommon.CHILDREN_ITEM, ConstantsCommon.URL_TARGER);
                    itemErros.add(item);
                } else {
                    validateRegexLink(itemErros, urlTarget);
                }
                if (StringUtils.isEmpty(urlText)) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ERROR_CODE, Constants.RIQUIRED_CODE);
                    item.put(ConstantsCommon.CHILDREN_ITEM, ConstantsCommon.URL_TEXT);
                    itemErros.add(item);
                }
            }else {
                validateRegexLink(itemErros, urlTarget);
            }
            if (!itemErros.isEmpty()) {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, entry.getKey());
                item.put(ConstantsCommon.ARRAY_ERROR, itemErros);
                errors.add(item);
            }
        }
    }

    /**
     * @param errors
     * @param entry
     * @param rowId
     * @param urlTarget
     */
    private void validateRegexLink(List<Map<String, Object>> errors, String urlTarget) {
        if (!urlTarget.toLowerCase().matches(ConstantsCommon.REGEX_LINK)
                && !urlTarget.toLowerCase().matches(ConstantsCommon.REGEX_LINK_LOCAL)
                && !StringUtils.isEmpty(urlTarget)) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ERROR_CODE, Constants.LINK_INVALID_CODE);
            item.put(ConstantsCommon.CHILDREN_ITEM, ConstantsCommon.URL_TARGER);
            errors.add(item);
        }
    }

    private void checkFile(List<Map<String, Object>> errors, Map.Entry<String, Object> entry,
            long rowId) {
        List<Map<String, Object>> uploadFiles = new ArrayList<>();
        try {
            TypeReference<List<Map<String, Object>>> typeRefList = new TypeReference<List<Map<String, Object>>>() {};
            uploadFiles = objectMapper.readValue((String) entry.getValue(), typeRefList);
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        Long totalUploadFileSize = 0L;
        for (int i = 0; i < uploadFiles.size(); i++) {
            Object fileSize = uploadFiles.get(i).get("size");
            if(fileSize!= null) {
                totalUploadFileSize += Long.valueOf(fileSize.toString());
            }
        }
        if (totalUploadFileSize > Constants.FILE_SIZE_MAX) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(Constants.ERROR_ITEM, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.FILE_OVER_SIZE);
            List<Long> maxSize = new ArrayList<>();
            maxSize.add(Constants.FILE_SIZE_MAX / ConstantsCommon.BYTE_TO_MB_RATIO);
            item.put(Constants.ERROR_PARAMS, maxSize);
            errors.add(item);
        }
    }

    private void checkPhone(List<Map<String, Object>> errors, String itemValue, Map.Entry<String, Object> entry,
            long rowId) {
        if (!checkFormatPhone(itemValue) || itemValue.equals("+")) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(Constants.ERROR_ITEM, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.PHONE_INVALID_CODE);
            errors.add(item);
        }
    }

    private void checkTime(List<Map<String, Object>> errors, String itemValue, Map.Entry<String, Object> entry,
            long rowId) {
        boolean isValid;
        isValid = itemValue.matches(ConstantsCommon.REGEX_TIME_HHMM);
        if (isValid) {
            String hhmm = itemValue.replace(ConstantsCommon.COLON, StringUtil.EMPTY);
            if (!StringUtil.isEmpty(hhmm) && hhmm.substring(0, 2).compareTo(ConstantsCommon.HOUR_MAX) >= 0) {
                isValid = false;
            }
        }
        if (!isValid) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(Constants.ERROR_ITEM, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.TIME_INVALID_CODE);
            errors.add(item);
        }
    }

    private void checkDateTime(List<Map<String, Object>> errors, String formatDate, String itemValue,
            Map.Entry<String, Object> entry, long rowId) {
        if (StringUtils.isEmpty(formatDate)) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(FORMAT_DATE, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.RIQUIRED_CODE);
            errors.add(item);
        } else {
            if (!checkFormatDateTime(itemValue, formatDate)) {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, entry.getKey());
                item.put(Constants.ERROR_CODE, Constants.DATETIME_INVALID_CODE);
                errors.add(item);
            } else {
                SimpleDateFormat formatter;
                formatter = new SimpleDateFormat(formatDate);
                validateRangeDate(errors, itemValue, entry, rowId, formatter);
            }
        }
    }

    /**
     * validate Range date
     * Min date: 1753/01/01
     * Max date: 9999/31/12
     *
     * @param itemValue data need validate
     * @param formatter format date user
     */
    private void validateRangeDate(List<Map<String, Object>> errors, String itemValue, Map.Entry<String, Object> entry,
            long rowId, SimpleDateFormat formatter) {
        try {
            Calendar calender = new GregorianCalendar();
            calender.setTime(formatter.parse(itemValue));
            int year = calender.get(Calendar.YEAR);
            if (year < ConstantsCommon.MIN_YEAR || year > ConstantsCommon.MAX_YEAR) {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, entry.getKey());
                item.put(Constants.ERROR_CODE, Constants.RANGE_DATE_CODE);
                errors.add(item);
            }
        } catch (ParseException e) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(Constants.ERROR_ITEM, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.DATE_INVALID_CODE);
            errors.add(item);
        }
    }

    private void checkDate(List<Map<String, Object>> errors, String formatDate, String itemValue,
            Map.Entry<String, Object> entry, long rowId) {
        if (StringUtils.isEmpty(formatDate)) {
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, rowId);
            item.put(FORMAT_DATE, entry.getKey());
            item.put(Constants.ERROR_CODE, Constants.RIQUIRED_CODE);
            errors.add(item);
        } else {
            SimpleDateFormat formatter;
            formatter = new SimpleDateFormat(formatDate);
            if (!CheckUtil.isDateFormat(itemValue, formatter)) {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, entry.getKey());
                item.put(Constants.ERROR_CODE, Constants.DATE_INVALID_CODE);
                errors.add(item);
            } else {
                validateRangeDate(errors, itemValue, entry, rowId, formatter);
            }
        }
    }

    private void checkNumber(List<Map<String, Object>> errors, String itemValue, Map.Entry<String, Object> entry,
            FieldInfo fieldInfo, long rowId) {
        if (!CheckUtil.isNumeric(itemValue)) {
            if(!itemValue.contains(ConstantsCommon.MINUS)) {
                if (itemValue.matches(ConstantsCommon.REGEX_NUMBER)) {
                    int index;
                    index = itemValue.length() - 1;
                    StringBuilder number = new StringBuilder();
                    while (!ConstantsCommon.DOT.equals(itemValue.charAt(index) + StringUtil.EMPTY)) {
                        number.append(itemValue.charAt(index));
                        index--;
                    }
                    if (number.toString().length() > fieldInfo.getDecimalPlace()) {
                        Map<String, Object> item = new HashMap<>();
                        item.put(Constants.ROW_ID, rowId);
                        item.put(Constants.ERROR_ITEM, entry.getKey());
                        item.put(Constants.ERROR_CODE, Constants.DECIMAL_CODE);
                        errors.add(item);
                    }
                } else {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ROW_ID, rowId);
                    item.put(Constants.ERROR_ITEM, entry.getKey());
                    item.put(Constants.ERROR_CODE, Constants.NUMBER_INVALID_CODE);
                    errors.add(item);
                }
            } else {
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ROW_ID, rowId);
                item.put(Constants.ERROR_ITEM, entry.getKey());
                item.put(Constants.ERROR_CODE, Constants.NUMBER_NOT_NEGATIVE);
                errors.add(item);
            }
        }
    }

    /**
     * check Format Date Time
     *
     * @param itemValue
     * @param formatDate
     * @return true : if the format is correct ,
     *         false : if the format is wrong
     */
    private boolean checkFormatDateTime(String itemValue, String formatDate) {
        try {
            String date = itemValue.substring(0, formatDate.length());
            SimpleDateFormat formatter;
            formatter = new SimpleDateFormat(formatDate);
            if (CheckUtil.isDateFormat(date, formatter)) {
                String time = itemValue.substring(formatDate.length()).trim();
                boolean result;
                result = time.matches(ConstantsCommon.REGEX_TIME_HHMM);
                if (result) {
                    String hhmm = time.replace(ConstantsCommon.COLON, StringUtil.EMPTY);
                    if (!StringUtil.isEmpty(hhmm) && hhmm.substring(0, 2).compareTo(ConstantsCommon.HOUR_MAX) >= 0) {
                        result = false;
                    }
                }
                return result;
            } else {
                return false;
            }
        } catch (IndexOutOfBoundsException e) {
            return false;
        }

    }

    /**
     * check format phone
     *
     * @param itemValue string need to check
     * @return true : if the format is correct ,
     *         false : if the format is wrong
     */
    private boolean checkFormatPhone(String itemValue) {
        if (itemValue.length() > ConstantsCommon.MAX_LENGHT_PHONE) {
            return false;
        }
        if (!itemValue.matches(ConstantsCommon.REGEX_PHONE)) {
            return false;
        } else {
            int openParenthesis = 0;
            int closeParenthesis = 0;
            for (int i = 0; i < itemValue.length(); i++) {
                if ((itemValue.charAt(i) + StringUtil.EMPTY).equals(ConstantsCommon.OPEN_PARENTHESIS)) {
                    openParenthesis++;
                }
                if ((itemValue.charAt(i) + StringUtil.EMPTY).equals(ConstantsCommon.CLOSE_PARENTHESIS)) {
                    closeParenthesis++;
                }
                if (openParenthesis > 1 || closeParenthesis > 1) {
                    return false;
                }
            }
            if (openParenthesis != closeParenthesis) {
                return false;
            }
            if (itemValue.contains(ConstantsCommon.DOUBLE_HYPHEN) || itemValue.contains(ConstantsCommon.PARENTHESIS)
                    || itemValue.contains(ConstantsCommon.PARENTHESIS_AND_PLUS)
                    || itemValue.contains(ConstantsCommon.PARENTHESIS_AND_MINUS)
                    || itemValue.contains(ConstantsCommon.PARENTHESIS_REVERSE)) {
                return false;
            }
        }
        return true;
    }
}
