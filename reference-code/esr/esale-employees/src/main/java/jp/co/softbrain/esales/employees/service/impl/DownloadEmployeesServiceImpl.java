package jp.co.softbrain.esales.employees.service.impl;

import java.io.IOException;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.TimeZone;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.CaseFormat;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.ExtensionBelong;
import jp.co.softbrain.esales.config.Constants.FileExtension;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.DownloadEmployeesService;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.dto.DepartmentEmployeeListDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadDepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupEmployeeListDTO;
import jp.co.softbrain.esales.employees.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.employees.service.dto.TimezonesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetLanguagesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataSubType5DTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetTimezonesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.RelationDataDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.util.ChannelUtils;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * Service Implementation DownloadEmployeesService
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DownloadEmployeesServiceImpl implements DownloadEmployeesService {
    private static final String NEW_LINE_CHAR = "\n";
    private static final String POSITION_KEY_WORD = "position";
    private static final String LANGUAGE_KEY_WORD = "language";
    private static final CharSequence TIMEZONE_KEY_WORD = "timezone";
    private static final String METHOD_GET_PREFFIX = "get";
    private static final String IS_NUMBER_PATTERN = "\\d";
    private static final String FILE_NAME_DOWNLOAD_EMPLOYEES = "employee_export";
    private static final String EMPLOYEE_MANAGERS = "employee_managers";
    private static final String EMPLOYEE_SUBORDINATES = "employee_subordinates";
    private static final String IS_ADMIN = "is_admin";
    private static final String EMPLOYEE_PACKAGES = "employee_packages";
    private static final String ENCLOSURE = "\"";
    private static final String CONVERT_DATA_ERROR = "Can not convert data";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private EmployeesGroupsRepositoryCustom employeesGroupsRepositoryCustom;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ChannelUtils channelUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private TypeReference<Map<String, Object>> typeRefMap = new TypeReference<>() {};
    private TypeReference<List<Map<String, Object>>> typeRefListMap = new TypeReference<>() {};

    /**
     * @see jp.co.softbrain.esales.employees.service.DownloadEmployeesService#downloadEmployees(java.util.List,
     *      java.util.List, java.lang.Integer, java.lang.Long)
     */
    @Override
    public String downloadEmployees(List<Long> employeeIds, List<KeyValue> orderBy, Integer selectedTargetType,
            Long selectedTargetId) {
        // 1.Get fieldInfoPersonals
        final List<FieldInfoPersonalsOutDTO> fieldsInfoList = getListFieldInfoPersonal(selectedTargetType,
                selectedTargetId);

        // 2.get employees Info
        // 2.1 getEmployees - common logic
        final String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        List<DownloadEmployeesDTO> listEmployeesSorted = employeesCommonService.getEmployeesForDownload(employeeIds,
                orderBy, languageCode);

        List<String> responseCSV = new ArrayList<>();
        List<String> headerCSV = new ArrayList<>();
        List<String> bodyCSV = new ArrayList<>();
        Map<String, FieldInfoPersonalsOutDTO> fieldInfoMap = new HashMap<>();

        // Create csv header
        createCSVHeader(fieldsInfoList, headerCSV, fieldInfoMap);
        responseCSV.add(String.join(ConstantsEmployees.COMMA, headerCSV));

        // get all data for select organization item
        List<Long> orgEmployeeId = new ArrayList<>();
        List<Long> orgDepartmentIds = new ArrayList<>();
        List<Long> orgGroupIds = new ArrayList<>();

        // map of fieldBelong and its record ids
        Map<Integer, List<Long>> idsRecordRelationMap = new HashMap<>();
        // map of fieldBelong and its relation field ids
        Map<Integer, List<Long>> idsFieldRelationMap = new HashMap<>();
        // map of employee and its dynamic data map
        Map<Long, Map<String, Object>> employeeDataMap = populateEmployeeData(listEmployeesSorted, fieldInfoMap,
                orgEmployeeId, orgDepartmentIds, orgGroupIds, idsFieldRelationMap, idsRecordRelationMap);

        // get relation data for each field belong
        final Map<Integer, GetRelationDataOutDTO> responseRelationMap = new HashMap<>();
        if (!idsRecordRelationMap.isEmpty()) {
            getRelationDataOutMap(idsFieldRelationMap, idsRecordRelationMap, responseRelationMap);
        }

        // get data for select orgainization item
        Map<Long, List<String>> orgEmployeeMap = new HashMap<>();
        Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap = new HashMap<>();
        Map<Long, GroupEmployeeListDTO> orgGroupMap = new HashMap<>();

        getAllDataSelectedOrganization(orgEmployeeId, orgDepartmentIds, orgGroupIds, orgEmployeeMap, orgDepartmentMap,
                orgGroupMap);

        // get data calculator data config
        Map<String, Map<Long, Double>> calculatorResultMap = new HashMap<>();
        getDataCalculation(employeeIds, fieldsInfoList, calculatorResultMap);

        // get package for employee
        List<EmployeesPackagesSubtypeDTO> listPackage = employeesRepositoryCustom.findPackagesByEmployeeId(employeeIds);
        Map<Long, List<EmployeesPackagesSubtypeDTO>> packageMap = new HashMap<>();
        listPackage.stream().forEach(obj -> {
            if (packageMap.get(obj.getEmployeeId()) == null) {
                packageMap.put(obj.getEmployeeId(), new ArrayList<>());
            }
            packageMap.get(obj.getEmployeeId()).add(obj);
        });

        // get language
        List<LanguagesDTO> languages = getLanguages();
        // build language map
        Map<Long, LanguagesDTO> languageMap = new HashMap<>();
        languages.forEach(language -> languageMap.put(language.getLanguageId(), language));

        // get timezone
        List<TimezonesDTO> timezones = getTimezones();
        // build timezone map
        Map<Long, TimezonesDTO> timezoneMap = new HashMap<>();
        timezones.forEach(timezone -> timezoneMap.put(timezone.getTimezoneId(), timezone));

        // create csv data
        listEmployeesSorted.stream().forEach(empDTO -> {
            bodyCSV.clear();
            fieldsInfoList.stream().forEach(fieldInfo -> {
                if (isIgnoreFieldName(fieldInfo.getFieldName())) {
                    return;
                }
                String data = createDataEmployeeByField(empDTO, employeeDataMap.get(empDTO.getEmployeeId()), fieldInfo,
                        languageMap, timezoneMap, responseRelationMap, calculatorResultMap, packageMap, orgEmployeeMap,
                        orgDepartmentMap, orgGroupMap);
                data = (data.startsWith(ConstantsEmployees.SQUARE_BRACKET_OPEN)
                        && data.endsWith(ConstantsEmployees.SQUARE_BRACKET_CLOSE))
                                ? data.substring(1, data.length() - 1)
                                : data;
                bodyCSV.add(ENCLOSURE + data.replace(ENCLOSURE, ENCLOSURE + ENCLOSURE) + ENCLOSURE);
            });
            responseCSV.add(String.join(ConstantsEmployees.COMMA, bodyCSV));
        });

        return employeesCommonService.copyFileToS3(FILE_NAME_DOWNLOAD_EMPLOYEES, FileExtension.CSV,
                String.join(NEW_LINE_CHAR, responseCSV));
    }

    /**
     * getDataCalculation
     *
     * @param employeeIds
     * @param fieldsInfoList
     * @param calculatorResultMap
     */
    private void getDataCalculation(List<Long> employeeIds, List<FieldInfoPersonalsOutDTO> fieldsInfoList,
            Map<String, Map<Long, Double>> calculatorResultMap) {
        fieldsInfoList.stream().forEach(fieldInfo -> {
            if (Integer.valueOf(FieldTypeEnum.CALCULATION.getCode()).equals(fieldInfo.getFieldType())
                    && StringUtils.isNotBlank(fieldInfo.getConfigValue())) {
                Map<Long, Double> calculatorMap = new HashMap<>();
                employeesRepositoryCustom.getCalculatorResult(employeeIds, fieldInfo.getConfigValue()).stream()
                        .forEach(obj -> calculatorMap.put(obj.getEmployeeId(), obj.getResult()));
                calculatorResultMap.put(fieldInfo.getFieldName(), calculatorMap);
            }
        });
    }

    /**
     * getAllDataSelectedOrganization
     *
     * @param orgEmployeeId
     * @param orgDepartmentIds
     * @param orgGroupIds
     * @param orgEmployeeMap
     * @param orgDepartmentMap
     * @param orgGroupMap
     */
    private void getAllDataSelectedOrganization(List<Long> orgEmployeeId, List<Long> orgDepartmentIds,
            List<Long> orgGroupIds, Map<Long, List<String>> orgEmployeeMap,
            Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap, Map<Long, GroupEmployeeListDTO> orgGroupMap) {
        // get all name of organization type employee
        getAllNameOfOrganizationTypeEmployee(orgEmployeeId, orgEmployeeMap);
        getAllNameOfOrganizationTypeDepartment(orgDepartmentIds, orgDepartmentMap);
        getAllNameOfOrganizationTypeGroup(orgGroupIds, orgGroupMap);
    }

    /**
     * getAllNameOfOrganizationTypeEmployee
     *
     * @param orgEmployeeId
     * @param orgEmployeeMap
     */
    private void getAllNameOfOrganizationTypeEmployee(List<Long> orgEmployeeId,
            Map<Long, List<String>> orgEmployeeMap) {
        if (!orgEmployeeId.isEmpty()) {
            employeesRepository.findByEmployeeIdIn(orgEmployeeId).stream().forEach(employee -> {
                if (orgEmployeeMap.get(employee.getEmployeeId()) == null) {
                    orgEmployeeMap.put(employee.getEmployeeId(), new ArrayList<>());
                }
                orgEmployeeMap.get(employee.getEmployeeId())
                        .add(String.format("%s %s", employee.getEmployeeSurname(), employee.getEmployeeName()).trim());
            });
        }
    }

    /**
     * getAllNameOfOrganizationTypeDepartment
     *
     * @param orgDepartmentIds
     * @param orgDepartmentMap
     */
    private void getAllNameOfOrganizationTypeDepartment(List<Long> orgDepartmentIds,
            Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap) {
        // get all name of organization type department
        if (!orgDepartmentIds.isEmpty()) {
            departmentsRepositoryCustom.getDepartmentsAndEmployeesForOrg(orgDepartmentIds).forEach(department -> {
                String listEmployeeName = department.getListEmployeeFullName().replaceAll(",  ,", ",")
                        .replaceAll(", ,", ",").replaceAll(",,", ",").trim();
                department.setListEmployeeFullName(listEmployeeName.equals(",") ? "" : listEmployeeName);
                orgDepartmentMap.put(department.getDepartmentId(), department);
            });
        }
    }

    /**
     * getAllNameOfOrganizationTypeGroup
     *
     * @param orgGroupIds
     * @param orgGroupMap
     */
    private void getAllNameOfOrganizationTypeGroup(List<Long> orgGroupIds,
            Map<Long, GroupEmployeeListDTO> orgGroupMap) {
        // get all name of organization type group
        if (!orgGroupIds.isEmpty()) {
            employeesGroupsRepositoryCustom.getGroupsAndEmployeesForOrg(orgGroupIds).forEach(group -> {
                String listEmployeeName = group.getListEmployeeFullName().replaceAll(",  ,", ",").replaceAll(", ,", ",")
                        .replaceAll(",,", ",").trim();
                group.setListEmployeeFullName(listEmployeeName.equals(",") ? "" : listEmployeeName);
                orgGroupMap.put(group.getGroupId(), group);
            });
        }
    }

    /**
     * @param fieldsInfoList
     * @param headerCSV
     * @param fieldInfoMap
     */
    private void createCSVHeader(List<FieldInfoPersonalsOutDTO> fieldsInfoList, List<String> headerCSV,
            Map<String, FieldInfoPersonalsOutDTO> fieldInfoMap) {
        final String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        String userLanguage = jwtTokenUtil.getLanguageKeyFromToken();
        Locale locale = Locale.forLanguageTag(userLanguage);

        fieldsInfoList.stream().forEach(fieldInfo -> {
            if (isIgnoreFieldName(fieldInfo.getFieldName())) {
                return;
            }
            // add to map field info
            fieldInfoMap.put(fieldInfo.getFieldName(), fieldInfo);

            // add to header
            if (ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME.equalsIgnoreCase(fieldInfo.getFieldName())) {
                headerCSV.add(messageSource.getMessage("employee.fullName", null, locale));
            } else if (ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA
                    .equalsIgnoreCase(fieldInfo.getFieldName())) {
                headerCSV.add(messageSource.getMessage("employee.fullNameKana", null, locale));
            } else {
                Map<String, Object> fieldLabel;
                try {
                    fieldLabel = objectMapper.readValue(fieldInfo.getFieldLabel(), typeRefMap);
                } catch (IOException e) {
                    throw new CustomException(CONVERT_DATA_ERROR, e);
                }
                Entry<String, Object> jsonData = fieldLabel.entrySet().stream()
                        .filter(entry -> entry.getKey().equals(languageCode)).findFirst().orElse(null);
                headerCSV.add(jsonData == null ? ConstantsEmployees.EMPTY : jsonData.getValue().toString());
            }
        });
    }

    /**
     * getListFieldInfoPersonal
     *
     * @param selectedTargetType
     * @param selectedTargetId
     * @return list field info
     */
    private List<FieldInfoPersonalsOutDTO> getListFieldInfoPersonal(Integer selectedTargetType, Long selectedTargetId) {
        // create request to API
        FieldInfoPersonalsInputDTO infoPersonalRequest = new FieldInfoPersonalsInputDTO();
        infoPersonalRequest.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        infoPersonalRequest.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        infoPersonalRequest.setExtensionBelong(ExtensionBelong.SHOW_IN_LIST.getValue());
        infoPersonalRequest.setSelectedTargetType(selectedTargetType);
        infoPersonalRequest.setSelectedTargetId(selectedTargetId);
        CommonFieldInfoResponse fieldInfoResponse = channelUtils.callAPIGetFieldInfoPersonal(infoPersonalRequest);
        return fieldInfoResponse.getFieldInfoPersonals().stream()
                .sorted(Comparator.comparingInt(FieldInfoPersonalsOutDTO::getFieldOrder)).collect(Collectors.toList());
    }

    /**
     * populate data for custom item
     *
     * @param employeeList
     * @param orgEmployeeId
     * @param orgDepartmentIds
     * @param orgGroupIds
     * @return
     */
    @SuppressWarnings("unchecked")
    private Map<Long, Map<String, Object>> populateEmployeeData(List<DownloadEmployeesDTO> employeeList,
            Map<String, FieldInfoPersonalsOutDTO> fieldInfoMap, List<Long> orgEmployeeId, List<Long> orgDepartmentIds,
            List<Long> orgGroupIds, Map<Integer, List<Long>> idsFieldRelationMap,
            Map<Integer, List<Long>> idsRecordRelationMap) {
        Map<Long, Map<String, Object>> employeeDataMap = new HashMap<>();
        employeeList.stream().forEach(empDTO -> {
            if (StringUtils.isBlank(empDTO.getEmployeeData())) {
                return;
            }
            Map<String, Object> employeeData;
            try {
                employeeData = objectMapper.readValue(empDTO.getEmployeeData(), typeRefMap);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }

            employeeData.forEach((key, value) -> {
                // check value null or item not display
                if (value == null || fieldInfoMap.get(key) == null) {
                    return;
                }
                /**
                 * if field type is relation,
                 * put the display field id to map field relation by fieldBelong
                 * and put the value of ids record to map id relation by
                 * fieldBelong
                 */
                if (key.startsWith("relation_") && !((List<Object>) value).isEmpty()) {
                    FieldInfoPersonalsOutDTO field = fieldInfoMap.get(key);
                    buildMapsRelation(field, value, idsFieldRelationMap, idsRecordRelationMap);
                }
                /**
                 * if field type is select_organization
                 * get its value of organization and fill to list
                 */
                else if (key.startsWith("select_organization_") && !((List<Object>) value).isEmpty()) {
                    getIDForListsOrganization(value, orgEmployeeId, orgDepartmentIds, orgGroupIds);
                }
                /**
                 * if field type is file
                 * get value of attribute file_name
                 */
                else if (key.startsWith("file_") && value != "") {
                    String listFileName = getDataForTypeFile(value);
                    employeeData.put(key, listFileName);
                }
                /**
                 * if field type is address
                 * get full value by attribute address
                 */
                else if (key.startsWith("address_") && value != "") {
                    String address = getDataForTypeAddress(value);
                    employeeData.put(key, address);
                }
                /**
                 * if field type is link
                 * get value of attibute url_text
                 */
                else if (key.startsWith("link_") && value != "") {
                    String urlText = getDataForTypeLink(value);
                    employeeData.put(key, urlText);
                }
            });
            employeeDataMap.put(empDTO.getEmployeeId(), employeeData);
        });
        return employeeDataMap;
    }

    /**
     * @param field
     * @param value
     * @param idsFieldRelationMap
     * @param idsRecordRelationMap
     */
    @SuppressWarnings("unchecked")
    private void buildMapsRelation(FieldInfoPersonalsOutDTO field, Object value,
            Map<Integer, List<Long>> idsFieldRelationMap, Map<Integer, List<Long>> idsRecordRelationMap) {
        if (value == null || value.toString().isBlank()) {
            return;
        }

        RelationDataDTO relationConfig = field.getRelationData();
        Integer fieldBelong = relationConfig.getFieldBelong();
        idsFieldRelationMap.computeIfAbsent(fieldBelong, k -> new ArrayList<>()).add(relationConfig.getDisplayFieldId());

        List<Object> listData;
        if (value instanceof String) {
            TypeReference<List<Object>> listType = new TypeReference<List<Object>>() {};
            try {
                listData = objectMapper.readValue(String.valueOf(value), listType);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        } else {
            listData = (List<Object>) value;
        }
        List<Long> relationRecordIds = listData.stream().mapToLong(id -> Long.valueOf(id.toString())).boxed()
                .collect(Collectors.toList());
        if (idsRecordRelationMap.get(fieldBelong) != null) {
            idsRecordRelationMap.get(fieldBelong).addAll(relationRecordIds);
        } else {
            idsRecordRelationMap.put(fieldBelong, relationRecordIds);
        }
    }

    /**
     * @param value
     * @param orgEmployeeId
     * @param orgDepartmentIds
     * @param orgGroupIds
     */
    @SuppressWarnings("unchecked")
    private void getIDForListsOrganization(Object value, List<Long> orgEmployeeId, List<Long> orgDepartmentIds,
            List<Long> orgGroupIds) {
        if (value == null || String.valueOf(value).isBlank()) {
            return;
        }
        List<Map<String, Object>> listValue;
        if (value instanceof String) {
            try {
                listValue = objectMapper.readValue(value.toString(), typeRefListMap);
            } catch (Exception e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        } else {
            listValue = ((List<Map<String, Object>>) value);
        }
        listValue.forEach(orgItem -> orgItem.forEach((col, id) -> {
            Long targetId = Long.valueOf(id.toString());
            if (targetId <= 0) {
                return;
            }
            if (col.equals("employee_id") && !orgEmployeeId.contains(targetId)) {
                orgEmployeeId.add(targetId);
            } else if (col.equals("department_id") && !orgDepartmentIds.contains(targetId)) {
                orgDepartmentIds.add(targetId);
            } else if (col.equals("group_id") && !orgGroupIds.contains(targetId)) {
                orgGroupIds.add(targetId);
            }
        }));
    }

    /**
     * Get map relation data by response
     *
     * @param fieldBelongMap fieldBelongMap
     * @param empRelationIdsMap empRelationIdsMap
     * @return map relation
     */
    private void getRelationDataOutMap(Map<Integer, List<Long>> fieldBelongMap,
            Map<Integer, List<Long>> empRelationIdsMap, Map<Integer, GetRelationDataOutDTO> relationMap) {
        fieldBelongMap.entrySet().forEach(fieldRelationEntry -> {

            Integer fieldBelong = fieldRelationEntry.getKey();
            List<Long> listFieldRelation = fieldRelationEntry.getValue();
            List<Long> listIDRecordRelation = empRelationIdsMap.get(fieldRelationEntry.getKey());

            // Call api getRelationData
            GetRelationDataRequest relationRequest = new GetRelationDataRequest();
            relationRequest.setFieldBelong(fieldBelong);
            relationRequest.setFieldIds(listFieldRelation);
            relationRequest.setListIds(listIDRecordRelation);
            GetRelationDataOutDTO responseRelation = channelUtils.callAPICommonGetRelationData(relationRequest);

            relationMap.put(fieldBelong, responseRelation);
        });
    }

    /**
     * Create column data for CSV string each row by field
     *
     * @param empDTO - DTO contains data
     * @param field - contains field name header
     * @param languageMap - map language reference
     * @param timezoneMap - map time zone reference
     * @param responseRelationMap
     * @param calculatorResultMap
     * @param packageMap
     * @param orgEmployeeMap
     * @param orgDepartmentMap
     * @param orgGroupMap
     * @param languageCode
     * @return
     */
    private String createDataEmployeeByField(DownloadEmployeesDTO empDTO, Map<String, Object> employeeData,
            FieldInfoPersonalsOutDTO field, Map<Long, LanguagesDTO> languageMap, Map<Long, TimezonesDTO> timezoneMap,
            Map<Integer, GetRelationDataOutDTO> responseRelationMap, Map<String, Map<Long, Double>> calculatorResultMap,
            Map<Long, List<EmployeesPackagesSubtypeDTO>> packageMap, Map<Long, List<String>> orgEmployeeMap,
            Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap, Map<Long, GroupEmployeeListDTO> orgGroupMap) {

        List<DownloadDepartmentPositionDTO> listDepartmentPositions = empDTO.getDepartments();
        String fieldName = field.getFieldName();
        // check if fieldName is extension Field
        if (isDynamicField(fieldName) && employeeData != null) {
            return getDataDownloadForDynamicField(field, empDTO, employeeData, calculatorResultMap, orgEmployeeMap,
                    orgDepartmentMap, orgGroupMap, responseRelationMap);

        } else if (ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME.equals(fieldName)) {
            String fullName = StringUtil.getFullName(empDTO.getEmployeeSurname(), empDTO.getEmployeeName());
            return StringUtil.isNull(fullName) ? ConstantsEmployees.EMPTY : fullName;

        } else if (ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA.equals(fieldName)) {
            String fullName = StringUtil.getFullName(empDTO.getEmployeeSurnameKana(), empDTO.getEmployeeNameKana());
            return StringUtil.isNull(fullName) ? ConstantsEmployees.EMPTY : fullName;

        } else if (StringUtils.contains(fieldName, ConstantsEmployees.DEPARTMENT_CAPTION)) {
            List<String> departmentNameList = listDepartmentPositions.stream()
                    .filter(dep -> dep.getDepartmentName() != null)
                    .map(DownloadDepartmentPositionDTO::getDepartmentName).collect(Collectors.toList());
            return departmentNameList.isEmpty() ? ConstantsEmployees.EMPTY : String.join(", ", departmentNameList);

        } else if (StringUtils.contains(fieldName, POSITION_KEY_WORD)) {
            List<String> possitionsNameList = listDepartmentPositions.stream()
                    .map(DownloadDepartmentPositionDTO::getPositionName).map(name -> (name == null ? "" : name))
                    .collect(Collectors.toList());
            return possitionsNameList.isEmpty() ? ConstantsEmployees.EMPTY : String.join(", ", possitionsNameList);

        } else if (fieldName.contains(LANGUAGE_KEY_WORD)) {
            LanguagesDTO langDTO = languageMap.get(empDTO.getLanguageId());
            return langDTO == null ? ConstantsEmployees.EMPTY : langDTO.getLanguageName();

        } else if (fieldName.contains(TIMEZONE_KEY_WORD)) {
            TimezonesDTO timeDTO = timezoneMap.get(empDTO.getTimezoneId());
            return timeDTO == null ? ConstantsEmployees.EMPTY : timeDTO.getTimezoneShortName();

        } else if (StringUtils.contains(fieldName, EMPLOYEE_MANAGERS)) {
            List<DownloadEmployeeNameDTO> empManagerList = empDTO.getEmployeeManagers();
            List<String> listManagerName = empManagerList.stream().map(DownloadEmployeeNameDTO::getEmployeeName)
                    .collect(Collectors.toList());
            return listManagerName.isEmpty() ? ConstantsEmployees.EMPTY : String.join(", ", listManagerName);

        } else if (StringUtils.contains(fieldName, EMPLOYEE_SUBORDINATES)) {
            List<DownloadEmployeeNameDTO> staffList = empDTO.getEmployeeSubordinates();
            List<String> listStaffName = staffList.stream().map(DownloadEmployeeNameDTO::getEmployeeName)
                    .collect(Collectors.toList());
            return listStaffName.isEmpty() ? ConstantsEmployees.EMPTY : String.join(", ", listStaffName);

        } else if (StringUtils.contains(fieldName, IS_ADMIN)) {
            String userLanguage = jwtTokenUtil.getLanguageKeyFromToken();
            Locale locale = Locale.forLanguageTag(userLanguage);
            if (empDTO.getIsAdmin()) {
                return messageSource.getMessage("employee.isAdmin", null, locale);
            } else {
                return messageSource.getMessage("employee.isNotAdmin", null, locale);
            }
        } else if (StringUtils.contains(fieldName, EMPLOYEE_PACKAGES)) {
            List<EmployeesPackagesSubtypeDTO> listPackage = packageMap.get(empDTO.getEmployeeId());
            if (listPackage == null) {
                return ConstantsEmployees.EMPTY;
            }
            List<String> listPackageName = listPackage.stream().map(EmployeesPackagesSubtypeDTO::getPackagesName)
                    .collect(Collectors.toList());
            return String.join(", ", listPackageName);

        } else {
            String methodName = METHOD_GET_PREFFIX
                    .concat(CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, field.getFieldName()));
            try {
                Method method = DownloadEmployeesDTO.class.getMethod(methodName);
                Object object = method.invoke(empDTO);
                if (object instanceof List<?>) {
                    return (((List<?>) object).isEmpty()) ? ConstantsEmployees.EMPTY
                            : objectMapper.writeValueAsString(object);
                }
                return method.invoke(empDTO).toString();
            } catch (Exception e) {
                return ConstantsEmployees.EMPTY;
            }
        }
    }

    /**
     * getDataDownloadForDynamicField
     *
     * @param field
     * @param empDTO
     * @param calculatorResultMap
     * @param employeeData
     * @param responseRelationMap
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getDataDownloadForDynamicField(FieldInfoPersonalsOutDTO field, DownloadEmployeesDTO empDTO,
            Map<String, Object> employeeData, Map<String, Map<Long, Double>> calculatorResultMap,
            Map<Long, List<String>> orgEmployeeMap, Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap,
            Map<Long, GroupEmployeeListDTO> orgGroupMap, Map<Integer, GetRelationDataOutDTO> responseRelationMap) {
        String fieldName = field.getFieldName();
        Integer fieldType = field.getFieldType();

        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();

        Entry<String, Object> jsonData = employeeData.entrySet().stream()
                .filter(entry -> entry.getKey().equals(fieldName)).findFirst().orElse(null);

        if (Integer.valueOf(FieldTypeEnum.CALCULATION.getCode()).equals(fieldType)) {
            if (StringUtils.isBlank(field.getConfigValue()) || calculatorResultMap.get(fieldName) == null
                    || calculatorResultMap.get(fieldName).get(empDTO.getEmployeeId()) == null) {
                return ConstantsEmployees.EMPTY;
            } else {
                return String.valueOf(calculatorResultMap.get(fieldName).get(empDTO.getEmployeeId()));
            }
        } else if (jsonData == null || jsonData.getValue() == null
                || StringUtils.isBlank(jsonData.getValue().toString())) {
            return ConstantsEmployees.EMPTY;

        } else if (Integer.valueOf(FieldTypeEnum.SELECT_ORGANIZATION.getCode()).equals(fieldType)) {
            return getSelectOrganization(jsonData.getValue(), orgEmployeeMap, orgDepartmentMap, orgGroupMap);

        } else if (isDateTimeField(fieldType)) {
            return getDataForTypeDateAndTime(fieldType, jsonData.getValue().toString());

        } else if (Integer.valueOf(FieldTypeEnum.RELATION.getCode()).equals(fieldType)) {
            if (field.getRelationData() == null) {
                return ConstantsEmployees.EMPTY;
            }
            return getRelationDataDownloadCSV(jsonData.getValue(),
                    responseRelationMap.get(field.getRelationData().getFieldBelong()),
                    field.getRelationData().getDisplayFieldId(), languageCode);

        } else if (Integer.valueOf(FieldTypeEnum.RADIO.getCode()).equals(fieldType)
                || Integer.valueOf(FieldTypeEnum.PULLDOWN.getCode()).equals(fieldType)) {
            List<String> labelItem = new ArrayList<>();
            field.getFieldItems().forEach(item -> {
                if (item.getItemId().equals(Long.valueOf(jsonData.getValue().toString()))) {
                    labelItem.add(getLabel(item.getItemLabel(), languageCode));
                    return;
                }
            });
            return String.join("", labelItem);

        } else if (Integer.valueOf(FieldTypeEnum.CHECKBOX.getCode()).equals(fieldType)
                || Integer.valueOf(FieldTypeEnum.MULTIPLE_PULLDOWN.getCode()).equals(fieldType)) {
            List<String> labelItem = new ArrayList<>();
            field.getFieldItems().forEach(item -> ((List<Object>) jsonData.getValue()).forEach(id -> {
                if (item.getItemId().equals(Long.valueOf(id.toString()))) {
                    labelItem.add(getLabel(item.getItemLabel(), languageCode));
                }
            }));
            return String.join(", ", labelItem);
        }
        return Objects.toString(jsonData.getValue().toString(), "");

    }

    /**
     * Get the group, department, employee of organization
     *
     * @param organizationData the value of select_organization
     * @param orgEmployeeMap
     * @param orgDepartmentMap
     * @param orgGroupMap
     * @return the employee's name of organization
     */
    @SuppressWarnings("unchecked")
    private String getSelectOrganization(Object organizationData, Map<Long, List<String>> orgEmployeeMap,
            Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap, Map<Long, GroupEmployeeListDTO> orgGroupMap) {
        if (organizationData == null || ((List<Map<String, Object>>) organizationData).isEmpty()) {
            return ConstantsEmployees.EMPTY;
        }
        List<String> listData = new ArrayList<>();
        for (Map<String, Object> map : (List<Map<String, Object>>) organizationData) {
            long groupId = Double.valueOf(map.get("group_id").toString()).longValue();
            if (groupId > 0 && orgGroupMap.get(groupId) != null) {
                String groupName = orgGroupMap.get(groupId).getGroupName();
                if (StringUtils.isNotBlank(groupName)) {
                    listData.add(groupName);
                }
                String employeeName = orgGroupMap.get(groupId).getListEmployeeFullName();
                if (StringUtils.isNotBlank(employeeName)) {
                    listData.add(employeeName);
                }
            }
            long employeeId = Double.valueOf(map.get("employee_id").toString()).longValue();
            if (employeeId > 0 && orgEmployeeMap.get(employeeId) != null) {
                listData.add(String.join(", ", orgEmployeeMap.get(employeeId)));
            }
            long departmentId = Double.valueOf(map.get("department_id").toString()).longValue();
            if (departmentId > 0 && orgGroupMap.get(departmentId) != null) {
                String departmentName = orgDepartmentMap.get(departmentId).getDepartmentName();
                if (StringUtils.isNotBlank(departmentName)) {
                    listData.add(departmentName);
                }
                String employeeName = orgDepartmentMap.get(departmentId).getListEmployeeFullName();
                if (StringUtils.isNotBlank(employeeName)) {
                    listData.add(employeeName);
                }
            }
        }
        return String.join(", ", listData);
    }

    /**
     * Get Relation data
     *
     * @param jsonData
     * @param getRelationDataOutDTO
     *        data field relation
     * @param fieldId
     *        id employee
     * @return data to add file CSV
     */
    @SuppressWarnings("unchecked")
    private String getRelationDataDownloadCSV(Object jsonData, GetRelationDataOutDTO getRelationDataOutDTO,
            Long fieldId, String languageCode) {
        String response = ConstantsEmployees.EMPTY;
        if (getRelationDataOutDTO == null || jsonData == null || ((List<Object>) jsonData).isEmpty()
                || CollectionUtils.isEmpty(getRelationDataOutDTO.getRelationData())) {
            return response;
        }
        List<Long> relationIds = ((List<Object>) jsonData).stream().mapToLong(id -> Long.valueOf(id.toString())).boxed()
                .collect(Collectors.toList());
        List<String> dataRelationStringList = new ArrayList<>();
        List<GetRelationDataSubType1DTO> relationData = getRelationDataOutDTO.getRelationData();

        Map<Long, GetRelationDataSubType5DTO> itemMap = new HashMap<>();
        if (getRelationDataOutDTO.getFieldItems() != null) {
            getRelationDataOutDTO.getFieldItems().forEach(item -> itemMap.put(item.getItemId(), item));
        }

        relationData.forEach(data -> {
            if (relationIds.contains(data.getRecordId())) {
                data.getDataInfos().forEach(dataInfo -> {
                    if (!dataInfo.getFieldId().equals(fieldId) || StringUtils.isBlank(dataInfo.getValue())) {
                        return;
                    }
                    Integer fieldType = dataInfo.getFieldType();
                    if (Integer.valueOf(FieldTypeEnum.RADIO.getCode()).equals(fieldType)
                            || Integer.valueOf(FieldTypeEnum.PULLDOWN.getCode()).equals(fieldType)) {
                        String labelItem = itemMap.get(Long.valueOf(dataInfo.getValue())).getItemLabel();
                        dataRelationStringList.add(getLabel(labelItem, languageCode));

                    } else if (Integer.valueOf(FieldTypeEnum.CHECKBOX.getCode()).equals(fieldType)
                            || Integer.valueOf(FieldTypeEnum.MULTIPLE_PULLDOWN.getCode()).equals(fieldType)) {
                        TypeReference<ArrayList<Long>> typeRef = new TypeReference<>() {};
                        List<Long> labelIds;
                        try {
                            labelIds = objectMapper.readValue(dataInfo.getValue(), typeRef);
                        } catch (IOException e) {
                            return;
                        }
                        labelIds.forEach(id -> {
                            String labelItem = itemMap.get(id).getItemLabel();
                            dataRelationStringList.add(getLabel(labelItem, languageCode));
                        });
                    } else if (isDateTimeField(fieldType)) {
                        dataRelationStringList.add(getDataForTypeDateAndTime(fieldType, dataInfo.getValue()));
                    } else if (Integer.valueOf(FieldTypeEnum.ADDRESS.getCode()).equals(fieldType)) {
                        dataRelationStringList.add(getDataForTypeAddress(dataInfo.getValue()));

                    } else if (Integer.valueOf(FieldTypeEnum.LINK.getCode()).equals(fieldType)) {
                        dataRelationStringList.add(getDataForTypeLink(dataInfo.getValue()));

                    } else if (Integer.valueOf(FieldTypeEnum.FILE.getCode()).equals(fieldType)) {
                        dataRelationStringList.add(getDataForTypeFile(dataInfo.getValue()));
                    } else if (Integer.valueOf(FieldTypeEnum.SELECT_ORGANIZATION.getCode()).equals(fieldType)) {
                        List<Long> orgEmployeeId = new ArrayList<>();
                        List<Long> orgDepartmentIds = new ArrayList<>();
                        List<Long> orgGroupIds = new ArrayList<>();
                        Map<Long, List<String>> orgEmployeeMap = new HashMap<>();
                        Map<Long, DepartmentEmployeeListDTO> orgDepartmentMap = new HashMap<>();
                        Map<Long, GroupEmployeeListDTO> orgGroupMap = new HashMap<>();

                        getIDForListsOrganization(dataInfo.getValue(), orgEmployeeId, orgDepartmentIds, orgGroupIds);

                        getAllDataSelectedOrganization(orgEmployeeId, orgDepartmentIds, orgGroupIds, orgEmployeeMap,
                                orgDepartmentMap, orgGroupMap);
                        dataRelationStringList.add(getSelectOrganization(dataInfo.getValue(), orgEmployeeMap,
                                orgDepartmentMap, orgGroupMap));
                    } else {
                        dataRelationStringList.add(dataInfo.getValue());
                    }
                });
            }
        });
        if (!CollectionUtils.isEmpty(dataRelationStringList)) {
            response = String.join(", ", dataRelationStringList);
        }
        return response;
    }

    /**
     * getDataForTypeDateAndTime
     *
     * @return data convert
     */
    private String getDataForTypeDateAndTime(Integer fieldType, String dataDateTime) {
        String formatDate = jwtTokenUtil.getFormatDateFromToken();
        String timezone = jwtTokenUtil.getTimeZoneFromToken();
        String formatStandard = "yyyy-MM-dd HH:mm:ss";
        String formatTime = "HH:mm";
        String formatDateTime = String.format("%s %s", formatDate, formatTime);

        if (StringUtils.isBlank(dataDateTime)) {
            return ConstantsEmployees.EMPTY;
        }
        if (Integer.valueOf(FieldTypeEnum.DATETIME.getCode()).equals(fieldType) && StringUtils.isNotBlank(formatDate)
                && StringUtils.isNotBlank(timezone)) {
            return LocalDateTime.parse(dataDateTime, DateTimeFormatter.ofPattern(formatStandard))
                    .toInstant(ZoneOffset.UTC).atZone(TimeZone.getTimeZone(timezone).toZoneId())
                    .format(DateTimeFormatter.ofPattern(formatDateTime));

        } else if (Integer.valueOf(FieldTypeEnum.DATE.getCode()).equals(fieldType) && StringUtils.isNotBlank(formatDate)
                && StringUtils.isNotBlank(timezone)) {
            return LocalDate.parse(dataDateTime).format(DateTimeFormatter.ofPattern(formatDate));

        } else if (Integer.valueOf(FieldTypeEnum.TIME.getCode()).equals(fieldType)
                && StringUtils.isNotBlank(timezone)) {
            return LocalTime.parse(dataDateTime).atDate(LocalDate.parse("2020-01-01")).toInstant(ZoneOffset.UTC)
                    .atZone(TimeZone.getTimeZone(timezone).toZoneId()).format(DateTimeFormatter.ofPattern(formatTime));
        }
        return ConstantsEmployees.EMPTY;
    }

    /**
     * getDataForTypeFile
     *
     * @param value
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getDataForTypeFile(Object value) {
        if (value == null || StringUtils.isBlank(value.toString())) {
            return ConstantsEmployees.EMPTY;
        }
        List<Map<String, String>> fileDataList;
        if (value instanceof String) {
            try {
                fileDataList = objectMapper.readValue(String.valueOf(value), typeRefListMap);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        } else {
            fileDataList = (List<Map<String, String>>) value;
        }
        List<String> listFile = new ArrayList<>();
        fileDataList.forEach(fileData -> {
            if (StringUtils.isNotBlank(fileData.get("file_name"))) {
                listFile.add(fileData.get("file_name"));
            }
        });
        return String.join(", ", listFile);
    }

    /**
     * getDataForTypeLink
     *
     * @param value
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getDataForTypeLink(Object value) {
        if (value == null || StringUtils.isBlank(value.toString())) {
            return ConstantsEmployees.EMPTY;
        }
        Map<String, String> mapValue;
        if (value instanceof String) {
            TypeReference<Map<String, String>> mapType = new TypeReference<Map<String, String>>() {};
            try {
                mapValue = objectMapper.readValue(String.valueOf(value), mapType);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        } else {
            mapValue = (Map<String, String>) value;
        }
        return Objects.toString(mapValue.get("url_text"), "");
    }

    /**
     * getDataForTypeAddress
     *
     * @param value
     * @return
     */
    @SuppressWarnings("unchecked")
    private String getDataForTypeAddress(Object value) {
        if (value == null || StringUtils.isBlank(value.toString())) {
            return "";
        }
        Map<String, String> addressData;
        if (value instanceof String) {
            try {
                addressData = objectMapper.readValue(String.valueOf(value), typeRefMap);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        } else {
            addressData = (Map<String, String>) value;
        }
        return Objects.toString(addressData.get("address"), "");
    }

    /**
     * get label item
     *
     * @param itemLabel
     * @param languageCode
     * @return
     */
    private String getLabel(String itemLabel, String languageCode) {
        Map<String, String> labelData;
        try {
            labelData = objectMapper.readValue(itemLabel, typeRefMap);
        } catch (IOException e) {
            return "";
        }
        return Objects.toString(labelData.get(languageCode), "");
    }

    /**
     * check field type is type date time
     *
     * @param fieldType
     * @return
     */
    private boolean isDateTimeField(Integer fieldType) {
        return Integer.valueOf(FieldTypeEnum.DATE.getCode()).equals(fieldType)
                || Integer.valueOf(FieldTypeEnum.TIME.getCode()).equals(fieldType)
                || Integer.valueOf(FieldTypeEnum.DATETIME.getCode()).equals(fieldType);
    }

    /**
     * Check if String sequence contains at least a number
     *
     * @param sequence - string to check
     * @return boolean
     */
    private boolean isDynamicField(String sequence) {
        Pattern pattern = Pattern.compile(IS_NUMBER_PATTERN);
        return pattern.matcher(sequence).find();
    }

    /**
     * check field name not use
     *
     * @param fieldName
     * @return
     */
    private boolean isIgnoreFieldName(String fieldName) {
        List<String> fieldNameList = new ArrayList<>();
        fieldNameList.add(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME);
        fieldNameList.add(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA);
        fieldNameList.add(ConstantsEmployees.FIELD_NAME_EMPLOYEE_ICON);
        return fieldNameList.contains(fieldName);
    }

    /**
     * Call service common to get list TimezonesDTO
     *
     * @param channel - channel to connect service
     * @return - list TimezonesDTO
     */
    private List<TimezonesDTO> getTimezones() {
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call API getTimezones
        GetTimezonesResponse responseTimezone = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_TIMEZONES, HttpMethod.POST, null, GetTimezonesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        List<TimezonesDTO> timezones = new ArrayList<>();
        if (responseTimezone != null) {
            responseTimezone.getTimezones().forEach(timezone -> {
                TimezonesDTO dto = new TimezonesDTO();
                dto.setTimezoneId(timezone.getTimezoneId());
                dto.setTimezoneShortName(timezone.getTimezoneShortName());
                dto.setTimezoneName(timezone.getTimezoneName());
                timezones.add(dto);
            });
        }
        return timezones;
    }

    /**
     * Call service common to get list LanguagesDTO
     *
     * @return - list LanguagesDTO
     */
    private List<LanguagesDTO> getLanguages() {
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call api getLanguages
        GetLanguagesResponse responseLanguage = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_LANGUAGE, HttpMethod.POST, null, GetLanguagesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        List<LanguagesDTO> languages = new ArrayList<>();
        if (responseLanguage != null) {
            responseLanguage.getLanguagesDTOList().forEach(language -> {
                LanguagesDTO dto = new LanguagesDTO();
                dto.setLanguageId(language.getLanguageId());
                dto.setLanguageName(language.getLanguageName());
                dto.setLanguageCode(language.getLanguageCode());
                languages.add(dto);
            });
        }
        return languages;
    }

}
