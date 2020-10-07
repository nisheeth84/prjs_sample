package jp.co.softbrain.esales.customers.service.impl;

import java.io.IOException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.CaseFormat;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.config.Constants.TimelineAuto;
import jp.co.softbrain.esales.customers.config.ApplicationProperties;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import jp.co.softbrain.esales.customers.repository.CustomersHistoriesRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersCUDService;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.CustomersHistoriesService;
import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.dto.CustomerDataTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;
import jp.co.softbrain.esales.customers.service.dto.IntegrateCustomerInDTO;
import jp.co.softbrain.esales.customers.service.dto.PersonInChargeDTO;
import jp.co.softbrain.esales.customers.service.dto.activities.UpdateActivityCustomerRelationRequet;
import jp.co.softbrain.esales.customers.service.dto.activities.UpdateActivityCustomerRelationResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCompanyInDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCustomerRelationDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCustomerRelationRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCustomerRelationResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationInSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationInSubType6DTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.ReceiverDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.DepartmentPositionDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.ListTaskIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.UpdateScheduleCustomerRelationRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.UpdateScheduleCustomerRelationResponse;
import jp.co.softbrain.esales.customers.service.dto.schedules.UpdateTaskCustomerRelationRequest;
import jp.co.softbrain.esales.customers.service.dto.timelines.UpdateRelationDataInForm;
import jp.co.softbrain.esales.customers.service.mapper.CustomersHistoriesMapper;
import jp.co.softbrain.esales.customers.service.mapper.CustomersInputMapper;
import jp.co.softbrain.esales.customers.service.mapper.CustomersMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.util.ChannelUtils;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerIdOutResponse;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CheckUtil;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RelationUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.BaseFileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.RelationDataInfosInDTO;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataRequest;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataResponse;
import jp.co.softbrain.esales.utils.dto.timelines.CreateTimelineAutoRequest;
import jp.co.softbrain.esales.utils.dto.timelines.TimelineHeaderDTO;
import jp.co.softbrain.esales.utils.dto.timelines.TimelineInfoDTO;
import jp.co.softbrain.esales.utils.dto.timelines.TimelineReceiverDTO;

