package jp.co.softbrain.esales.commons.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Objects;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.domain.FieldInfoItem;
import jp.co.softbrain.esales.commons.repository.FieldInfoCustomRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoItemRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.AccessLogService;
import jp.co.softbrain.esales.commons.service.GetImportFieldsInfoService;
import jp.co.softbrain.esales.commons.service.UploadFileService;
import jp.co.softbrain.esales.commons.service.dto.FieldOptionItemDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldRelationItem1DTO;
import jp.co.softbrain.esales.commons.service.dto.FieldRelationItemDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldRelationItemDetailDTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportMappingItemDTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportMatchingKeyDTO;
import jp.co.softbrain.esales.commons.service.dto.TemplateFieldInfoDTO;
import jp.co.softbrain.esales.commons.service.mapper.FieldOptionMapper;
import jp.co.softbrain.esales.commons.service.mapper.TemplateFieldInfoMapper;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldOptionsItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldRelationItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMappingItemRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportMatchingKeyRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.FieldOptionsItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetFieldRelationItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMappingItemResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportMatchingKeyResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.TemplateFieldInfoResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.FileExtension;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link GetImportFieldsInfoService}.
 *
 * @author Trungnd
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class GetImportFieldsInfoServiceImpl implements GetImportFieldsInfoService {


    private static final Logger log = LoggerFactory.getLogger(GetImportFieldsInfoServiceImpl.class);
    
    private static final String CREATED_DATE = "created_date";
    private static final String CREATED_USER = "created_user";
    private static final String LANG_JA_JP = "ja_jp";
    private static final String PRODUCT_ID = "product_id";
    private static final String UPDATED_DATE = "updated_date";
    private static final String UPDATED_USER = "updated_user";

    @Autowired
    private FieldInfoCustomRepository fieldInfoCustomRepository;

    @Autowired
    private FieldInfoRepository fieldInfoRepository;

    @Autowired
    private FieldInfoItemRepository fieldInfoItemRepository;

    @Autowired
    private FieldOptionMapper fieldOptionMapper;
    
    @Autowired
    AccessLogService accessLogService;

    @Autowired
    UploadFileService uploadFileService;

    @Autowired
    private jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil jwtTokenUtil;

    private final TemplateFieldInfoMapper templateFieldInfoMapper;

    private static final String VALIDATION_ERROR = "ERR_COM_0013";
    private static final String NEW_LINE_CHAR = "\n";
    private static final String TEMPLATE_FIELD_CSV_FILE_NAME = "%s_import_template%s";
    private static final String ERR_COM_0077 = "ERR_COM_0077";
    private static final String ERR_COM_0076 = "ERR_COM_0076";
    private static final String ERR_COM_0035 = "ERR_COM_0035";

    public GetImportFieldsInfoServiceImpl(
            TemplateFieldInfoMapper templateFieldInfoMapper) {
        this.templateFieldInfoMapper = templateFieldInfoMapper;
    }
    
    /**
     * @see GetImportFieldsInfoService#getFilePathTemplateFieldsInfo(Integer)
     */
    public String getFilePathTemplateFieldsInfo(Integer importBelong) {

        TemplateFieldInfoResponse templateFieldsInfo = this.getTemplateFieldsInfo(importBelong);
        List<TemplateFieldInfoDTO> fields = templateFieldsInfo.getFields();
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        // Create CSV file, add header data to it
        List<String> nameHeaders = new ArrayList<>();
        for(TemplateFieldInfoDTO field : fields){
            JSONObject jsonFieldLabel;
            try {
                jsonFieldLabel = new JSONObject(field.getFieldLabel());
                StringBuilder nameHeader = new StringBuilder(); 
                nameHeader.append(jsonFieldLabel.getString(languageCode));
                if (field.getModifyFlag().equals(2) || field.getModifyFlag().equals(3))
                    nameHeader.append("（※必須項目です）");
                nameHeaders.add(nameHeader.toString());
            } catch (JSONException e) {
                throw new CustomRestException("Failed to get FilePathTemplateFieldsInfo header name",
                        CommonUtils.putError("Failed to get FilePathTemplateFieldsInfo header name", Constants.INTERRUPT_API));
            }
        }
        List<String> responseCSV = new ArrayList<>();
        responseCSV.add(String.join(ConstantsCommon.COMMA, nameHeaders));
        String serviceName = "";
        switch (Constants.FieldBelong.getEnum(importBelong)) {
        case ACTIVITY:
            serviceName = "ACTIVITY";
            break;
        case BUSINESS_CARD:
            serviceName = "BESINESS_CARD";
            break;
        case CUSTOMER:
            serviceName = "CUSTOMER";
            break;
        case DEPARTMENT:
            serviceName = "DEPARTMENT";
            break;
        case EMPLOYEE:
            serviceName = "EMPLOYEE";
            break;
        case LOG_ACCESS:
            serviceName = "LOG_ACCESS";
            break;
        case MILESTONE:
            serviceName = "MILESTONE";
            break;
        case PRODUCT:
            serviceName = "PRODUCT";
            break;
        case PRODUCT_ITEM:
            serviceName = "PRODUCT_ITEM";
            break;
        case SALE:
            serviceName = "SALE";
            break;
        case SCHEDULE:
            serviceName = "SCHEDULE";
            break;
        case TASK:
            serviceName = "TASK";
            break;
        case TIMELINE:
            serviceName = "TIMELINE";
            break;
        case TIMELINE_GROUP:
            serviceName = "TIMELINE_GROUP";
            break;
        case TRADING_PRODUCT:
            serviceName = "TRADING_PRODUCT";
            break;
        default:
            break;
        }
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyyMMdd HHmmss");
        String nowDate = dateFormatter.format(new Date());
        return uploadFileService.copyFileToS3(String.format(TEMPLATE_FIELD_CSV_FILE_NAME, serviceName, nowDate),
                FileExtension.CSV, String.join(NEW_LINE_CHAR, responseCSV));
    }

    @Override
    public TemplateFieldInfoResponse getTemplateFieldsInfo(
        Integer importBelong) {
        if (validateFieldBelong(importBelong)) {
            List<FieldInfo> templateFieldsInfo =
                fieldInfoRepository.getTemplateFieldsInfoByFieldBelong(importBelong);
            List<TemplateFieldInfoDTO> fields = new ArrayList<>();
            templateFieldsInfo.forEach(tfi -> {
                if (checkIgnoreField(importBelong, tfi)) {
                    // just ignore those field
                } else if (tfi.getFieldType() == 14) {
                    TemplateFieldInfoDTO zipCode = templateFieldInfoMapper.toDto(tfi);
                    zipCode.setFieldName(zipCode.getFieldName() + "_zipCode");
                    zipCode.setFieldLabel(
                        addTextToLabel(zipCode.getFieldLabel(), LANG_JA_JP, "（郵便番号）"));
                    fields.add(zipCode);

                    TemplateFieldInfoDTO addressName = templateFieldInfoMapper.toDto(tfi);
                    addressName.setFieldName(addressName.getFieldName() + "_addressName");
                    addressName.setFieldLabel(
                        addTextToLabel(addressName.getFieldLabel(), LANG_JA_JP, "（住所）"));
                    fields.add(addressName);

                    TemplateFieldInfoDTO buildingName = templateFieldInfoMapper.toDto(tfi);
                    buildingName.setFieldName(buildingName.getFieldName() + "_buildingName");
                    buildingName.setFieldLabel(
                        addTextToLabel(buildingName.getFieldLabel(), LANG_JA_JP, "（建物名）"));
                    fields.add(buildingName);
                } else if (tfi.getFieldType() == 18) {
                    TemplateFieldInfoDTO empName = templateFieldInfoMapper.toDto(tfi);
                    empName.setFieldName(empName.getFieldName() + "_employeeName");
                    empName.setFieldLabel(
                        addTextToLabel(empName.getFieldLabel(), LANG_JA_JP, "（社員名）"));
                    fields.add(empName);

                    TemplateFieldInfoDTO depName = templateFieldInfoMapper.toDto(tfi);
                    depName.setFieldName(depName.getFieldName() + "_departmentName");
                    depName.setFieldLabel(
                        addTextToLabel(depName.getFieldLabel(), LANG_JA_JP, "（部署名）"));
                    fields.add(depName);

                    TemplateFieldInfoDTO grpName = templateFieldInfoMapper.toDto(tfi);
                    grpName.setFieldName(grpName.getFieldName() + "_groupName");
                    grpName.setFieldLabel(
                        addTextToLabel(grpName.getFieldLabel(), LANG_JA_JP, "（グループ名）"));
                    fields.add(grpName);
                } else if (importBelong == 5 && tfi.getFieldName().equals("business")) {
                    TemplateFieldInfoDTO businessMain = templateFieldInfoMapper.toDto(tfi);
                    businessMain.setFieldName(businessMain.getFieldName() + "_main");
                    businessMain.setFieldLabel(
                        addTextToLabel(businessMain.getFieldLabel(), LANG_JA_JP, "（大分類）"));
                    fields.add(businessMain);

                    TemplateFieldInfoDTO businessSub = templateFieldInfoMapper.toDto(tfi);
                    businessSub.setFieldName(businessSub.getFieldName() + "_sub");
                    businessSub.setFieldLabel(
                        addTextToLabel(businessSub.getFieldLabel(), LANG_JA_JP, "（小分類）"));
                    fields.add(businessSub);
                } else {
                    fields.add(templateFieldInfoMapper.toDto(tfi));
                }
            });

            if (importBelong == 14) {
                TemplateFieldInfoDTO isSet = new TemplateFieldInfoDTO();

                isSet.setFieldName("is_set");
                isSet.setFieldLabel(
                    "{\"ja_jp\": \"セットフラグ (true/false)\",\"en_us\": \"product code\",\"zh_cn\": \"\"}");
                isSet.setModifyFlag(2);
                isSet.setIsDefault(true);
                fields.add(0, isSet);
            } else if (importBelong == 1401) {
                TemplateFieldInfoDTO setId = new TemplateFieldInfoDTO();
                setId.setFieldName("set_id");
                setId.setFieldLabel("{\"ja_jp\": \"セット商品コード\",\"en_us\": \"\",\"zh_cn\": \"\"}");
                setId.setModifyFlag(2);
                setId.setIsDefault(true);
                fields.add(0, setId);

                TemplateFieldInfoDTO productId = new TemplateFieldInfoDTO();
                productId.setFieldName(PRODUCT_ID);
                productId.setFieldLabel("{\"ja_jp\": \"商品コード\",\"en_us\": \"\",\"zh_cn\": \"\"}");
                productId.setModifyFlag(2);
                productId.setIsDefault(true);
                fields.add(1, productId);
            }

            TemplateFieldInfoResponse response = new TemplateFieldInfoResponse();
            response.setFields(fields);
            return response;
        }
        throw new CustomException(VALIDATION_ERROR);
    }

    /**
     * @see GetImportFieldsInfoService#getFieldRelationItem(GetFieldRelationItemRequest)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetFieldRelationItemResponse getFieldRelationItem(GetFieldRelationItemRequest request) {
        // 1. Validate parameter
        if (request.getFieldBelong() == null) {
            throw new CustomException("Param [fieldBelong] is null.", "fieldBelong", Constants.RIQUIRED_CODE);
        }

        // 2. Get List relationItems
        List<FieldRelationItem1DTO> relationFieldInfo = fieldInfoCustomRepository
                .getFieldRelationByFieldBelong(request.getFieldBelong().intValue());

        Map<Long, FieldRelationItemDTO> mapKey = new HashMap<>();
        for (FieldRelationItem1DTO field : relationFieldInfo) {
            FieldRelationItemDTO flRelation = mapKey.get(field.getFieldId());
            if (flRelation == null) {
                flRelation = new FieldRelationItemDTO();
                flRelation.setFieldId(field.getFieldId());
                flRelation.setFieldLabel(field.getFieldLabel());
                flRelation.setFieldName(field.getFieldName());
                flRelation.setFieldBelong(field.getRelationFieldBelong());
                flRelation.setRelationMatching(new ArrayList<>());
            }
            List<FieldRelationItemDetailDTO> relationMatching = flRelation.getRelationMatching();
            FieldRelationItemDetailDTO dto = new FieldRelationItemDetailDTO();
            dto.setFieldId(field.getRelationFieldId());
            dto.setFieldLabel(field.getRelationFieldLabel());
            relationMatching.add(dto);
            mapKey.put(field.getFieldId(), flRelation);
        }
        List<FieldRelationItemDTO>  relationItems = mapKey.keySet().stream().map(mapKey::get).collect(Collectors.toList());
        return new GetFieldRelationItemResponse(relationItems);
    }

    /**
     * @see GetImportFieldsInfoService#getImportMatchingKey(GetImportMatchingKeyRequest)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetImportMatchingKeyResponse getImportMatchingKey(GetImportMatchingKeyRequest request) {
        GetImportMatchingKeyResponse rs = new GetImportMatchingKeyResponse();
        // 1. Validate parameter
        if (request.getServiceId() == null) {
            throw new CustomException("Param [serviceId] is null.", "serviceId", Constants.RIQUIRED_CODE);
        }
        // 2. Get Default list
        List<GetImportMatchingKeyDTO> importMatchingKey = getDefaultImportMatchingKey(
                request.getServiceId().intValue());

        rs.setImportMatchingKey(importMatchingKey);
        // 3.Get Matching Item
        FieldBelong belong = FieldBelong.getEnum(request.getServiceId().intValue());
        if (Objects.equal(FieldBelong.DEPARTMENT, belong)) {
            List<GetImportMatchingKeyDTO> matchingItems = fieldInfoRepository
                    .getMatchingItemsByFieldBelong(request.getServiceId().intValue());
            rs.getImportMatchingKey().addAll(matchingItems);
        }
        return rs;
    }


    /**
     * @see GetImportFieldsInfoService#getFieldOptionsItem(jp.co.softbrain.esales.commons.web.rest.vm.request.GetFieldOptionsItemRequest)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public FieldOptionsItemResponse getFieldOptionsItem(GetFieldOptionsItemRequest req) {
        FieldOptionsItemResponse response = new FieldOptionsItemResponse();
        // 1. Validate parameter
        if (req.getFieldBelong() == null) {
            throw new CustomException("Param [fieldBelong] is null.", "fieldBelong", Constants.RIQUIRED_CODE);
        }
        // 2. Get options field list
        List<FieldOptionItemDTO> fieldOptionsItem = new ArrayList<>();
        List<FieldInfo> optionsItem = fieldInfoRepository
                .getFieldOptionsItemByFieldBelong(req.getFieldBelong().intValue());

        optionsItem.forEach(fi -> {
            List<FieldInfoItem> fieldInfoItems = fieldInfoItemRepository
                    .findAllByFieldIdAndIsAvailableIsTrue(fi.getFieldId());
            FieldOptionItemDTO fieldOptionItem = new FieldOptionItemDTO();
            fieldOptionItem.setFieldId(fi.getFieldId());
            fieldOptionItem.setFieldLabel(fi.getFieldLabel());
            fieldOptionItem.setFieldName(fi.getFieldName());
            fieldOptionItem.setFieldOptions(fieldOptionMapper.toDto(fieldInfoItems));

            fieldOptionsItem.add(fieldOptionItem);
        });

        response.setFieldOptionsItem(fieldOptionsItem);
        return response;
    }

    private boolean validateFieldBelong(Integer fieldBelong) {
        return fieldBelong != null && fieldBelong != 0;
    }

    private String getLabel(String label, String lang) {
        try {
            JSONObject jObject = new JSONObject(label);
            return jObject.getString(lang);
        } catch (JSONException e) {
            return "";
        }
    }

    private String addTextToLabel(String label, String lang, String textToAdd) {
        try {
            JSONObject jObject = new JSONObject(label);
            String newLabel = jObject.getString(lang) + textToAdd;
            jObject.put(lang, newLabel);
            return jObject.toString();
        } catch (JSONException e) {
            return "{\"" + lang + "\": \"" + textToAdd + "\"";
        }
    }

    /**
     * getLabelFromJPLabel
     * 
     * @param label
     * @return
     */
    private static String getLabelFromJP(String label) {
        JSONObject jobj = new JSONObject();
        try {
            jobj.put(ConstantsCommon.LANGUAGE_LIST.get(1), label);
            return jobj.toString();
        } catch (JSONException e) {
            log.error("Can not write label {}", e.getLocalizedMessage());
        }
        return null;
    }

    private boolean checkIgnoreField(Integer importBelong, FieldInfo fieldInfo) {
        String name = fieldInfo.getFieldName();
        List<String> list = new ArrayList<>();
        switch (importBelong) {
            case 14:
                list.add("product_image_name");
                list.add("product_relation_id");
                list.add(CREATED_DATE);
                list.add(CREATED_USER);
                list.add(UPDATED_DATE);
                list.add(UPDATED_USER);
                return list.contains(name);
            case 1401:
                return "unit_price".equals(name);
            case 6:
                list.add("next_schedule_id");
                list.add("business_card_id");
                list.add(CREATED_DATE);
                list.add(CREATED_USER);
                list.add(UPDATED_DATE);
                list.add(UPDATED_USER);
                return list.contains(name);
            case 4:
                list.add("business_card_image_path");
                list.add(CREATED_DATE);
                list.add(CREATED_USER);
                list.add(UPDATED_DATE);
                list.add(UPDATED_USER);
                return list.contains(name);
            case 16:
                list.add("product_trading_id");
                list.add(CREATED_DATE);
                list.add(CREATED_USER);
                list.add(UPDATED_DATE);
                list.add(UPDATED_USER);
                return list.contains(name);
            case 5:
                list.add("scenario_id");
                list.add("schedule_next");
                list.add("action_next");
                list.add("customer_logo");
                list.add("is_display_child_customers");
                list.add(CREATED_DATE);
                list.add(CREATED_USER);
                list.add(UPDATED_DATE);
                list.add(UPDATED_USER);
                return list.contains(name);
            case 8:
                return "employee_subordinates".equals(name);
            default:
                return false;
        }
    }

    /**
     * default field for matching key
     * 
     * @param serviceId
     * @return lst GetImportMatchingKeyDTO
     */
    private List<GetImportMatchingKeyDTO> getDefaultImportMatchingKey(Integer serviceId) {
        FieldBelong belong = FieldBelong.getEnum(serviceId);
        List<GetImportMatchingKeyDTO> defaultList = new ArrayList<>();
        switch (belong) {
        case CUSTOMER: // Customer
            defaultList.add(new GetImportMatchingKeyDTO("customer_name", getLabelFromJP("顧客名")));
            defaultList.add(new GetImportMatchingKeyDTO("customer_name|customer_address", getLabelFromJP("顧客名＋住所")));
            defaultList.add(new GetImportMatchingKeyDTO("customer_id", getLabelFromJP("顧客コード")));
            break;
        case EMPLOYEE: // Employee
            defaultList.add(new GetImportMatchingKeyDTO("employee_id", getLabelFromJP("社員コード")));
            defaultList.add(new GetImportMatchingKeyDTO("email", getLabelFromJP("メールアドレス")));
            break;
        case BUSINESS_CARD: // Business card
            defaultList.add(new GetImportMatchingKeyDTO("first_name", getLabelFromJP("名前（姓）")));
            defaultList.add(new GetImportMatchingKeyDTO("last_name", getLabelFromJP("名前（名）")));
            defaultList.add(new GetImportMatchingKeyDTO("business_card_id", getLabelFromJP("名刺コード")));
            defaultList.add(new GetImportMatchingKeyDTO("email_address", getLabelFromJP("メールアドレス")));
            break;
        case PRODUCT: // Product
            defaultList.add(new GetImportMatchingKeyDTO("product_name", getLabelFromJP("商品名")));
            defaultList.add(new GetImportMatchingKeyDTO(PRODUCT_ID, getLabelFromJP("商品コード")));
            break;
        case PRODUCT_ITEM: // Product set
            defaultList.add(new GetImportMatchingKeyDTO("set_id|product_id", getLabelFromJP("セット商品コード + 商品コード")));
            break;
        case ACTIVITY: // Activty
            defaultList.add(
                    new GetImportMatchingKeyDTO("employee_id|activity_start_time", getLabelFromJP("報告者＋開始時刻（接触日）")));
            defaultList.add(new GetImportMatchingKeyDTO("activity_id", getLabelFromJP("活動コード")));
            break;
        case DEPARTMENT: // department
            defaultList.add(new GetImportMatchingKeyDTO("department_name", getLabelFromJP("部署番号")));
            break;
        case SALE:
            defaultList.add(new GetImportMatchingKeyDTO("product_trading_id", getLabelFromJP("取引商品コード")));
            defaultList.add(new GetImportMatchingKeyDTO("product_name", getLabelFromJP("商品名")));
            defaultList.add(new GetImportMatchingKeyDTO(PRODUCT_ID, getLabelFromJP("商品コード")));
            defaultList.add(
                    new GetImportMatchingKeyDTO("activity_product_trading_history_id", getLabelFromJP("活動取引商品コード")));
            break;
        case TASK:
            defaultList.add(new GetImportMatchingKeyDTO("task_name", getLabelFromJP("タスク名")));
            defaultList.add(new GetImportMatchingKeyDTO("task_id", getLabelFromJP("タスクコード")));
            break;
        default:
            return Collections.emptyList();
        }
        return defaultList;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.TemplateFieldsInfoService#getImportMappingItem(GetImportMappingItemRequest
     *      req)
     */
    @Override
    public GetImportMappingItemResponse getImportMappingItem(GetImportMappingItemRequest req) {
        // Step 1 Validate User
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not permission.",
                    CommonUtils.putError("User does not permission.", Constants.USER_NOT_PERMISSION));
        }
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        // Step 1 Validate Parameter
        if (req.getServiceId() == null) {
            throw new CustomRestException("param [serviceId] is null",
                    CommonUtils.putError("param [serviceId] is null", Constants.RIQUIRED_CODE));
        }

        // Step 1 Validate match_key
        final List<String> headerCsvList = new ArrayList<>();

        for (String s : req.getHeaderCsv()) {
            s = s.replace("（※必須項目です）", "");
            headerCsvList.add(s);
        }
        if (req.getMatchingKey() != null && !headerCsvList.contains(req.getMatchingKey())) {
            throw new CustomRestException(ERR_COM_0077, CommonUtils.putError(ERR_COM_0077, ERR_COM_0077));
        }

        // Step 2 getTemplateFieldsInfo
        Integer serviceId = req.getServiceId();
        TemplateFieldInfoResponse templateFieldsInfo = this.getTemplateFieldsInfo(serviceId);

        // Step 3 Mapping
        Set<String> headerFound = new HashSet<>();
        List<GetImportMappingItemDTO> importMappingItem = new ArrayList<>();

        templateFieldsInfo.getFields().forEach(fieldInfo -> {
            String headerCsv = headerCsvList.stream()
                    .filter(e -> e.equals(getLabel(fieldInfo.getFieldLabel(), languageCode))).findFirst().orElse(null);
            if (headerCsv != null && !headerFound.contains(headerCsv)) {
                headerFound.add(headerCsv);
                int index = headerCsvList.indexOf(headerCsv);

                GetImportMappingItemDTO mappingItem = new GetImportMappingItemDTO();
                mappingItem.setFieldName(fieldInfo.getFieldName());
                mappingItem.setColumnCsv(index);
                mappingItem.setIsDefault(fieldInfo.getIsDefault());
                mappingItem.setFieldType(fieldInfo.getFieldType());
                mappingItem.setFieldLabel(fieldInfo.getFieldLabel());
                importMappingItem.add(mappingItem);
            } else {
                if (fieldInfo.getModifyFlag() == 2 || fieldInfo.getModifyFlag() == 3) {
                    throw new CustomRestException(ERR_COM_0076, CommonUtils.putError(ERR_COM_0076, ERR_COM_0076));
                }
            }
        });

        headerCsvList.forEach(headerCsv -> {
            // Find field mapped with headerCsv
            TemplateFieldInfoDTO mappedField = templateFieldsInfo.getFields().stream()
                    .filter(field -> getLabel(field.getFieldLabel(), languageCode).equals(headerCsv)).findFirst()
                    .orElse(null);
            if (mappedField == null) {
                throw new CustomRestException(ERR_COM_0035, CommonUtils.putError(ERR_COM_0035, ERR_COM_0035));
            }
        });

        return new GetImportMappingItemResponse(importMappingItem);
    }

}