/**
 * Create, Update, Delete for Customer
 *
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersCUDServiceImpl implements CustomersCUDService {
    private final Logger log = LoggerFactory.getLogger(CustomersCUDServiceImpl.class);

    @Autowired
    private HttpServletRequest servletRequest;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Service
    @Autowired
    private CustomersHistoriesService customersHistoriesService;
    @Autowired
    private CustomersCommonService customersCommonService;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private CustomersService customersService;

    @Autowired
    private CustomersRepositoryCustom customersRepositoryCustom;
    @Autowired
    private CustomersRepository customersRepository;
    @Autowired
    private CustomersHistoriesRepository customersHistoriesRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;
    @Autowired
    private ChannelUtils channelUtils;

    // Mapper
    @Autowired
    private CustomersInputMapper customersInputMapper;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CustomersMapper customersMapper;
    @Autowired
    private CustomersHistoriesMapper customersHistoriesMapper;

    private Gson gson = new Gson();

    private static final String METHOD_GET_PREFFIX = "get";
    private static final String METHOD_SET_PREFFIX = "set";

    private static final String CONVERT_DATA_ERROR = "Can not convert data";
    private static final String STRING_ARRAY_EMPTY = "[]";
    private static final String BUSINESS_SUB_ID = "businessSubId";
    private static final String CUSTOMER_DATA = "customerData";

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCUDService#createCustomer(jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO,
     *      java.util.List)
     */
    @Override
    @Transactional
    public Long createCustomer(CustomersInputDTO inputData, List<FileMappingDTO> filesMap) throws IOException {
        // get-date format
        String formatDate = getFormatDate();
        // 1. validate parameters
        validateCreateCustomer(inputData, formatDate);

        Long emloyeeIdLogin = jwtTokenUtil.getEmployeeIdFromToken();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        // 2. Upload photo
        CustomersDTO customersDTO = customersInputMapper.toCustomerDTOWithoutCustomerData(inputData);
        List<CustomerDataTypeDTO> listCustomerData = inputData.getCustomerData();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(emloyeeIdLogin, filesMap,
                tenantName, applicationProperties.getUploadBucket(), FieldBelongEnum.CUSTOMER);
        Map<String, List<FileInfosDTO>> customersFilesMap = null;
        if (uploadData != null) {
            customersFilesMap = uploadData.get(0L);
        }
        FileInfosDTO iconFile = processCustomerLogo(customersFilesMap, inputData.getCustomerLogo());
        String newCusData = getJsonCustomerDataCreate(listCustomerData, uploadData, formatDate);
        customersDTO.setCustomerData(newCusData);
        if (iconFile != null) {
            customersDTO.setPhotoFileName(iconFile.getFileName());
            customersDTO.setPhotoFilePath(iconFile.getFilePath());
        }
        // 3. insert data customers
        CustomersDTO customerDto = buildDTOToCreate(getDataFromInputToDTO(inputData, customersDTO));
        customerDto.setCreatedUser(emloyeeIdLogin);
        customerDto.setUpdatedUser(emloyeeIdLogin);
        customerDto = customersService.save(customerDto);
        Long customerIdCreated = customerDto.getCustomerId();

        // 3. insert data history customer
        CustomersHistoriesDTO historyDTO = new CustomersHistoriesDTO();
        historyDTO.setCustomerId(customerIdCreated);
        historyDTO.setCreatedUser(emloyeeIdLogin);
        historyDTO.setUpdatedUser(emloyeeIdLogin);
        historyDTO.setContentChange(null);
        customersHistoriesService.save(historyDTO);

        // Update relation data
        GetCustomFieldsInfoRequest request;
        request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse;
        fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, request, CommonFieldInfoResponse.class,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());
        updateRelationData(Collections.emptyMap(), inputData.getCustomerData(), fieldInfoResponse.getCustomFieldsInfo(),
                customerIdCreated);

        // 6. Call API createTimelineAuto
        callAPIcreateTimelineAuto(customerIdCreated, new CustomersDTO(), customerDto,
                ConstantsCustomers.MODE_CREATE_TIMELINE_AUTO);
        // 7. Call API createNotification
        createNotificationForCustomer(emloyeeIdLogin, customerIdCreated, customerDto.getCustomerName(), 0);

        // 5. sync data on ElasticSearch
        List<Long> customerIdsSync = new ArrayList<>();
        customerIdsSync.add(customerIdCreated);
        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null, customerIdsSync,
                Constants.ChangeAction.INSERT.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return customerDto.getCustomerId();
    }

    /**
     * Create Notification for Task
     * 
     * @param emloyeeIdLogin
     *            employeeId
     * @param customerIdCreated
     *            customerId
     * @param customerName
     *            customerName
     * @param mode
     *            0: create <br>
     *            1: Update
     */
    private void createNotificationForCustomer(Long emloyeeIdLogin, Long customerIdCreated, String customerName, int mode) {
        CreateNotificationRequest notificationReq = new CreateNotificationRequest();
        notificationReq.setDataNotification(new CreateNotificationInSubType1DTO(emloyeeIdLogin, 4, 1));
        ReceiverDTO receiverDTO = new ReceiverDTO();
        receiverDTO.setReceiverName(jwtTokenUtil.getEmployeeNameFromToken());
        List<ReceiverDTO> receiverList = new ArrayList<>();
        receiverList.add(receiverDTO);
        List<CreateNotificationInSubType6DTO> customerList = new ArrayList<>();
        CreateNotificationInSubType6DTO customerDTO = getCreateNotificationSubDTO(customerIdCreated, customerName);
        customerDTO.setReceivers(receiverList);
        customerDTO.setCustomerMode(mode);
        customerList.add(customerDTO);
        notificationReq.setCustomer(customerList);
        channelUtils.createNotification(notificationReq);
    }

    /**
     * Get format date of employee login
     *
     * @return String format date
     */
    public String getFormatDate() {
        String formatDate = servletRequest.getHeader(ConstantsCustomers.CUSTOMER_FORMAT_DATE);
        if (StringUtil.isEmpty(formatDate)) {
            formatDate = jwtTokenUtil.getFormatDateFromToken();
        }
        if (StringUtil.isEmpty(formatDate)) {
            formatDate = ConstantsCustomers.APP_DATE_FORMAT_ES;
        }
        return formatDate;
    }

    /**
     * add data for Map<String, Object> empData
     *
     * @throws JsonProcessingException
     */
    private void getDataFromEmployeeDataCreate(Map<String, Object> empData,
            CustomerDataTypeDTO data,
            List<FileInfosDTO> listFiles, String formatDate) throws JsonProcessingException {
        if (FieldTypeEnum.FILE.getCode().equals(data.getFieldType())) {
            if (listFiles != null) {
                List<BaseFileInfosDTO> listSaveDb = new ArrayList<>();
                listFiles.forEach(file -> {
                    BaseFileInfosDTO fileSaveDb = new BaseFileInfosDTO();
                    fileSaveDb.setFileName(file.getFileName());
                    fileSaveDb.setFilePath(file.getFilePath());
                    listSaveDb.add(fileSaveDb);
                });
                empData.put(data.getKey(), objectMapper.writeValueAsString(listSaveDb));
            }
        } else if (StringUtils.isNotBlank(data.getValue()) && !STRING_ARRAY_EMPTY.equals(data.getValue())) {
            if (FieldTypeEnum.PULLDOWN.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.RADIO.getCode().equals(data.getFieldType())) {
                empData.put(data.getKey(), Long.valueOf(data.getValue()));
            } else if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.CHECKBOX.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.RELATION.getCode().equals(data.getFieldType())) {
                List<Long> fValue = null;
                try {
                    TypeReference<ArrayList<Long>> typeRef = new TypeReference<ArrayList<Long>>() {
                    };
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
                empData.put(data.getKey(), fValue);
            } else if (FieldTypeEnum.NUMBER.getCode().equals(data.getFieldType())) {
                if (CheckUtil.isNumeric(data.getValue())) {
                    empData.put(data.getKey(), Long.valueOf(data.getValue()));
                } else {
                    empData.put(data.getKey(), Double.valueOf(data.getValue()));
                }
            } else if (FieldTypeEnum.DATE.getCode().equals(data.getFieldType())) {
                getSystemDate(empData, formatDate, data.getValue(), data.getKey(), null);
            } else if (FieldTypeEnum.TIME.getCode().equals(data.getFieldType())) {
                getSystemTime(empData, DateUtil.FORMAT_HOUR_MINUTE, data.getValue(), data.getKey());
            } else if (FieldTypeEnum.DATETIME.getCode().equals(data.getFieldType())) {
                String date = data.getValue().substring(0, formatDate.length());
                String hour = data.getValue().substring(formatDate.length());
                getSystemDate(empData, formatDate, date, data.getKey(), hour);
            } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(data.getFieldType())) {
                List<Object> fValue = null;
                try {
                    TypeReference<ArrayList<Object>> typeRef = new TypeReference<ArrayList<Object>>() {};
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
                empData.put(data.getKey(), fValue);
            } else if (FieldTypeEnum.LINK.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.ADDRESS.getCode().equals(data.getFieldType())) {
                Map<String, String> fValue = new HashMap<>();
                try {
                    TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                    empData.put(data.getKey(), fValue);
                } catch (Exception e) {
                    log.error(e.getLocalizedMessage());
                }
            } else {
                empData.put(data.getKey(), data.getValue());
            }
        }
    }

    /**
     * Get system date
     *
     * @param cusData
     * @param formatDate
     * @param value
     * @param key
     */
    private void getSystemDate(Map<String, Object> cusData, String formatDate, String value, String key, String hour) {
        String dbDateFormat = DateUtil.FORMAT_YEAR_MONTH_DAY_HYPHEN;
        if (!StringUtils.isBlank(hour)) {
            formatDate += " " + DateUtil.FORMAT_HOUR_MINUTE;
            value += " " + hour;
            dbDateFormat += " " + DateUtil.FORMAT_HOUR_MINUTE_SECOND;
        }
        SimpleDateFormat userFormat = new SimpleDateFormat(formatDate);
        String systemDateFormat = dbDateFormat;
        try {
            Date date = userFormat.parse(value);
            String dateSystem = new SimpleDateFormat(systemDateFormat).format(date);
            cusData.put(key, dateSystem);
        } catch (ParseException e) {
            String dateSystem = "";
            cusData.put(key, dateSystem);
        }
    }

    /**
     * Get system time
     *
     * @param cusData
     * @param formatTime
     * @param value
     * @param key
     */
    private void getSystemTime(Map<String, Object> cusData, String formatTime, String value, String key) {
        try {
            SimpleDateFormat dbTimeFormater = new SimpleDateFormat(DateUtil.FORMAT_HOUR_MINUTE_SECOND);
            cusData.put(key, dbTimeFormater.format(new SimpleDateFormat(formatTime).parse(value)));
        } catch (ParseException e) {
            cusData.put(key, "");
        }
    }

    /**
     * process Customer Icon update data
     *
     * @param customerFilesMap
     *            customer icon upload
     * @param iconUpdateData
     *            data of icon that either be kept or deleted
     * @return customer icon data string to insert into db
     */
    private FileInfosDTO processCustomerLogo(Map<String, List<FileInfosDTO>> customersFilesMap, String oldIcon) {
        List<FileInfosDTO> listFiles = null;
        if (CollectionUtils.isEmpty(customersFilesMap)
                || customersFilesMap.get(ConstantsCustomers.FIELD_NAME_CUSTOMER_ICON) == null) {
            listFiles = new ArrayList<>();
        } else {
            listFiles = customersFilesMap.get(ConstantsCustomers.FIELD_NAME_CUSTOMER_ICON);
        }

        KeyValue keyVal = new KeyValue();
        keyVal.setKey(ConstantsCustomers.FIELD_NAME_CUSTOMER_ICON);
        if (StringUtils.isBlank(oldIcon)) {
            oldIcon = STRING_ARRAY_EMPTY;
        }
        keyVal.setValue(oldIcon);

        S3FileUtil.processUpdateFileInfo(keyVal, listFiles, objectMapper, applicationProperties.getUploadBucket());
        return !listFiles.isEmpty() ? listFiles.get(0) : null;
    }

    /**
     * get Json for column customer_data
     *
     * @param listCustomerData
     *            listCustomerData
     * @param uploadData
     *            uploadData
     * @param formatDate
     *            formatDate
     * @return result
     * @throws JsonProcessingException
     */
    private String getJsonCustomerDataCreate(
            List<CustomerDataTypeDTO> listCustomerData,
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData, String formatDate) throws JsonProcessingException {
        Map<String, Object> empData = new HashMap<>();
        Map<String, List<FileInfosDTO>> customerFilesMap = null;
        if (uploadData != null) {
            customerFilesMap = uploadData.get(0L);
        }
        if (listCustomerData != null && !listCustomerData.isEmpty()) {
            for (CustomerDataTypeDTO data : listCustomerData) {
                List<FileInfosDTO> listFiles = null;
                if (customerFilesMap != null) {
                    listFiles = customerFilesMap.get(data.getKey());
                }
                getDataFromEmployeeDataCreate(empData, data, listFiles, formatDate);
            }
        }
        return objectMapper.writeValueAsString(empData);
    }

    /**
     * Build customer DTO to save to DB
     *
     * @param customerDto
     *            - DTO to build
     * @return DTO has been built
     */
    private CustomersDTO buildDTOToCreate(CustomersDTO customerDto) {
        if (customerDto.getBusinessMainId() < 0) {
            customerDto.setBusinessMainId(0);
        }
        if (customerDto.getBusinessSubId() < 0) {
            customerDto.setBusinessSubId(0);
        }
        if (customerDto.getEmployeeId() == null) {
            customerDto.setEmployeeId(ConstantsCustomers.LONG_VALUE_0L);
        }
        if (customerDto.getDepartmentId() == null) {
            customerDto.setDepartmentId(ConstantsCustomers.LONG_VALUE_0L);
        }
        if (customerDto.getGroupId() == null) {
            customerDto.setGroupId(ConstantsCustomers.LONG_VALUE_0L);
        }
        if (customerDto.getScenarioId() == null) {
            customerDto.setScenarioId(ConstantsCustomers.LONG_VALUE_0L);
        }
        customerDto.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        customerDto.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return customerDto;
    }

    /**
     * Build customer DTO to save to DB
     *
     * @param customerDto
     *            - DTO to build
     * @param inputData
     * @return DTO has been built
     */
    private CustomersDTO buildDTOToUpdate(CustomersDTO customerDto, CustomersInputDTO inputData) {
        if (inputData.getPersonInCharge() != null) {
            PersonInChargeDTO personInChargeDTO = inputData.getPersonInCharge();
            if (personInChargeDTO.getEmployeeId() == null) {
                customerDto.setEmployeeId(ConstantsCustomers.LONG_VALUE_0L);
            } else {
                customerDto.setEmployeeId(personInChargeDTO.getEmployeeId());
            }
            if (personInChargeDTO.getDepartmentId() == null) {
                customerDto.setDepartmentId(ConstantsCustomers.LONG_VALUE_0L);
            } else {
                customerDto.setDepartmentId(personInChargeDTO.getDepartmentId());
            }
            if (personInChargeDTO.getGroupId() == null) {
                customerDto.setGroupId(ConstantsCustomers.LONG_VALUE_0L);
            } else {
                customerDto.setGroupId(personInChargeDTO.getGroupId());
            }
        }
        if (customerDto.getBusinessMainId() == null || customerDto.getBusinessMainId() < 0) {
            customerDto.setBusinessMainId(0);
        }
        if (customerDto.getBusinessSubId() == null || customerDto.getBusinessSubId() < 0) {
            customerDto.setBusinessSubId(0);
        }

        customerDto.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return customerDto;
    }

    /**
     * Validate for API createCustomer
     *
     * @param inputData
     *            - input data for main table
     */
    private void validateCreateCustomer(CustomersInputDTO inputData, String formatDate) {
        if (inputData == null) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError("inputData", Constants.RIQUIRED_CODE));
        }
        List<Map<String, Object>> listValidate = new ArrayList<>();
        if (inputData.getCustomerName() == null || inputData.getCustomerName().isBlank()) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.PARAM_CUSTOMER_NAME, Constants.RIQUIRED_CODE));
        }
        if (inputData.getBusinessMainId() == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.PARAM_BUSINESS_MAIN_ID, Constants.RIQUIRED_CODE));
        }
        if (inputData.getBusinessSubId() == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.PARAM_BUSINESS_SUB_ID, Constants.RIQUIRED_CODE));
        }

        // build map parameters
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        String validateJson = jsonBuilder.build(FieldBelongEnum.CUSTOMER.getCode(), (Map<String, Object>) null,
                buildParamsValidateCustomersInput(inputData, jsonBuilder), formatDate);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        listValidate.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!listValidate.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, listValidate);
        }
    }

    /**
     * Get data from input customer for DTO customer
     *
     * @param inputCustomer
     *            - object contains input data
     * @param dtoCustomer
     *            - object to save data
     * @return - object has been given data
     */
    private CustomersDTO getDataFromInputToDTO(CustomersInputDTO inputCustomer, CustomersDTO dtoCustomer) {
        // set value for fields of DTO if input not null
        Arrays.asList(CustomersInputDTO.class.getDeclaredFields()).stream().forEach(field -> {
            if (field.getName().equals(ConstantsCustomers.FIELD_CUSTOMER_DATA)) {
                return;
            }
            String methodGet = METHOD_GET_PREFFIX
                    .concat(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL, field.getName()));
            String methodSet = METHOD_SET_PREFFIX
                    .concat(CaseFormat.LOWER_CAMEL.to(CaseFormat.UPPER_CAMEL, field.getName()));
            try {
                Method inputMethod = CustomersInputDTO.class.getMethod(methodGet);
                if (inputMethod.invoke(inputCustomer) != null) {
                    Method outMethod = CustomersDTO.class.getMethod(methodSet, inputMethod.getReturnType());
                    outMethod.invoke(dtoCustomer, inputMethod.getReturnType().cast(inputMethod.invoke(inputCustomer)));
                }
            } catch (Exception e) {
                return;
            }
        });
        dtoCustomer.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return dtoCustomer;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#updateCustomer(jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO,
     *      jp.co.softbrain.esales.customers.service.dto.CreateUpdateCustomerInSubType1DTO,
     *      java.util.List)
     */
    @Override
    @Transactional
    public Long updateCustomer(CustomersInputDTO inputData, List<FileMappingDTO> filesMap) throws IOException {
        // get-date format
        String formatDate = getFormatDate();
        // validate parameter
        validateUpdateCustomer(inputData, formatDate);
        CustomersDTO oldDto = customersService.findOne(inputData.getCustomerId()).orElse(null);

        // exclusive check
        if (oldDto == null) {
            throw new CustomRestException(ConstantsCustomers.DATA_HAS_BEEN_CHANGED, CommonUtils
                    .putError(ConstantsCustomers.CUSTOMER_ID, Constants.EXCLUSIVE_CODE));
        }
        CustomersDTO cloneDto = customersMapper.clone(oldDto);
        // 2. get custom fields info
        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, request, CommonFieldInfoResponse.class,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());

        Long emloyeeIdLogin = jwtTokenUtil.getEmployeeIdFromToken();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        // 4. Upload photo
        CustomersDTO customersDTO = customersInputMapper.toCustomerDTOWithoutCustomerData(inputData);
        List<CustomerDataTypeDTO> listCustomerData = inputData.getCustomerData();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(emloyeeIdLogin, filesMap,
                tenantName, applicationProperties.getUploadBucket(), FieldBelongEnum.CUSTOMER);
        Map<String, List<FileInfosDTO>> customersFilesMap = null;
        if (uploadData != null && inputData.getCustomerId() != null) {
            customersFilesMap = uploadData.get(inputData.getCustomerId());
            String newCusData = getJsonCustomerDataUpdate(oldDto, listCustomerData,
                    fieldInfoResponse.getCustomFieldsInfo(), uploadData.get(oldDto.getCustomerId()), formatDate);
            customersDTO.setCustomerData(newCusData);
        }
        FileInfosDTO iconFile = processCustomerLogo(customersFilesMap, inputData.getCustomerLogo());
        if (iconFile != null) {
            customersDTO.setPhotoFileName(iconFile.getFileName());
            customersDTO.setPhotoFilePath(iconFile.getFilePath());
        } else {
            customersDTO.setPhotoFileName("");
            customersDTO.setPhotoFilePath("");
        }

        // 5. update customer
        // Convert to DTO
        oldDto = CustomersCommonUtil.mappingDataForObject(customersDTO, oldDto, null, true);
        oldDto.setParentId(customersDTO.getParentId());
        oldDto.setUpdatedUser(emloyeeIdLogin);
        if (inputData.getPersonInCharge() != null) {
            buildPersonInChargeForCustomer(inputData.getPersonInCharge().getEmployeeId(),
                    inputData.getPersonInCharge().getDepartmentId(), inputData.getPersonInCharge().getGroupId(),
                    oldDto);
        }

        CustomersDTO savedDto = customersService.save(buildDTOToUpdate(oldDto, inputData));
        Long customerIdUpdated = savedDto.getCustomerId();

        // Update relation data
        updateRelationData(cloneDto.getCustomerData(), inputData.getCustomerData(),
                fieldInfoResponse.getCustomFieldsInfo(),
                customerIdUpdated);

        // 5. save data into customers history
        CustomersHistoriesDTO historyDto = customersHistoriesMapper.toCustomersHistoriesDTO(savedDto);
        historyDto.setContentChange(CustomersCommonUtil.getContentChanges(cloneDto, savedDto, true).toString());
        historyDto.setCreatedUser(emloyeeIdLogin);
        historyDto.setUpdatedUser(emloyeeIdLogin);
        customersHistoriesService.save(historyDto);

        // 12. Call API createTimelineAuto
        callAPIcreateTimelineAuto(customerIdUpdated, cloneDto, savedDto, ConstantsCustomers.MODE_EDIT_TIMELINE_AUTO);
        // 13. Call API updateCompany
        List<UpdateCompanyInDTO> customerNameList = new ArrayList<>();
        UpdateCompanyInDTO updateCompanyDto = new UpdateCompanyInDTO();
        updateCompanyDto.setCustomerId(customerIdUpdated);
        updateCompanyDto.setCustomerName(savedDto.getCustomerName());
        customerNameList.add(updateCompanyDto);
        channelUtils.updateCompany(customerNameList);
        // 14. Call API createNotification
        createNotificationForCustomer(emloyeeIdLogin, customerIdUpdated, savedDto.getCustomerName(), 1);

        // 10 Create request create data on ElasticSearch
        List<Long> customerIdsSync = new ArrayList<>();
        customerIdsSync.add(savedDto.getCustomerId());
        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null, customerIdsSync,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return savedDto.getCustomerId();
    }

    /**
     * Call API createTimelineAuto
     *
     * @param customerId
     *            id customer
     * @param oldDto
     *            old customer
     * @param newDto
     *            new customer
     * @param mode
     *            0: create <br>
     *            1: update
     */
    private void callAPIcreateTimelineAuto(Long customerId, CustomersDTO oldDto, CustomersDTO newDto,
            int mode) {
        // call API getEmployeeByIds
        Set<Long> employeeIdManagerSet = new HashSet<>();
        Set<Long> departmentIdSet = new HashSet<>();
        List<EmployeeInfoDTO> employeeInfo = channelUtils
                .getEmployeesByIds(Collections.singletonList(newDto.getCreatedUser()));
        employeeInfo.forEach(emp -> {
            employeeIdManagerSet.addAll(emp.getEmployeeDepartments().stream()
                    .map(DepartmentPositionDTO::getManagerId)
                    .collect(Collectors.toSet()));
            departmentIdSet.addAll(emp.getEmployeeDepartments().stream().map(DepartmentPositionDTO::getDepartmentId)
                    .collect(Collectors.toSet()));
        });
        CreateTimelineAutoRequest createTimelineAutoreq = new CreateTimelineAutoRequest();
        createTimelineAutoreq.setCreatePosition(TimelineAuto.CUSTOMER.getCreatePosition());
        TimelineInfoDTO timelineInfoDTO = new TimelineInfoDTO();
        timelineInfoDTO.setObjectId(customerId);
        TimelineHeaderDTO headerDTO = new TimelineHeaderDTO();
        headerDTO.setJaJp(newDto.getCustomerName());
        headerDTO.setEnUs(newDto.getCustomerName());
        headerDTO.setZhCn(newDto.getCustomerName());
        String contentChange = CustomersCommonUtil.getContentChange(oldDto, newDto).toString();
        timelineInfoDTO.setContentChange(contentChange);
        timelineInfoDTO.setMode(mode);
        timelineInfoDTO.setReceivers(getReceiversTimelines(employeeIdManagerSet, departmentIdSet));
        createTimelineAutoreq.setTimelineInfos(Collections.singletonList(timelineInfoDTO));
        channelUtils.createTimelineAuto(createTimelineAutoreq);
    }

    /**
     * get Json for comlumn employee_data for update
     *
     * @param listEmployeeData
     * @param contentChange
     * @param contentChange
     * @param fieldsList
     * @return String
     * @throws JsonProcessingException
     */
    private String getJsonCustomerDataUpdate(CustomersDTO cusDto,
            List<CustomerDataTypeDTO> listEmployeeData,
            List<CustomFieldsInfoOutDTO> fieldsList, Map<String, List<FileInfosDTO>> uploadData, String formatDate)
            throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {
        };
        Map<String, Object> cusData = new HashMap<>();
        if (StringUtils.isNotBlank(cusDto.getCustomerData())) {
            try {
                cusData = mapper.readValue(cusDto.getCustomerData(), typeRef);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        }

        String rtn;
        try {
            if (fieldsList != null && !fieldsList.isEmpty() && listEmployeeData != null
                    && !listEmployeeData.isEmpty()) {
                processJsonCustomerDataUpdate(fieldsList, listEmployeeData, uploadData, mapper, cusData, formatDate);
            }
            rtn = objectMapper.writeValueAsString(cusData);
        } catch (JsonProcessingException e) {
            throw new CustomException(CONVERT_DATA_ERROR, e);
        }
        return rtn;
    }

    /**
     * process json customerDataUpdate
     * 
     * @param fieldsList
     * @param listEmployeeData
     * @throws JsonProcessingException
     */
    private void processJsonCustomerDataUpdate(List<CustomFieldsInfoOutDTO> fieldsList,
            List<CustomerDataTypeDTO> listEmployeeData, Map<String, List<FileInfosDTO>> uploadData, ObjectMapper mapper,
            Map<String, Object> cusData, String formatDate) throws JsonProcessingException {
        for (CustomerDataTypeDTO data : listEmployeeData) {
            for (CustomFieldsInfoOutDTO fields : fieldsList) {
                if ((fields.getIsDefault() == null || !fields.getIsDefault().booleanValue())
                        && fields.getModifyFlag() > 0 && fields.getFieldName().equals(data.getKey())) {
                    data.setFieldType(StringUtil.toString(fields.getFieldType()));

                    List<FileInfosDTO> listFiles = new ArrayList<>();
                    if (FieldTypeEnum.FILE.getCode().equals(String.valueOf(fields.getFieldType()))) {
                        getCustomerFileUpdateData(uploadData, mapper, data, listFiles);
                    }
                    getDataFromCustomerDataUpdate(cusData, data, listFiles, formatDate);
                    break;
                }
            }
        }
    }

    /**
     * update data for Map<String, Object> empData
     *
     * @throws JsonProcessingException
     */
    private void getDataFromCustomerDataUpdate(Map<String, Object> cusData, CustomerDataTypeDTO data,
            List<FileInfosDTO> listFiles, String formatDate) throws JsonProcessingException {
        if (FieldTypeEnum.FILE.getCode().equals(data.getFieldType())) {
            if (listFiles != null) {
                List<BaseFileInfosDTO> listSaveDb = new ArrayList<>();
                listFiles.forEach(file -> {
                    BaseFileInfosDTO fileSaveDb = new BaseFileInfosDTO();
                    fileSaveDb.setFileName(file.getFileName());
                    fileSaveDb.setFilePath(file.getFilePath());
                    listSaveDb.add(fileSaveDb);
                });
                cusData.put(data.getKey(), objectMapper.writeValueAsString(listSaveDb));
            } else {
                cusData.put(data.getKey(), STRING_ARRAY_EMPTY);
            }
        } else if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(data.getFieldType())
                || FieldTypeEnum.CHECKBOX.getCode().equals(data.getFieldType())
                || FieldTypeEnum.RELATION.getCode().equals(data.getFieldType())) {
            List<Long> fValue = null;
            try {
                TypeReference<ArrayList<Long>> typeRef = new TypeReference<ArrayList<Long>>() {
                };
                fValue = objectMapper.readValue(data.getValue(), typeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            cusData.put(data.getKey(), fValue);
        } else if (FieldTypeEnum.PULLDOWN.getCode().equals(data.getFieldType())
                || FieldTypeEnum.RADIO.getCode().equals(data.getFieldType())
                || FieldTypeEnum.NUMBER.getCode().equals(data.getFieldType())) {
            if (StringUtils.isBlank(data.getValue())) {
                if (cusData.containsKey(data.getKey())) {
                    cusData.remove(data.getKey());
                }
            } else {
                if (CheckUtil.isNumeric(data.getValue())) {
                    cusData.put(data.getKey(), Long.valueOf(data.getValue()));
                } else {
                    cusData.put(data.getKey(), Double.valueOf(data.getValue()));
                }
            }
        } else if (FieldTypeEnum.DATE.getCode().equals(data.getFieldType())) {
            getSystemDate(cusData, formatDate, data.getValue(), data.getKey(), null);
        } else if (FieldTypeEnum.TIME.getCode().equals(data.getFieldType())) {
            getSystemTime(cusData, DateUtil.FORMAT_HOUR_MINUTE, data.getValue(), data.getKey());
        } else if (FieldTypeEnum.DATETIME.getCode().equals(data.getFieldType())) {
            String date = StringUtils.isNotBlank(data.getValue()) ? data.getValue().substring(0, formatDate.length())
                    : "";
            String hour = StringUtils.isNotBlank(data.getValue()) ? data.getValue().substring(formatDate.length()) : "";
            getSystemDate(cusData, formatDate, date, data.getKey(), hour);
        } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(data.getFieldType())) {
            List<Object> fValue = null;
            try {
                TypeReference<ArrayList<Object>> typeRef = new TypeReference<ArrayList<Object>>() {
                };
                fValue = objectMapper.readValue(data.getValue(), typeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            cusData.put(data.getKey(), fValue);
        } else if (FieldTypeEnum.LINK.getCode().equals(data.getFieldType())) {
            Map<String, String> fValue = new HashMap<>();
            try {
                TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {
                };
                fValue = objectMapper.readValue(data.getValue(), typeRef);
                cusData.put(data.getKey(), fValue);
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        } else {
            cusData.put(data.getKey(), data.getValue());
        }
    }

    /**
     * get data for updated file of employee
     *
     * @param uploadData
     *            List of dto contain file data
     * @param mapper
     *            object mapper
     * @param data
     *            object contain employee data
     * @param listFiles
     *            list of new uploaded files of employees
     */
    private void getCustomerFileUpdateData(Map<String, List<FileInfosDTO>> uploadData, ObjectMapper mapper,
            CustomerDataTypeDTO data, List<FileInfosDTO> listFiles) {
        S3FileUtil.processUpdateFileInfo(data, listFiles, mapper, applicationProperties.getUploadBucket());

        List<FileInfosDTO> listFileUpload = null;
        if (uploadData != null) {
            listFileUpload = uploadData.get(data.getKey());
        }
        if (listFileUpload != null) {
            listFiles.addAll(listFileUpload);
        }
    }

    /**
     * Validate for API updateCustomer
     *
     * @param inputData
     *            - input data for main table
     * @param formatDate
     *            formatDate
     */
    private void validateUpdateCustomer(CustomersInputDTO inputData, String formatDate) {
        List<Map<String, Object>> listValidate = new ArrayList<>();
        if (inputData == null) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError("inputData", Constants.RIQUIRED_CODE));
        }
        Long customerId = inputData.getCustomerId();
        if (inputData.getCustomerId() == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2 Validate parent relation
        if (inputData.getParentId() != null && inputData.getParentId().longValue() > 0l) {
            if (!isSameParentId(customerId, inputData.getParentId())) {
                Long countRelParentId = customersRepository.countCustomerExistedWithParentId(inputData.getParentId(),
                        customerId);
                if (ConstantsCustomers.NUMBER_CHECK_PARENT_ID.equals(countRelParentId)) {
                    listValidate.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_PARENT,
                            ConstantsCustomers.CUSTOMER_PARENT_INVAIL));
                }
            } else {
                listValidate.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_PARENT,
                        ConstantsCustomers.CUSTOMER_PARENT_INVAIL));
            }
        }
        // build map parameters
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        String validateJson = jsonBuilder.build(FieldBelongEnum.CUSTOMER.getCode(), (Map<String, Object>) null,
                buildParamsValidateCustomersInput(inputData, jsonBuilder), formatDate);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        listValidate.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!listValidate.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, listValidate);
        }
    }

    /**
     * Build customParam from customerInput
     *
     * @param customerInput
     *            - object contains data to get field
     * @param jsonBuilder
     *            - object build
     * @return list key-value exclusive
     */
    private Map<String, Object> buildParamsValidateCustomersInput(CustomersInputDTO customerInput,
            CommonValidateJsonBuilder jsonBuilder) {
        List<String> listIncludeField = new ArrayList<>();
        listIncludeField.add(ConstantsCustomers.FIELD_CUSTOMER_NAME);
        listIncludeField.add(ConstantsCustomers.FIELD_CUSTOMER_ALIAS_NAME);
        listIncludeField.add(ConstantsCustomers.FIELD_PHONE_NUMBER);
        listIncludeField.add(ConstantsCustomers.FIELD_ZIPCODE);
        listIncludeField.add(ConstantsCustomers.FIELD_ADDRESS);
        listIncludeField.add(ConstantsCustomers.FIELD_BUILDING);
        listIncludeField.add(ConstantsCustomers.FIELD_URL);
        listIncludeField.add(ConstantsCustomers.FIELD_PHOTO_FILE_NAME);
        listIncludeField.add(ConstantsCustomers.FIELD_PHOTO_FILE_PATH);
        listIncludeField.add(ConstantsCustomers.FIELD_MEMO);
        Map<String, Object> customParam = new HashMap<>();
        customParam.putAll(jsonBuilder.convertObjectIncludeFields(customerInput, listIncludeField));
        if (customerInput.getCustomerData() != null) {
            customParam.putAll(jsonBuilder.convertKeyValueList(customerInput.getCustomerData()));
        }
        return customParam;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#updateCustomers(java.util.List)
     */
    @Override
    @Transactional
    public List<Long> updateCustomers(List<CustomersInputDTO> customers, List<FileMappingDTO> filesMap)
            throws IOException {
        // get-date format
        String formatDate = getFormatDate();
        // 1 validate parameters
        validateUpdateCustomers(customers, formatDate);
        // get session info
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        Map<Long, String> contentChangeMapping = new HashMap<>();
        Map<Long, String> customerNameMap = new HashMap<>();
        Set<Long> createdUserSet = new HashSet<>();

        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(userId, filesMap, tenantName,
                applicationProperties.getUploadBucket(), FieldBelongEnum.CUSTOMER);

        List<CustomersDTO> customerSaveList = new ArrayList<>();
        List<CustomersHistoriesDTO> customerHistoryList = new ArrayList<>();

        // call API getCustomerFieldInfo
        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, request, CommonFieldInfoResponse.class,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());

        customers.forEach(cus -> {
            // exclusive check
            CustomersDTO existedDto = customersService.findOne(cus.getCustomerId()).orElse(null);
            if (existedDto == null) {
                Map<String, Object> mapError = new HashMap<>();
                mapError.put(Constants.ERROR_ITEM, ConstantsCustomers.CUSTOMER_ID);
                mapError.put(Constants.ERROR_CODE, Constants.EXCLUSIVE_CODE);
                mapError.put(Constants.ROW_ID, cus.getCustomerId());
                throw new CustomRestException(ConstantsCustomers.DATA_HAS_BEEN_CHANGED, mapError);
            }

            // save data before update
            CustomersDTO oldDto = customersMapper.clone(existedDto);
            Long customerIdUpdated = cus.getCustomerId();

            // upload file
            existedDto = getCustomerLogoFromDataInput(existedDto, uploadData, customerIdUpdated, cus);
            // build customerData
            try {
                existedDto.setCustomerData(getJsonCustomerDataUpdate(oldDto, cus.getCustomerData(),
                        fieldInfoResponse.getCustomFieldsInfo(), uploadData.get(oldDto.getCustomerId()), formatDate));
            } catch (JsonProcessingException e) {
                log.error(e.getLocalizedMessage());
            }

            // get basic data
            getDataFromInputToDTO(cus, existedDto);

            // build personIncharge
            if (cus.getPersonInCharge() != null) {
                buildPersonInChargeForCustomer(cus.getPersonInCharge().getEmployeeId(),
                        cus.getPersonInCharge().getDepartmentId(), cus.getPersonInCharge().getGroupId(), existedDto);
            }

            if (ConstantsCustomers.LONG_VALUE_0L.equals(cus.getParentId())) {
                existedDto.setParentId(null);
            }

            // update customer info
            CustomersDTO dtoSave = buildDTOToUpdate(existedDto, cus);
            dtoSave.setUpdatedUser(userId);
            // add to list save all
            customerSaveList.add(dtoSave);

            String contentChange = CustomersCommonUtil.getContentChanges(oldDto, existedDto, true).toString();

            // update data customer_history
            CustomersHistoriesDTO historyDto = customersHistoriesMapper.toCustomersHistoriesDTO(existedDto);
            historyDto.setContentChange(contentChange);
            historyDto.setCreatedUser(userId);
            historyDto.setUpdatedUser(userId);
            customerHistoryList.add(historyDto);

            // 3.2 Create timeline
            contentChangeMapping.put(customerIdUpdated,
                    CustomersCommonUtil.getContentChange(oldDto, existedDto).toString());

            // createCustomerNameMap
            customerNameMap.put(customerIdUpdated, existedDto.getCustomerName());

            // list created user
            createdUserSet.add(oldDto.getCreatedUser());
        });
        // saveAllCustomer
        customersService.saveAll(customerSaveList);
        customersHistoriesService.saveAll(customerHistoryList);

        // processing data for customerNameMap
        List<CreateNotificationInSubType6DTO> cusCreateNotifiList = new ArrayList<>();
        List<UpdateCompanyInDTO> cusUpdateNameList = new ArrayList<>();
        List<Long> customerIdUpdatedList = new ArrayList<>();
        customerNameMap.forEach((customerId, customerName) -> {
            cusCreateNotifiList.add(getCreateNotificationSubDTO(customerId, customerName));
            cusUpdateNameList.add(getUpdateCompanyInDTO(customerId, customerName));
            customerIdUpdatedList.add(customerId);
        });
        // 3.3 CAll API createNotification
        CreateNotificationRequest notificationReq = new CreateNotificationRequest();
        notificationReq.setDataNotification(new CreateNotificationInSubType1DTO(userId, 4, 1));
        notificationReq.setCustomer(cusCreateNotifiList);
        channelUtils.createNotification(notificationReq);

        // 6. call API createTimeLineAuto
        CreateTimelineAutoRequest createTimelineAutoreq = new CreateTimelineAutoRequest();
        createTimelineAutoreq.setCreatePosition(TimelineAuto.CUSTOMER.getCreatePosition());
        List<TimelineInfoDTO> timelineInfoDTO = getTimelineInfo(contentChangeMapping, customerNameMap,
                createdUserSet);

        createTimelineAutoreq.setTimelineInfos(timelineInfoDTO);
        channelUtils.createTimelineAuto(createTimelineAutoreq);
        // 7. Call API updateCompany
        channelUtils.updateCompany(cusUpdateNameList);
        // 8 Create Data change for service Task
        channelUtils.createDataChangeForServiceTask(customerIdUpdatedList);

        // 5 Create request update data on ElasticSearch
        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null,
                customerIdUpdatedList,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        // 9.Create response
        return customerIdUpdatedList;
    }

    /**
     * Get customer logo from data input
     * 
     * @param customerDest
     *            existedDto
     * @param uploadData
     *            uploadData
     * @param customerIdUpdated
     *            customerIdUpdated
     * @param customerInput
     * @return
     */
    private CustomersDTO getCustomerLogoFromDataInput(CustomersDTO customerDest,
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData, Long customerIdUpdated,
            CustomersInputDTO customerInput) {
        Map<String, List<FileInfosDTO>> customersFilesMap = null;
        if (!CollectionUtils.isEmpty(uploadData) && uploadData.get(customerIdUpdated) != null) {
            customersFilesMap = uploadData.get(customerIdUpdated);
        }
        // get data photo file
        FileInfosDTO iconFile = processCustomerLogo(customersFilesMap, customerInput.getCustomerLogo());
        if (iconFile != null) {
            customerDest.setPhotoFileName(iconFile.getFileName());
            customerDest.setPhotoFilePath(iconFile.getFilePath());
        } else {
            customerDest.setPhotoFileName("");
            customerDest.setPhotoFilePath("");
        }
        return customerDest;
    }

    /**
     * Get tagetDeliversList for API createTimelineAuto
     * 
     * @param contentChangeMapping
     *            contenChange
     * @param customerNameMap
     * @param createdUserSet
     * @return list TimelineInfoDTO
     */
    private List<TimelineInfoDTO> getTimelineInfo(Map<Long, String> contentChangeMapping,
            Map<Long, String> customerNameMap, Set<Long> createdUserSet) {
        // call API getEmployeeByIds
        Set<Long> employeeIdManagerSet = new HashSet<>();
        Set<Long> departmentIdSet = new HashSet<>();
        if (!CollectionUtils.isEmpty(createdUserSet)) {
            List<EmployeeInfoDTO> employeeInfo = channelUtils.getEmployeesByIds(new ArrayList<>(createdUserSet));
            employeeInfo.forEach(emp -> {
                employeeIdManagerSet.addAll(emp.getEmployeeDepartments().stream()
                        .map(DepartmentPositionDTO::getManagerId).collect(Collectors.toSet()));
                departmentIdSet.addAll(emp.getEmployeeDepartments().stream().map(DepartmentPositionDTO::getDepartmentId)
                        .collect(Collectors.toSet()));
            });
        }
        
        List<TimelineInfoDTO> timelineInfoList = new ArrayList<>();
        contentChangeMapping.forEach((key, value) -> {
            TimelineInfoDTO timelineInfoDTO = new TimelineInfoDTO();
            timelineInfoDTO.setObjectId(key);
            // header
            TimelineHeaderDTO headerDTO = new TimelineHeaderDTO();
            String customerName = customerNameMap.get(key);
            headerDTO.setJaJp(customerName);
            headerDTO.setEnUs(customerName);
            headerDTO.setZhCn(customerName);

            timelineInfoDTO.setContentChange(value);
            timelineInfoDTO.setMode(ConstantsCustomers.MODE_EDIT_TIMELINE_AUTO);
            // receivers
            timelineInfoDTO.setReceivers(getReceiversTimelines(employeeIdManagerSet, departmentIdSet));
            timelineInfoList.add(timelineInfoDTO);
        });
        return timelineInfoList;
    }

    /**
     * get ReceiversTimelines
     * 
     * @param employeeIdManagerSet
     *            employeeIdManagerSet
     * @param departmentIdSet
     *            departmentIdSet
     * @return list receiverList
     */
    private List<TimelineReceiverDTO> getReceiversTimelines(Set<Long> employeeIdManagerSet, Set<Long> departmentIdSet) {
        List<TimelineReceiverDTO> receiverList = new ArrayList<>();
        Instant displayDate = Instant.now();
        // employee
        if (CollectionUtils.isEmpty(employeeIdManagerSet)) {
            TimelineReceiverDTO employeeReceiver = new TimelineReceiverDTO();
            employeeReceiver.setTargetType(TimelineAuto.EMPLOYEE.getTargetType());
            employeeReceiver.setTargetIds(new ArrayList<>(employeeIdManagerSet));
            employeeReceiver.setDisplayedDate(displayDate);
            receiverList.add(employeeReceiver);
        }
        // department
        if (CollectionUtils.isEmpty(departmentIdSet)) {
            TimelineReceiverDTO departmentReceiver = new TimelineReceiverDTO();
            departmentReceiver.setTargetType(TimelineAuto.DEPARTMENT.getTargetType());
            departmentReceiver.setTargetIds(new ArrayList<>(departmentIdSet));
            departmentReceiver.setDisplayedDate(displayDate);
            receiverList.add(departmentReceiver);
        }
        return receiverList;
    }

    /**
     * Get DTO for API updateCompany
     * 
     * @param customerId
     *            id
     * @param customerName
     *            name
     * @return update DTO
     */
    private UpdateCompanyInDTO getUpdateCompanyInDTO(Long customerId, String customerName) {
        UpdateCompanyInDTO updateCompanyDto = new UpdateCompanyInDTO();
        updateCompanyDto.setCustomerId(customerId);
        updateCompanyDto.setCustomerName(customerName);
        return updateCompanyDto;
    }

    /**
     * Get CreateNotidficationList for CreateNotificationRequest
     * 
     * @param customerId
     *            customerId
     * @param customerName
     *            customerName
     * @return DTO for List
     */
    private CreateNotificationInSubType6DTO getCreateNotificationSubDTO(Long customerId, String customerName) {
        ReceiverDTO receiverDTO = new ReceiverDTO();
        receiverDTO.setReceiverName(jwtTokenUtil.getEmployeeNameFromToken());
        List<ReceiverDTO> receiverList = new ArrayList<>();
        receiverList.add(receiverDTO);
        CreateNotificationInSubType6DTO customerDTO = new CreateNotificationInSubType6DTO();
        customerDTO.setCustomerId(customerId);
        customerDTO.setReceivers(receiverList);
        customerDTO.setCustomerName(customerName);
        customerDTO.setCustomerMode(1);
        return customerDTO;
    }

    /**
     * validate parameters for API updateCustomers
     *
     * @param customers
     *        - list input data for validate
     */
    private void validateUpdateCustomers(List<CustomersInputDTO> customers, String formatDate) {
        // inner validate
        if (customers == null || customers.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMERS, Constants.RIQUIRED_CODE));
        }
        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        List<Map<String, Object>> customParams = new ArrayList<>();
        customers.forEach(cus -> {
            Map<String, Object> customField = new HashMap<>();
            customField.put("rowId", cus.getCustomerId());
            customField.putAll(buildParamsValidateCustomersInput(cus, jsonBuilder));
            customParams.add(customField);
        });
        String validateJson = jsonBuilder.build(FieldBelongEnum.CUSTOMER.getCode(), (Map<String, Object>) null,
                customParams, formatDate);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> listValidate = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils,
                token, tenantName);
        if (!listValidate.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, listValidate);
        }
    }

    /**
     * Check same parent id customer
     *
     * @param parentIdOld
     *            id before update
     * @param parentIdParam
     *            name after update
     * @return true if same , false if not same
     */
    public boolean isSameParentId(Long parentIdOld, Long parentIdParam) {
        boolean result = false;
        if ((parentIdOld == null && parentIdParam == null)
                || (parentIdOld != null && parentIdOld.equals(parentIdParam))) {
            result = true;
        }
        return result;
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData
     *            dynamic data before update
     * @param newDynamicDataString
     *            dynamic data after update
     * @param fields
     *            field info of service
     * @param recordId
     *            id of record which is getting updated
     */
    public <T extends KeyValue> void updateRelationData(String oldDynamicDataString, List<T> newDynamicDataKeyVal,
            List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> oldEmployeeData = new HashMap<>();
        if (StringUtils.isNotBlank(oldDynamicDataString)) {
            TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {
            };
            try {
                oldEmployeeData = mapper.readValue(oldDynamicDataString, typeRef);
            } catch (IOException e) {
                return;
            }
        }
        updateRelationData(oldEmployeeData, newDynamicDataKeyVal, fields, recordId);
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData
     *            dynamic data before update
     * @param newDynamicDataString
     *            dynamic data after update
     * @param fields
     *            field info of service
     * @param recordId
     *            id of record which is getting updated
     */
    public <T extends KeyValue> void updateRelationData(Map<String, Object> oldDynamicData,
            List<T> newDynamicDataKeyVal, List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        Map<String, Object> newEmployeeData = new HashMap<>();
        if (newDynamicDataKeyVal != null && !newDynamicDataKeyVal.isEmpty()) {
            newEmployeeData = newDynamicDataKeyVal.stream()
                    .collect(Collectors.toMap(KeyValue::getKey, KeyValue::getValue));
        }
        updateRelationData(oldDynamicData, newEmployeeData, fields, recordId);
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData
     *            dynamic data before update
     * @param newDynamicDataString
     *            dynamic data after update
     * @param fields
     *            field info of service
     * @param recordId
     *            id of record which is getting updated
     */
    public void updateRelationData(Map<String, Object> oldDynamicData, Map<String, Object> newDynamicData,
            List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        if (oldDynamicData == null) {
            oldDynamicData = new HashMap<>();
        }
        if (newDynamicData == null) {
            newDynamicData = new HashMap<>();
        }
        ObjectMapper mapper = new ObjectMapper();
        Map<Integer, UpdateRelationDataRequest> requestsMap = new HashMap<>();
        List<String> processedField = new ArrayList<>();
        Map<String, CustomFieldsInfoOutDTO> fieldsmap = fields.stream()
                .collect(Collectors.toMap(CustomFieldsInfoOutDTO::getFieldName, f -> f));
        TypeReference<ArrayList<Long>> listTypeReference = new TypeReference<ArrayList<Long>>() {
        };
        for (Map.Entry<String, Object> newData : newDynamicData.entrySet()) {
            CustomFieldsInfoOutDTO fieldInfo = fieldsmap.get(newData.getKey());
            if (fieldInfo == null || !fieldInfo.getFieldName().startsWith(FieldTypeEnum.RELATION.getName())
                    || (fieldInfo.getRelationData().getAsSelf() != null
                            && fieldInfo.getRelationData().getAsSelf() == 1)) {
                continue;
            }
            processedField.add(fieldInfo.getFieldName());
            List<Long> newIdsList = new ArrayList<>();
            List<Long> oldIdsList = new ArrayList<>();
            List<Long> newRecordIds = new ArrayList<>();
            List<Long> oldRecordIds = new ArrayList<>();
            String newValStr = StringUtil.safeCastToString(newData.getValue());
            if (StringUtils.isNotBlank(newValStr)) {
                try {
                    newIdsList = mapper.readValue(newValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            String oldValStr = StringUtil.safeCastToString(oldDynamicData.get(newData.getKey()));
            if (StringUtils.isNotBlank(oldValStr)) {
                try {
                    oldIdsList = mapper.readValue(oldValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            for (int i = 0; i < newIdsList.size(); i++) {
                if (!oldIdsList.contains(newIdsList.get(i))) {
                    newRecordIds.add(newIdsList.get(i));
                }
            }
            for (int i = 0; i < oldIdsList.size(); i++) {
                if (!newIdsList.contains(oldIdsList.get(i))) {
                    oldRecordIds.add(oldIdsList.get(i));
                }
            }
            if (!newRecordIds.isEmpty() || !oldRecordIds.isEmpty()) {
                RelationDataInfosInDTO relationDataInfos = new RelationDataInfosInDTO();
                relationDataInfos.setFieldId(fieldInfo.getRelationData().getFieldId());
                relationDataInfos.setNewRecordIds(newRecordIds);
                relationDataInfos.setOldRecordIds(oldRecordIds);
                UpdateRelationDataRequest requestBuilder = requestsMap
                        .get(fieldInfo.getRelationData().getFieldBelong());
                if (requestBuilder == null) {
                    requestBuilder = new UpdateRelationDataRequest();
                    requestBuilder.setRecordId(recordId);
                    requestsMap.put(fieldInfo.getRelationData().getFieldBelong(), requestBuilder);
                }
                requestBuilder.getRelationDataInfos().add(relationDataInfos);
            }
        }

        for (Map.Entry<String, Object> oldData : oldDynamicData.entrySet()) {
            CustomFieldsInfoOutDTO fieldInfo = fieldsmap.get(oldData.getKey());
            if (fieldInfo == null || processedField.contains(oldData.getKey())
                    || !fieldInfo.getFieldName().startsWith(FieldTypeEnum.RELATION.getName())
                    || (fieldInfo.getRelationData().getAsSelf() != null
                            && fieldInfo.getRelationData().getAsSelf() == 1)) {
                continue;
            }
            List<Long> oldRecordIds = new ArrayList<>();
            String oldValStr = StringUtil.safeCastToString(oldData.getValue());
            if (StringUtils.isNotBlank(oldValStr)) {
                try {
                    oldRecordIds = mapper.readValue(oldValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            if (oldRecordIds != null && !oldRecordIds.isEmpty()) {
                RelationDataInfosInDTO relationDataInfos = new RelationDataInfosInDTO();
                relationDataInfos.setFieldId(fieldInfo.getRelationData().getFieldId());
                relationDataInfos.setOldRecordIds(oldRecordIds);
                UpdateRelationDataRequest requestBuilder = requestsMap
                        .get(fieldInfo.getRelationData().getFieldBelong());
                if (requestBuilder == null) {
                    requestBuilder = new UpdateRelationDataRequest();
                    requestBuilder.setRecordId(recordId);
                    requestsMap.put(fieldInfo.getRelationData().getFieldBelong(), requestBuilder);
                }
                requestBuilder.getRelationDataInfos().add(relationDataInfos);
            }
        }

        for (Map.Entry<Integer, UpdateRelationDataRequest> request : requestsMap.entrySet()) {
            if (FieldBelongEnum.CUSTOMER.getCode().equals(request.getKey())) {
                this.updateRelationData(request.getValue().getRecordId(), request.getValue().getRelationDataInfos());
            } else {
                UpdateRelationDataResponse relationRes = RelationUtil.callUpdateRelationData(restOperationUtils,
                        request.getValue(), request.getKey(), SecurityUtils.getTokenValue().orElse(null),
                        jwtTokenUtil.getTenantIdFromToken());
                if (relationRes != null && relationRes.getErrorAttributes() != null
                        && !relationRes.getErrorAttributes().isEmpty()) {
                    CustomRestException ex = new CustomRestException();
                    ex.setExtensions(relationRes.getErrorAttributes());
                    throw ex;
                }
            }
        }
    }

    /**
     * build personIncharge for customer
     *
     * @param employeeId - employeeId value
     * @param departmentId - departmentId value
     * @param groupId - groupId value
     * @param dto - dto to set data
     */
    private void buildPersonInChargeForCustomer(Long employeeId, Long departmentId, Long groupId, CustomersDTO dto) {
        if (employeeId != null) {
            dto.setEmployeeId(employeeId);
        }
        if (departmentId != null) {
            dto.setDepartmentId(departmentId);
        }
        if (groupId != null) {
            dto.setGroupId(groupId);
        }

    }

    /**
     * @see jp.co.softbrain.esales.products.service.CustomersService#
     *      updateRelationData(java.lang.Long, java.util.List)
     */
    @Override
    @Transactional
    public List<Long> updateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos) {
        List<Long> updateRecordIds = new ArrayList<>();
        // 1.Validate parameter
        validateUpdateRelationData(recordId, relationDataInfos);

        // 2. Get the Relation item information
        List<Long> fieldIds = new ArrayList<>();
        relationDataInfos.forEach(relationDataInfo -> fieldIds.add(relationDataInfo.getFieldId()));
        final List<CustomFieldsInfoOutDTO> fieldsList = getCustomFieldsInfoByFieldIds(fieldIds);

        // 3. Repeating in array [relationDataInfos]
        relationDataInfos.forEach(relationDataInfo -> {
            List<CustomersDTO> lstOldDataDelete = new ArrayList<>();
            List<CustomersDTO> lstNewDataDelete = new ArrayList<>();
            List<CustomersDTO> lstOldDataAdd = new ArrayList<>();
            List<CustomersDTO> lstNewDataAdd = new ArrayList<>();

            CustomFieldsInfoOutDTO field = getFieldFromList(relationDataInfo.getFieldId(), fieldsList);
            if (field == null) {
                return;
            }

            // 4. Delete previous relation
            relationDataInfo.getOldRecordIds().forEach(oldRecordId -> deleteOrAddRelation(oldRecordId,
                    field.getFieldName(), recordId, true, updateRecordIds, lstOldDataDelete, lstNewDataDelete));

            // In case of a single relation (relationData.format = 1), step 5
            if (field.getRelationData() != null
                    && ConstantsCustomers.RELATION_FORMAT_SINGLE.equals(field.getRelationData().getFormat())) {
                // 5. Check the Relation value
                List<Long> productIdsRealtion = customersRepositoryCustom
                        .getCustomerIdsCreatedRelation(Arrays.asList(field), relationDataInfo.getNewRecordIds());
                if (productIdsRealtion != null && !productIdsRealtion.isEmpty()) {
                    throw new CustomRestException(CommonUtils.putError(String.valueOf(field.getFieldId()),
                            ConstantsCustomers.ERR_RELATION_DATA));
                }
            }

            // 6. Add more data relations to the record
            relationDataInfo.getNewRecordIds().forEach(newRecordId -> deleteOrAddRelation(newRecordId,
                    field.getFieldName(), recordId, false, updateRecordIds, lstOldDataAdd, lstNewDataAdd));

            // Insert history
            insertHistoryRelation(lstOldDataDelete, lstNewDataDelete, lstOldDataAdd, lstNewDataAdd);
        });
        return updateRecordIds;
    }

    /**
     * Insert history for relation
     *
     * @param lstOldDataDelete
     * @param lstNewDataDelete
     * @param lstOldDataAdd
     * @param lstNewDataAdd
     */
    private void insertHistoryRelation(List<CustomersDTO> lstOldDataDelete, List<CustomersDTO> lstNewDataDelete,
            List<CustomersDTO> lstOldDataAdd, List<CustomersDTO> lstNewDataAdd) {
        // List customer delete and add relations
        lstOldDataDelete.forEach(oldData -> lstNewDataAdd.forEach(newData -> {
            if (oldData.getEmployeeId() != 0 && newData.getEmployeeId() != 0
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                insertCustomerHistoryRelation(oldData, newData);
            }
        }));

        // List customer delete relation
        lstOldDataDelete.forEach(oldData -> lstNewDataDelete.forEach(newData -> {
            if (oldData.getEmployeeId() != 0L && newData.getEmployeeId() != 0L
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                insertCustomerHistoryRelation(oldData, newData);
            }
        }));

        // List customer add relation
        lstOldDataAdd.forEach(oldData -> lstNewDataAdd.forEach(newData -> {
            if (oldData.getEmployeeId() != 0L && newData.getEmployeeId() != 0L
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                insertCustomerHistoryRelation(oldData, newData);
            }
        }));
    }

    /**
     * Insert history customer
     *
     * @param oldData
     * @param newData
     */
    private void insertCustomerHistoryRelation(CustomersDTO oldData, CustomersDTO newData) {
        JSONObject contentChange = CustomersCommonUtil.getContentChange(oldData, newData);
        CustomersHistoriesDTO customersHistories = customersHistoriesMapper.toCustomersHistoriesDTO(newData);
        customersHistories.setCustomerId(newData.getCustomerId());
        customersHistories.setContentChange(contentChange.toString());
        // 6. Insert history customer after
        customersHistoriesService.save(customersHistories);
    }

    /**
     * Get field from list Field
     *
     * @param fieldId
     * @param fieldsList
     * @return
     */
    private CustomFieldsInfoOutDTO getFieldFromList(Long fieldId, List<CustomFieldsInfoOutDTO> fieldsList) {
        for (CustomFieldsInfoOutDTO fields : fieldsList) {
            if (fields.getFieldId().equals(fieldId)) {
                return fields;
            }
        }
        return null;
    }

    /**
     * delete relation
     *
     * @param customerId
     * @param fieldName
     * @param recordId
     * @return
     */
    @SuppressWarnings("unchecked")
    private CustomersDTO deleteOrAddRelation(Long customerId, String fieldName, Long recordId, boolean isDelete,
            List<Long> updateRecordIds, List<CustomersDTO> lstOldData, List<CustomersDTO> lstNewData) {
        Optional<CustomersDTO> customersDto = customersService.findOne(customerId);
        if (!customersDto.isPresent()) {
            return null;
        }
        CustomersDTO customersDTOUpdate = customersDto.get();
        lstOldData.add(customersMapper.clone(customersDTOUpdate));

        String productData = customersDTOUpdate.getCustomerData();
        Map<String, Object> productDataMap = new HashMap<>();
        try {
            TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {
            };
            productDataMap = objectMapper.readValue(productData, mapTypeRef);
        } catch (IOException e) {
            return null;
        }

        Object relationObject = productDataMap.get(fieldName);
        List<Double> relationData;

        if (relationObject == null || StringUtil.isEmpty(relationObject.toString())) {
            relationData = new ArrayList<>();
        } else {
            relationData = gson.fromJson(relationObject.toString(), List.class);
        }
        List<Long> relationDataNew = new ArrayList<>();
        // Delete relation
        if (isDelete) {
            for (int i = 0; i < relationData.size(); i++) {
                if (relationData.get(i).longValue() != recordId) {
                    relationDataNew.add(relationData.get(i).longValue());
                }
            }
        } else {
            // Add relation
            for (int i = 0; i < relationData.size(); i++) {
                relationDataNew.add(relationData.get(i).longValue());
            }
            relationDataNew.add(recordId);
        }
        productDataMap.put(fieldName, relationDataNew);

        customersDTOUpdate.setCustomerData(gson.toJson(productDataMap));
        customersService.save(customersDTOUpdate);
        updateRecordIds.add(customersDTOUpdate.getCustomerId());
        lstNewData.add(customersMapper.clone(customersDTOUpdate));

        return customersDTOUpdate;
    }

    /**
     * Validate parameter
     *
     * @param recordId
     * @param relationDataInfos
     */
    private void validateUpdateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos) {
        // recordId
        if (recordId == null) {
            throw new CustomRestException("parameter[recordId] is null",
                    CommonUtils.putError("recordId", Constants.RIQUIRED_CODE));
        }

        // relationDataInfos
        if (relationDataInfos == null) {
            throw new CustomRestException("parameter[relationDataInfos] is null",
                    CommonUtils.putError("relationDataInfos", Constants.RIQUIRED_CODE));
        }

        relationDataInfos.forEach(relationData -> {
            if (relationData.getFieldId() == null) {
                throw new CustomRestException("parameter[fieldId] is null",
                        CommonUtils.putError("fieldId", Constants.RIQUIRED_CODE));
            }
            if (relationData.getOldRecordIds() == null) {
                throw new CustomRestException("parameter[oldRecordIds] is null",
                        CommonUtils.putError("oldRecordIds", Constants.RIQUIRED_CODE));
            }
            if (relationData.getNewRecordIds() == null) {
                throw new CustomRestException("parameter[newRecordIds] is null",
                        CommonUtils.putError("newRecordIds", Constants.RIQUIRED_CODE));
            }
        });
    }

    /**
     * Get custom field info
     *
     * @param fieldIds
     * @return
     */
    public List<CustomFieldsInfoOutDTO> getCustomFieldsInfoByFieldIds(List<Long> fieldIds) {
        List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();
        GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest(fieldIds);
        String token = SecurityUtils.getTokenValue().orElse(null);
        try {
            CommonFieldInfoResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request,
                    CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
            if (response != null && response.getCustomFieldsInfo() != null) {
                fieldsList.addAll(response.getCustomFieldsInfo());
            }
        } catch (IllegalStateException e) {
            log.error(e.getMessage());
        }
        return fieldsList;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#integrateCustomer(jp.co.softbrain.esales.customers.service.dto.IntegrateCustomerInDTO)
     */
    @Override
    @Transactional
    public CustomerIdOutResponse integrateCustomer(IntegrateCustomerInDTO integrateCustomer,
            List<FileMappingDTO> filesMap) throws IOException {
        CustomerIdOutResponse response = new CustomerIdOutResponse();
        // 1. validate parameter
        List<Map<String, Object>> errors = new ArrayList<>();
        // 1.1. validate required
        if (integrateCustomer.getCustomerId() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE, null));
        }
        if (integrateCustomer.getCustomerIdsDelete() == null || integrateCustomer.getCustomerIdsDelete().isEmpty()) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS_DELETE, Constants.RIQUIRED_CODE, null));
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.MSG_REQUIRE_PARAMERTER, errors);
        }

        String formatDate = getFormatDate();
        // 1.2. validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> customParams = jsonBuilder.convertObjectIncludeFields(integrateCustomer,
                Arrays.asList(ConstantsCustomers.CUSTOMER_ID, ConstantsCustomers.FIELD_CUSTOMER_NAME,
                        ConstantsCustomers.FIELD_CUSTOMER_ALIAS_NAME, ConstantsCustomers.FIELD_PHONE_NUMBER,
                        ConstantsCustomers.FIELD_ZIPCODE, ConstantsCustomers.FIELD_ADDRESS,
                        ConstantsCustomers.FIELD_BUILDING, ConstantsCustomers.FIELD_URL, ConstantsCustomers.FIELD_MEMO,
                        ConstantsCustomers.PARAM_BUSINESS_MAIN_ID, BUSINESS_SUB_ID));
        if (!CollectionUtils.isEmpty(integrateCustomer.getCustomerData())) {
            customParams.putAll(jsonBuilder.convertKeyValueList(integrateCustomer.getCustomerData()));
        }

        String validateJson = jsonBuilder.build(FieldBelongEnum.CUSTOMER.getCode(), null, customParams, formatDate);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        errors.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        Long emloyeeIdLogin = jwtTokenUtil.getEmployeeIdFromToken();
        // 2. update customer data
        // check exist
        Long customerIntergrateId = integrateCustomer.getCustomerId();

        CustomersDTO oldDto = customersService.findOne(customerIntergrateId).orElse(null);
        if (oldDto == null) {
            Map<String, Object> mapError = new HashMap<>();
            mapError.put(Constants.ERROR_ITEM, ConstantsCustomers.CUSTOMER_ID);
            mapError.put(Constants.ERROR_CODE, Constants.EXCLUSIVE_CODE);
            mapError.put(Constants.ERROR_PARAMS, customerIntergrateId);
            throw new CustomRestException(ConstantsCustomers.DATA_HAS_BEEN_CHANGED, mapError);
        }
        CustomersDTO cloneDTto = customersMapper.clone(oldDto);

        // 3. get custom fields info
        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, request, CommonFieldInfoResponse.class,
                SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());

        // update customer infomationfi
        // 5. update customer
        oldDto = CustomersCommonUtil.mappingDataForObject(integrateCustomer, oldDto, Arrays.asList(CUSTOMER_DATA),
                true);
        List<CustomerDataTypeDTO> listCustomerData = integrateCustomer.getCustomerData();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(emloyeeIdLogin, filesMap,
                tenantName, applicationProperties.getUploadBucket(), FieldBelongEnum.CUSTOMER);
        Map<String, List<FileInfosDTO>> customersFilesMap = null;
        if (uploadData != null) {
            customersFilesMap = uploadData.get(0L);
            String newCusData = getJsonCustomerDataUpdate(oldDto, listCustomerData,
                    fieldInfoResponse.getCustomFieldsInfo(), customersFilesMap, formatDate);
            oldDto.setCustomerData(newCusData);
        }
        FileInfosDTO iconFile = processCustomerLogo(customersFilesMap, integrateCustomer.getCustomerLogo());
        if (iconFile != null) {
            oldDto.setPhotoFileName(iconFile.getFileName());
            oldDto.setPhotoFilePath(iconFile.getFilePath());
        } else {
            oldDto.setPhotoFileName("");
            oldDto.setPhotoFilePath("");
        }
        oldDto.setUpdatedUser(emloyeeIdLogin);

        CustomersDTO savedDto = customersService.save(oldDto);

        Long customerIdUpdated = savedDto.getCustomerId();

        // 5. save data into customers history
        CustomersHistories history = customersHistoriesMapper.toHistoryEntity(savedDto);
        // get content change
        String contentChange = CustomersCommonUtil.getContentChanges(cloneDTto, savedDto, true).toString();
        history.setContentChange(contentChange);
        history.setCreatedUser(emloyeeIdLogin);
        history.setUpdatedUser(emloyeeIdLogin);

        // get merge customer id
        KeyValue kv = new KeyValue();
        kv.setKey(ConstantsCustomers.CUSTOMER_COLUMN_ID);
        kv.setValue(gson.toJson(integrateCustomer.getCustomerIdsDelete()));
        String customerMergeIds = gson.toJson(jsonBuilder.convertKeyValueList(Arrays.asList(kv)));
        history.setMergedCustomerId(customerMergeIds);
        customersHistoriesRepository.save(history);

        // 4. update data relation
        try {
            // update sales
            UpdateCustomerRelationRequest businessRequest = new UpdateCustomerRelationRequest();
            businessRequest.setCustomerIds(integrateCustomer.getCustomerIdsDelete());
            businessRequest.setCustomerIdUpdate(customerIdUpdated);
            restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                    ConstantsCustomers.API_SALSES_UPDATE_CUSTOMER_RELATION, HttpMethod.POST, businessRequest,
                    UpdateCustomerRelationDTO.class, token, tenantName);

            // update task
            UpdateTaskCustomerRelationRequest taskRequest = new UpdateTaskCustomerRelationRequest();
            taskRequest.setCustomerIds(integrateCustomer.getCustomerIdsDelete());
            taskRequest.setCustomerIdUpdate(customerIdUpdated);
            taskRequest.setCustomerNameUpdate(savedDto.getCustomerName());
            taskRequest.setUserId(emloyeeIdLogin);
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES, ConstantsCustomers.API_TASK_CUSTOMER_RELATION,
                    HttpMethod.POST, taskRequest, ListTaskIdOutDTO.class, token, tenantName);

            // update business card
            UpdateCustomerRelationRequest businessCardRequest = new UpdateCustomerRelationRequest();
            businessCardRequest.setCustomerIdUpdate(customerIdUpdated);
            businessCardRequest.setCustomerIds(integrateCustomer.getCustomerIdsDelete());
            businessCardRequest.setCustomerNameUpdate(savedDto.getCustomerName());
            restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                    ConstantsCustomers.API_BUSINESS_CARD_UPDATE_CUSTOMER_RELATION, HttpMethod.POST, businessCardRequest,
                    UpdateCustomerRelationResponse.class, token, tenantName);

            // update schedules
            UpdateScheduleCustomerRelationRequest scheduleRequest = new UpdateScheduleCustomerRelationRequest();
            scheduleRequest.setCustomerIds(integrateCustomer.getCustomerIdsDelete());
            scheduleRequest.setCustomerIdUpdate(integrateCustomer.getCustomerId());
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_UPDATE_SCHEDULE_CUSTOMER_RELATION, HttpMethod.POST, scheduleRequest,
                    UpdateScheduleCustomerRelationResponse.class, token, tenantName);

            // update timeline
            UpdateRelationDataInForm timelineRequest = new UpdateRelationDataInForm();
            timelineRequest.setSourceIds(integrateCustomer.getCustomerIdsDelete());
            timelineRequest.setTargetId(integrateCustomer.getCustomerId());
            timelineRequest.setType(5);

            restOperationUtils.executeCallApi(PathEnum.TIMELINES, ConstantsCustomers.API_TIMELINE_UPDATE_RELATION_DATA,
                    HttpMethod.POST, timelineRequest, Collection.class, token, tenantName);

            // update activities
            UpdateActivityCustomerRelationRequet activitiesRequest = new UpdateActivityCustomerRelationRequet();
            activitiesRequest.setCustomerIds(integrateCustomer.getCustomerIdsDelete());
            activitiesRequest.setCustomerIdUpdate(integrateCustomer.getCustomerId());
            restOperationUtils.executeCallApi(PathEnum.ACTIVITIES,
                    ConstantsCustomers.API_ACTIVITY_UPDATE_CUSTOMER_RELATION, HttpMethod.POST, activitiesRequest,
                    UpdateActivityCustomerRelationResponse.class, token, tenantName);

            // TODO: update mails

        } catch (Exception e) {
            log.warn("Update Relation fail, cause by : {}", e.getLocalizedMessage());
        }

        // delete old data
        List<Customers> listOldData = customersRepository
                .findAllByCustomerIdIn(integrateCustomer.getCustomerIdsDelete());
        if (listOldData.size() != integrateCustomer.getCustomerIdsDelete().size()) {
            throw new CustomRestException(ConstantsCustomers.ERROR_EXCLUSIVE, CommonUtils
                    .putError(integrateCustomer.getCustomerIdsDelete().toString() + "", Constants.EXCLUSIVE_CODE));
        }
        customersRepository.deleteAll(listOldData);

        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null,
                integrateCustomer.getCustomerIdsDelete(), Constants.ChangeAction.DELETE.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.DELETE_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null, Arrays.asList(customerIdUpdated),
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.UPDATE_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        response.setCustomerId(customerIdUpdated);
        return response;

    }

}
