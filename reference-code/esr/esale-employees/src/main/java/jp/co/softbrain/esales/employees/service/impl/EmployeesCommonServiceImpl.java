package jp.co.softbrain.esales.employees.service.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.config.UtilsEmployees;
import jp.co.softbrain.esales.employees.domain.Departments;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.domain.Positions;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupMembersRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.PositionsRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.IndexElasticsearchService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadDepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeIconDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDataDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeeElasticsearchInDTO;
import jp.co.softbrain.esales.employees.service.dto.TimezonesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetDetailElasticSearchRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetLanguagesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.GetTimezonesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.employees.service.mapper.CommonsInfoMapper;
import jp.co.softbrain.esales.employees.service.mapper.DataByRecordIdsMapper;
import jp.co.softbrain.esales.employees.service.mapper.DepartmentsMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeeInfoMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesGroupsMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesMapper;
import jp.co.softbrain.esales.employees.service.mapper.PositionsMapper;
import jp.co.softbrain.esales.employees.service.mapper.SelectEmployeesMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.ReflectionUtils;
import jp.co.softbrain.esales.utils.RelationUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType1DTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType2DTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoOutDTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType1DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType2DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType3DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType4DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType5DTO;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoSubType6DTO;

/**
 * Service Implementation Common
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesCommonServiceImpl implements EmployeesCommonService {
    private final Logger log = LoggerFactory.getLogger(EmployeesCommonServiceImpl.class);
    private static final String COPY_FILE_ERROR = "Copy file error";

    public static final String CREATE_DATA_CHANGE_API_METHOD = "createDataChangeElasticSearch";
    public static final String GET_LANGUAGES_API_METHOD = "getLanguages";
    public static final String GET_TIMEZONES_API_METHOD = "getTimezones";
    public static final String GET_FIELD_INFO_ITEM_API_METHOD = "getFieldInfoItemByFieldBelong";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    public static final String FULL_NAME_FORMAT = "%s %s";
    public static final String GROUP_ID_FIELD = "group_id";
    public static final String PARTICIPANT_GROUP_ID_FIELD = "participant_group_id";

    public static final String GET_DATA_ELASTICSEARCH = "getDataElasticSearch";

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private EmployeesGroupsRepository employeesGroupsRepository;

    @Autowired
    private EmployeesDepartmentsRepository employeesDepartmentsRepository;

    @Autowired
    private EmployeesGroupMembersRepository employeesGroupMembersRepository;

    @Autowired
    private DepartmentsRepository departmentsRepository;

    @Autowired
    private PositionsRepository positionsRepository;

    @Autowired
    private EmployeesGroupsMapper employeesGroupsMapper;

    @Autowired
    private DepartmentsMapper departmentsMapper;

    @Autowired
    private PositionsMapper positionsMapper;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private SelectEmployeesMapper selectEmployeesMapper;

    @Autowired
    private EmployeeInfoMapper employeeInfoMapper;

    @Autowired
    private EmployeesMapper employeesMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private DataByRecordIdsMapper dataByRecordIdsMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private CommonsInfoMapper commonsInfoMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IndexElasticsearchService indexElasticsearchService;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private EmployeesGroupsRepositoryCustom employeesGroupsRepositoryCustom;

    @Autowired
    private TmsService tmsService;

    private Gson gson = new Gson();

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      countEmployees(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Long countEmployees(Long departmentId) {
        return Long.valueOf(employeesRepository.countEmployees(departmentId));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      getSharedGroups(java.lang.Long, boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesGroupsDTO> getSharedGroups(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, boolean isOwner) {
        return employeesGroupsRepositoryCustom.getSharedGroups(employeeId, depOfEmployee, groupOfEmployee, isOwner);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      isExistUserID(java.lang.Long, java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Boolean isExistUserID(Long employeeId, String userId) {
        if (employeeId != null) {
            return (employeesRepository.countExistUserID(employeeId, userId) != 0);
        }
        else {
            return (employeesRepository.countExistUserID(userId) != 0);
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      isExistDepartmentRelation(java.lang.Long, java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Boolean isExistDepartmentRelation(Long employeeId, Long departmentId) {
        return (employeesDepartmentsRepository.countExistDepartmentRelation(employeeId, departmentId) != 0);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      isExistDepartment(java.lang.Long, java.lang.String, java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Boolean isExistDepartment(Long departmentId, String departmentName, Long parentId) {
        return departmentsRepositoryCustom.isExistDepartment(departmentId, departmentName, parentId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     *      getDepartments()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<DepartmentsDTO> getDepartments() {
        List<Departments> listDepartments = departmentsRepository.findAllByOrderByDepartmentOrderAsc();
        return departmentsMapper.toDto(listDepartments);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getPositions(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<PositionsDTO> getPositions() {
        List<Positions> listPositions = positionsRepository.findAllByIsAvailableTrueOrderByPositionOrderAsc();
        List<PositionsDTO> listPositionsDTO = positionsMapper.toDto(listPositions);
        // build position name
        buildPositionList(listPositionsDTO);

        return listPositionsDTO;
    }

    /**
     * build position name
     * 
     * @param listPositionsDTO
     */
    private void buildPositionList(List<PositionsDTO> listPositionsDTO) {
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        if (StringUtils.isBlank(languageCode)) {
            languageCode = Constants.LANGUAGE_CODE_PRIORITY_LIST.get(0);
        }
        final String langCodeFinal = languageCode;
        listPositionsDTO.forEach(position -> {
            Map<String, String> positionNameMap = gson.fromJson(position.getPositionName(),
                    new TypeToken<Map<String, String>>() {}.getType());
            String positionName = positionNameMap.get(langCodeFinal);

            if (StringUtils.isBlank(positionName)) {
                String langCode = Constants.LANGUAGE_CODE_PRIORITY_LIST.stream()
                        .filter(lang -> StringUtils.isNotBlank(positionNameMap.get(lang))).findFirst().orElse("");
                positionName = positionNameMap.get(langCode);
            }
            position.setPositionName(positionName);
        });
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getMyGroups(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesGroupsDTO> getMyGroups(Long employeeId) {
        List<EmployeesGroups> listEmployeesGroups = employeesGroupsRepository.getMyGroups(employeeId);
        return employeesGroupsMapper.toDto(listEmployeesGroups);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getCalculatorFormular(java.lang.Integer)
     */
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong) {
        return employeesRepositoryCustom.getCalculatorFormular(fieldBelong);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getEmployees(List,
     *      List, String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<DownloadEmployeesDTO> getEmployeesForDownload(List<Long> employeeIds, List<KeyValue> orderBy, String langKey) {
        List<DownloadEmployeesDTO> employeesInfo = new ArrayList<>();
        if (StringUtils.isEmpty(langKey)) {
            langKey = jwtTokenUtil.getLanguageKeyFromToken();
        }
        // If list employeeIds null or empty
        if (employeeIds == null || employeeIds.isEmpty()) {
            return employeesInfo;
        }
        List<EmployeesDTO> employees = employeesRepositoryCustom.getEmployeesByEmployeeIds(employeeIds, orderBy).stream()
                .map(selectEmployeesMapper::toDto).collect(Collectors.toList());
        employeesInfo = employeesMapper.toDownloadEmployeesDTO(employees);

        List<Long> employeeIdsResult = employeesInfo.stream().map(DownloadEmployeesDTO::getEmployeeId).collect(Collectors.toList());

        // get department list of employeeId
        List<DownloadDepartmentPositionDTO> listDepartment = employeesRepositoryCustom
                .findDepartmentByEmployeeIds(employeeIdsResult, langKey);
        List<DownloadEmployeeNameDTO> listManager = employeesRepositoryCustom
                .findManagerByEmployeeIds(employeeIdsResult);
        List<DownloadEmployeeNameDTO> listStaff = employeesRepositoryCustom.findEmployeeByManagerIds(employeeIdsResult);

        // map department for employees
        Map<Long, List<DownloadDepartmentPositionDTO>> departmentMap = new HashMap<>();
        listDepartment.stream()
                .forEach(dep -> departmentMap.computeIfAbsent(dep.getTargetId(), key -> new ArrayList<>()).add(dep));
        // map manager for employees
        Map<Long, List<DownloadEmployeeNameDTO>> managerMap = new HashMap<>();
        listManager.stream()
                .forEach(mng -> managerMap.computeIfAbsent(mng.getTargetId(), key -> new ArrayList<>()).add(mng));
        // map staff for employee
        Map<Long, List<DownloadEmployeeNameDTO>> subordinatesMap = new HashMap<>();
        listStaff.stream().forEach(
                staff -> subordinatesMap.computeIfAbsent(staff.getTargetId(), key -> new ArrayList<>()).add(staff));

        // set data for employee
        employeesInfo.stream().forEach(emp -> {
            List<DownloadDepartmentPositionDTO> departments = departmentMap.get(emp.getEmployeeId());
            List<DownloadEmployeeNameDTO> managers = managerMap.get(emp.getEmployeeId());
            List<DownloadEmployeeNameDTO> subordinates = subordinatesMap.get(emp.getEmployeeId());
            emp.setDepartments(departments != null ? departments : new ArrayList<>());
            emp.setEmployeeManagers(managers != null ? managers : new ArrayList<>());
            emp.setEmployeeSubordinates(subordinates != null ? subordinates : new ArrayList<>());
        });
        return employeesInfo;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getEmployees(List,
     *      List, String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesDTO> getEmployees(List<Long> employeeIds, List<KeyValue> orderBy, String langCode) {
        List<EmployeesDTO> employees = new ArrayList<>();
        if (StringUtils.isEmpty(langCode)) {
            langCode = jwtTokenUtil.getLanguageCodeFromToken();
        }
        // If list employeeIds null or empty
        if (employeeIds == null || employeeIds.isEmpty()) {
            return employees;
        }
        employees = employeesRepositoryCustom.getEmployeesByEmployeeIds(employeeIds, orderBy).stream()
                .map(selectEmployeesMapper::toDto).collect(Collectors.toList());
        for (EmployeesDTO employeesDTO : employees) {
            // get department list of employeeId
            List<DepartmentPositionDTO> listDepartment = employeesRepositoryCustom
                    .findDepartmentByEmployeeId(Arrays.asList(employeesDTO.getEmployeeId()), null);
            TypeReference<Map<String, Object>> typeRefMap = new TypeReference<>() {};
            final String language = langCode;
            listDepartment.forEach(dep -> dep.setPositionName(
                    StringUtil.getFieldLabel(dep.getPositionName(), language, objectMapper, typeRefMap)));
            employeesDTO.setDepartments(listDepartment);

            List<EmployeeNameDTO> listManager = employeesRepositoryCustom
                    .findManagerByEmployeeId(employeesDTO.getEmployeeId());
            employeesDTO.setEmployeeManagers(listManager);

            List<EmployeeNameDTO> listStaff = employeesRepositoryCustom
                    .findEmployeeByManagerId(employeesDTO.getEmployeeId());
            employeesDTO.setEmployeeSubordinates(listStaff);
        }
        return employees;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#copyFileToS3(java.lang.String,
     *      java.lang.String, java.lang.String)
     */
    @Override
    public String copyFileToS3(String fileName, String fileExtension, String content) {
        String bucketName = applicationProperties.getUploadBucket();
        String toDay = DateUtil.convertDateToString(new Date(), DateUtil.FORMAT_YYYYMMDD_HHMMSS).replace(" ", "_");
        String keyName = String.format("%s/%s/%s_%s.%s", jwtTokenUtil.getTenantIdFromToken(),
                FieldBelong.EMPLOYEE.name().toLowerCase(), fileName, toDay,
                fileExtension);

        if (!S3CloudStorageClient.putObject(bucketName, keyName,
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)))) {
            throw new CustomRestException(COPY_FILE_ERROR,
                    CommonUtils.putError(COPY_FILE_ERROR, Constants.SAVE_FILE_TO_S3_FAILED));
        }
        return S3CloudStorageClient.generatePresignedURL(bucketName, keyName,
                applicationProperties.getExpiredSeconds());
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getDepartment(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public DepartmentManagerDTO getDepartment(Long departmentId) {
        return departmentsRepositoryCustom.getDepartment(departmentId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#getDepartment(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetParentDepartmentDTO> getParentDepartment(List<Long> departmentIds) {
        return departmentsRepositoryCustom.getParentDepartment(departmentIds);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     * requestChangeDataElasticSearch(java.util.List, java.util.List,
     * java.util.List, java.lang.Integer)
     */
    @Override
    @Transactional
    public Boolean requestChangeDataElasticSearch(List<Long> employeeIds, List<Long> departmentIds, List<Long> groupIds,
            Integer action) {

        boolean hasEmployeeId = false;
        List<Long> dataIds = new ArrayList<>();
        if (employeeIds != null && !employeeIds.isEmpty()) {

            // 1.3. insert employee
            dataIds.addAll(employeeIds);
            hasEmployeeId = true;
        }

        if (action == Constants.ChangeAction.UPDATE.getValue() && departmentIds != null && !departmentIds.isEmpty()) {

            // 1.1. update department
            List<Long> employeeIdsOfDepartment = findEmployeeIdsWithDepartmentIds(departmentIds);
            if (employeeIdsOfDepartment != null && !employeeIdsOfDepartment.isEmpty()) {
                dataIds.addAll(employeeIdsOfDepartment);
            }
        }
        else if (action == Constants.ChangeAction.DELETE.getValue() && groupIds != null && !groupIds.isEmpty()) {

            // 1.5. Delete group
            List<Long> employeeIdsOfGroup = findEmployeeIdsWithGroupIds(groupIds);
            if (employeeIdsOfGroup != null && !employeeIdsOfGroup.isEmpty()) {
                dataIds.addAll(employeeIdsOfGroup);
            }
        }

        if ((action == Constants.ChangeAction.UPDATE.getValue() || action == Constants.ChangeAction.DELETE.getValue())
                && hasEmployeeId) {

            // 1.2. update employee
            // 1.4. Delete group
            List<Long> managerIds = findManagerIdsWithEmployeeIds(employeeIds);
            if (action == Constants.ChangeAction.UPDATE.getValue() && managerIds != null && !managerIds.isEmpty()) {
                dataIds.addAll(managerIds);
            }

            List<Long> staffIds = findEmployeeIdsWithManagerIds(employeeIds);
            if (action == Constants.ChangeAction.UPDATE.getValue() && staffIds != null && !staffIds.isEmpty()) {
                dataIds.addAll(staffIds);
            }
        }
        dataIds.removeIf(Objects::isNull);

        if (!dataIds.isEmpty()) {
            // index Elasticsearch
            if (action == Constants.ChangeAction.INSERT.getValue()
                    || action == Constants.ChangeAction.UPDATE.getValue()) {
                indexElasticsearchService.putIndexElasticsearch(dataIds);
            }
            else if (action == Constants.ChangeAction.DELETE.getValue()) {
                indexElasticsearchService.deleteIndexElasticsearch(dataIds);
            }
        }

        return true;
    }

    /**
     * find EmployeeIds with managerIds
     *
     * @param employeeIds
     *            employeeIds
     * @return list id
     */
    private List<Long> findEmployeeIdsWithManagerIds(List<Long> employeeIds) {
        List<Long> staffIds;
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            staffIds = employeesDepartmentsRepository.findEmployeeIdsWithManagerIds(employeeIds);
        } else {
            staffIds = tmsService.findEmployeeIdsWithManagerIds(employeeIds, TransIDHolder.getTransID());
        }
        return staffIds;
    }

    /**
     * find managerIds
     *
     * @param employeeIds
     *            employeeIds
     * @return managerIds
     */
    private List<Long> findManagerIdsWithEmployeeIds(List<Long> employeeIds) {
        List<Long> managerIds;
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            managerIds = employeesDepartmentsRepository.findManagerIdsWithEmployeeIds(employeeIds);
        } else {
            managerIds = tmsService.findManagerIdsWithEmployeeIds(employeeIds, TransIDHolder.getTransID());
        }
        return managerIds;
    }

    /**
     * findEmployeeIdsWithGroupIds
     *
     * @param groupIds
     *            groupIds
     * @return list ids
     */
    private List<Long> findEmployeeIdsWithGroupIds(List<Long> groupIds) {
        List<Long> employeeIdsOfGroup;
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            employeeIdsOfGroup = employeesGroupMembersRepository.findEmployeeIdsWithGroupIds(groupIds);
        } else {
            employeeIdsOfGroup = tmsService.findEmployeeIdsWithGroupIds(groupIds, TransIDHolder.getTransID());
        }
        return employeeIdsOfGroup;
    }

    /**
     * Find EmployeeIdsWithDepartment
     *
     * @param departmentIds
     *            departmentIds
     * @return list emp id
     */
    private List<Long> findEmployeeIdsWithDepartmentIds(List<Long> departmentIds) {
        List<Long> employeeIdsOfDepartment;
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            employeeIdsOfDepartment = employeesDepartmentsRepository.findEmployeeIdsWithDepartmentIds(departmentIds);
        } else {
            employeeIdsOfDepartment = tmsService.findEmployeeIdsWithDepartmentIds(departmentIds,
                    TransIDHolder.getTransID());
        }
        return employeeIdsOfDepartment;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     * getEmployeesElasticsearch(io.grpc.ManagedChannel,
     * jp.co.softbrain.esales.employees.service.dto.
     * SelectEmployeeElasticsearchInDTO)
     */
    @Override
    public SelectDetailElasticSearchResponse getEmployeesElasticsearch(
            SelectEmployeeElasticsearchInDTO inDto) {

        List<SearchItem> searchConditions = inDto.getSearchConditions();
        List<SearchItem> searchOrConditions = inDto.getSearchOrConditions();
        List<SearchItem> filterConditions = inDto.getFilterConditions();
        String localSearchKeyword = inDto.getLocalSearchKeyword();
        List<OrderValue> orderBy = inDto.getOrderBy();
        Long offset = inDto.getOffset();
        Long limit = inDto.getLimit();

        GetDetailElasticSearchRequest elasticSearchRequest = new GetDetailElasticSearchRequest();

        // set elasticsearch index
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (StringUtil.isEmpty(tenant)) {
            tenant = TenantContextHolder.getTenant();
        }
        elasticSearchRequest.setIndex(String.format(ConstantsEmployees.ELASTICSEARCH_INDEX, tenant));

        // 4.1 build parameter "searchConditons"
        List<SearchConditionDTO> searchConditionsGrpc = new ArrayList<>();
        searchConditionsGrpc.addAll(toListConditionGrpcFromSearchItem(searchConditions,
                Constants.Elasticsearch.Operator.AND.getValue()));

        if (searchOrConditions != null) {
            searchConditionsGrpc.addAll(toListConditionGrpcFromSearchItem(searchOrConditions,
                    Constants.Elasticsearch.Operator.OR.getValue()));
        }

        // 4.2 build parameter "searchOrConditons"
        if (StringUtils.isNotEmpty(localSearchKeyword)) {

            SearchConditionDTO fullNameItem = new SearchConditionDTO();
            fullNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            fullNameItem.setFieldName(ConstantsEmployees.EMPLOYEE_FULL_NAME_FIELD);
            fullNameItem.setFieldValue(localSearchKeyword);
            fullNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            fullNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(fullNameItem);

            SearchConditionDTO fullNameKanaItem = new SearchConditionDTO();
            fullNameKanaItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            fullNameKanaItem.setFieldName(ConstantsEmployees.EMPLOYEE_FULL_NAME_KANA_FIELD);
            fullNameKanaItem.setFieldValue(localSearchKeyword);
            fullNameKanaItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            fullNameKanaItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(fullNameKanaItem);

            SearchConditionDTO telephoneItem = new SearchConditionDTO();
            telephoneItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            telephoneItem.setFieldName(ConstantsEmployees.TELEPHONE_NUMBER_FIELD);
            telephoneItem.setFieldValue(localSearchKeyword);
            telephoneItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            telephoneItem.setSearchType(ConstantsEmployees.SEARCH_LIKE_FIRST);
            telephoneItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(telephoneItem);

            SearchConditionDTO cellphoneItem = new SearchConditionDTO();
            cellphoneItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            cellphoneItem.setFieldName(ConstantsEmployees.CELLPHONE_NUMBER_FIELD);
            cellphoneItem.setFieldValue(localSearchKeyword);
            cellphoneItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            telephoneItem.setSearchType(ConstantsEmployees.SEARCH_LIKE_FIRST);
            cellphoneItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(cellphoneItem);

            SearchConditionDTO departmentNameItem = new SearchConditionDTO();
            departmentNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            departmentNameItem.setFieldName(ConstantsEmployees.DEPARTMENT_NAME_FIELD);
            departmentNameItem.setFieldValue(localSearchKeyword);
            departmentNameItem.setIsNested(true);
            departmentNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            departmentNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(departmentNameItem);

            SearchConditionDTO positionNameItem = new SearchConditionDTO();
            positionNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            positionNameItem.setFieldName(ConstantsEmployees.POSITION_NAME_FIELD);
            positionNameItem.setFieldValue(localSearchKeyword);
            positionNameItem.setIsNested(true);
            positionNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            positionNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(positionNameItem);

            SearchConditionDTO emailItem = new SearchConditionDTO();
            emailItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            emailItem.setFieldName(ConstantsEmployees.EMAIL_FIELD);
            emailItem.setFieldValue(localSearchKeyword);
            emailItem.setIsNested(true);
            emailItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            emailItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
            searchConditionsGrpc.add(emailItem);
        }
        elasticSearchRequest.setSearchConditions(searchConditionsGrpc);

        // filterConditions
        elasticSearchRequest.setFilterConditions(toListConditionGrpcFromSearchItem(
                filterConditions, Constants.Elasticsearch.Operator.AND.getValue()));

        elasticSearchRequest.setOffset(offset == null ? 0 : Math.toIntExact(offset));
        elasticSearchRequest.setLimit(limit == null ? Constants.Elasticsearch.DEFAULT_LIMIT : Math.toIntExact(limit));

        if (orderBy != null) {
            List<OrderValue> elasticsearchOrderBy = new ArrayList<>();
            orderBy.forEach(order -> {
                if (order.getFieldType() != null
                        && order.getFieldType().equals(ConstantsEmployees.SpecialItem.SPECIAL_TYPE)) {
                    return;
                }
                else {
                    elasticsearchOrderBy.add(order);
                }
            });
            elasticSearchRequest.setOrderBy(elasticsearchOrderBy);
        }
        if (StringUtils.isNotBlank(inDto.getColumnId())) {
            elasticSearchRequest.setColumnId(inDto.getColumnId());
        }

        // 4.3 call API
        String token = SecurityUtils.getTokenValue().orElse(null);
        SelectDetailElasticSearchResponse dataElasticSearchResponse = null;
        try {
            dataElasticSearchResponse = restOperationUtils.executeCallApi(
                    Constants.PathEnum.COMMONS, "get-detail-elastic-search", HttpMethod.POST, elasticSearchRequest,
                    SelectDetailElasticSearchResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (RuntimeException e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_DATA_ELASTICSEARCH, e.getLocalizedMessage());
            log.warn(msg);
            throw e;
        }
        return dataElasticSearchResponse;
    }

    /**
     * @param sources
     * @param objectMapper
     * @param fieldOperator
     * @param languageCode
     * @return
     */
    private List<SearchConditionDTO> toListConditionGrpcFromSearchItem(
            List<SearchItem> sources, int fieldOperator) {
        if (sources == null) {
            return new ArrayList<>();
        }
        List<SearchConditionDTO> searchConditions = new ArrayList<>();
        sources.forEach(item -> {
            SearchConditionDTO grpcItem = commonsInfoMapper.toSearchConditionGrpcDto(item);
            grpcItem.setFieldOperator(fieldOperator);
            searchConditions.add(grpcItem);
        });
        return searchConditions;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     * getDataSyncElasticSearch(java.util.List)
     */
    public List<EmployeeElasticsearchDTO> getDataSyncElasticSearch(List<Long> employeeIds) {

        List<EmployeeElasticsearchDTO> employeeList = new ArrayList<>();
        if (employeeIds == null || employeeIds.isEmpty()) {
            return employeeList;
        }

        List<CustomFieldsInfoOutDTO> fieldsList = null;
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
            request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-custom-fields-info", HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null) {
                fieldsList = fieldInfoResponse.getCustomFieldsInfo();
            }

        } catch (RuntimeException e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_FIELD_INFO_ITEM_API_METHOD, e.getMessage());
            log.error(msg);
        }

        final List<CustomFieldsInfoOutDTO> finalFieldsList = fieldsList;
        // @TMS
        List<Employees> employeesList = findAllWithEmployeeIds(employeeIds);

        employeesList.forEach(employee -> {
            EmployeeElasticsearchDTO employeeElasticsearch = employeeInfoMapper.toEmployeeElasticsearch(employee);

            // convert employee_departments
            List<DepartmentPositionDTO> departmentPositionList = findDepartmentWithEmployeeId(employee.getEmployeeId());

            for (DepartmentPositionDTO empDepartments : departmentPositionList) {
                empDepartments.setEmployeeFullName(
                        StringUtil.getFullName(empDepartments.getEmployeeSurName(), empDepartments.getEmployeeName()));
            }
            employeeElasticsearch.setEmployeeDepartments(employeeInfoMapper.toListDepartment(departmentPositionList));

            // convert employee_groups
            List<EmployeesGroupNameDTO> employeesGroupNameList = findGroupWithEmployeeId(employee.getEmployeeId());
            employeeElasticsearch.setEmployeeGroups(employeeInfoMapper.toListGroup(employeesGroupNameList));

            // convert employee_subordinates
            List<EmployeeFullNameDTO> employeeSubordinateList = findStaffWithManagerId(employee.getEmployeeId());
            for (EmployeeFullNameDTO empSusbodinates : employeeSubordinateList) {
                empSusbodinates.setEmployeeFullName(StringUtil.getFullName(empSusbodinates.getEmployeeSurname(),
                        empSusbodinates.getEmployeeName()));
            }
            employeeElasticsearch.setEmployeeSubordinates(employeeInfoMapper.toListSubordinate(employeeSubordinateList));


            // update data for dynamic field
            if (StringUtils.isNotEmpty(employee.getEmployeeData())) {
                try {
                    List<EmployeesDataDTO> employeeDataList = UtilsEmployees.convertEmployeeDataFromString(objectMapper,
                        employee.getEmployeeData(), null, finalFieldsList);
                    employeeElasticsearch.setEmployeeData(employeeInfoMapper.toListEmployeeData(employeeDataList));
                } catch (IOException e) {
                    log.warn(e.getLocalizedMessage());
                }
            }
            employeeList.add(employeeElasticsearch);
        });
        return employeeList;
    }

    /**
     * Find staff with manager id
     *
     * @param employeeId
     *            employeeId
     * @return list dto data
     */
    private List<EmployeeFullNameDTO> findStaffWithManagerId(Long employeeId) {
        // convert employee_subordinates
        List<EmployeeFullNameDTO> employeeSubordinateList;
        if (StringUtils.isEmpty(TransIDHolder.getTransID())) { // @TMS
            employeeSubordinateList = employeesRepository.findStaffWithManagerId(employeeId);
        } else {
                employeeSubordinateList = tmsService.findStaffWithManagerId(employeeId, TransIDHolder.getTransID());
        }
        return employeeSubordinateList;
    }

    /**
     * Find group by employeeId
     *
     * @param employeeId
     *            employeeId
     * @return list DTO response
     */
    private List<EmployeesGroupNameDTO> findGroupWithEmployeeId(Long employeeId) {
        List<EmployeesGroupNameDTO> employeesGroupNameList;
        if (StringUtils.isEmpty(TransIDHolder.getTransID())) { // @TMS
            employeesGroupNameList = employeesGroupsRepository.findGroupWithEmployeeId(employeeId);
        } else {
            employeesGroupNameList = tmsService.findGroupWithEmployeeId(employeeId, TransIDHolder.getTransID());
        }
        return employeesGroupNameList;
    }

    /**
     * find Department with employeeId
     *
     * @param empployeeId
     *            empployeeId
     * @return list DTO resp�ne
     */
    private List<DepartmentPositionDTO> findDepartmentWithEmployeeId(Long empployeeId) {
        List<DepartmentPositionDTO> departmentPositionList;
        if (StringUtils.isEmpty(TransIDHolder.getTransID())) { // @TMS
            departmentPositionList = employeesDepartmentsRepository.findDepartmentWithEmployeeId(empployeeId);
        } else {
                departmentPositionList = tmsService.findDepartmentWithEmployeeId(empployeeId,
                        TransIDHolder.getTransID());
        }
        return departmentPositionList;
    }

    /**
     * Find by id
     *
     * @param employeeIds
     *            list employeeId
     * @return list entity
     */
    private List<Employees> findAllWithEmployeeIds(List<Long> employeeIds) {
        List<Employees> employeesList;
        if (StringUtils.isEmpty(TransIDHolder.getTransID())) {
            employeesList = employeesRepository.findAllWithEmployeeIds(employeeIds);
        } else {
            employeesList = tmsService.findAllWithEmployeeIds(employeeIds, TransIDHolder.getTransID());
        }
        return employeesList;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     * getEmployeeByIds(java.util.List)
     */
    public List<EmployeeInfoDTO> getEmployeeByIds(List<Long> employeeIds) {

        List<EmployeeInfoDTO> employeeList = new ArrayList<>();
        if (employeeIds == null || employeeIds.isEmpty()) {
            employeeIds = new ArrayList<>();
            employeeIds.add(jwtTokenUtil.getEmployeeIdFromToken());
        }

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call api getLanguages
        GetLanguagesResponse responseLanguage = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS, "get-languages", HttpMethod.POST, null,
                GetLanguagesResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        Map<Long, LanguagesDTO> languageMap = new HashMap<>();
        if (responseLanguage != null) {
            responseLanguage.getLanguagesDTOList().forEach(
                    language -> languageMap.put(language.getLanguageId(), language));
        }

        // Call API getTimezones
        GetTimezonesResponse responseTimezone = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS, "get-timezones", HttpMethod.POST, null,
                GetTimezonesResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        Map<Long, TimezonesDTO> timezoneMap = new HashMap<>();
        if (responseTimezone != null) {
            responseTimezone.getTimezones().forEach(
                    timezone -> timezoneMap.put(timezone.getTimezoneId(), timezone));
        }

        List<CustomFieldsInfoOutDTO> fieldsList = null;

        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS, "get-custom-fields-info", HttpMethod.POST, request,
                jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (fieldInfoResponse != null) {
            fieldsList = fieldInfoResponse.getCustomFieldsInfo();
        }

        final List<CustomFieldsInfoOutDTO> finalFieldsList = fieldsList;
        employeesRepository.findAllWithEmployeeIds(employeeIds).forEach(employee -> {
            EmployeeInfoDTO employeeInfo = employeeInfoMapper.toEmployeeInfo(employee);
            EmployeeIconDTO employeeIcon = new EmployeeIconDTO();
            employeeIcon.setFileName(employee.getPhotoFileName());
            employeeIcon.setFilePath(employee.getPhotoFilePath());
            if (!StringUtil.isEmpty(employee.getPhotoFilePath())) {
                employeeIcon
                        .setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                                employee.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
            }
            employeeInfo.setEmployeeIcon(employeeIcon);
            employeeInfo.setEmployeeDepartments(
                    employeesDepartmentsRepository.findDepartmentOfEmployeeId(employee.getEmployeeId()));
            employeeInfo.setEmployeeSubordinates(employeesRepository.findStaffWithManagerId(employee.getEmployeeId()));
            employeeInfo.setEmployeeGroups(employeesGroupsRepository.findGroupWithEmployeeId(employee.getEmployeeId()));
            employeeInfo.setLanguage(languageMap.get(employee.getLanguageId()));
            employeeInfo.setTimezone(timezoneMap.get(employee.getTimezoneId()));

            // update data for dynamic field
            if (StringUtils.isNotEmpty(employee.getEmployeeData())) {
                try {
                    List<EmployeesDataDTO> employeeDataList = UtilsEmployees.convertEmployeeDataFromString(objectMapper,
                            employee.getEmployeeData(), null, finalFieldsList);
                    employeeInfo.setEmployeeData(employeeDataList);
                } catch (IOException e) {
                    log.warn(e.getLocalizedMessage());
                }
            }
            employeeList.add(employeeInfo);
        });
        return employeeList;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#
     * getSelectedOrganizationInfo(java.util.List, java.util.List,
     * java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public SelectedOrganizationInfoOutDTO getSelectedOrganizationInfo(List<Long> employeeIds, List<Long> departmentIds,
            List<Long> groupIds, Long employeeIdLogin) {
        String langCode = jwtTokenUtil.getLanguageCodeFromToken();
        if (employeeIdLogin == null || employeeIdLogin == 0L) {
            employeeIdLogin = jwtTokenUtil.getEmployeeIdFromToken();
        }
        SelectedOrganizationInfoOutDTO response = new SelectedOrganizationInfoOutDTO();
        List<SelectedOrganizationInfoSubType1DTO> listDataEmployeeResponse = new ArrayList<>();
        List<SelectedOrganizationInfoSubType2DTO> listDataDepartmentResponse = new ArrayList<>();
        List<SelectedOrganizationInfoSubType3DTO> listDataGroupResponse = new ArrayList<>();
        List<SelectedOrganizationInfoSubType4DTO> listInfoEmployee = new ArrayList<>();
        List<Long> allEmployeId = new ArrayList<>();
        List<Long> duplicateFilter = new ArrayList<>();
        // 1. Get List of employee information
        if (employeeIds != null && !employeeIds.isEmpty()) {
            getListDataEmployeeResponse(employeeIds, langCode, listDataEmployeeResponse);
        }
        response.setEmployee(listDataEmployeeResponse);
        // 3. Get group information and attached employee ID list
        if (groupIds != null && !groupIds.isEmpty()) {
            getListDataGroupResponse(groupIds, listDataGroupResponse, allEmployeId, employeeIdLogin);
        }
        response.setGroupId(listDataGroupResponse);
        // 2. Get department information and affiliated employee ID list
        if (departmentIds != null && !departmentIds.isEmpty()) {
            getListDataDepartmentResponse(departmentIds, listDataDepartmentResponse, allEmployeId);
        }
        // 4. Get employee information in group or department
        response.setDepartments(listDataDepartmentResponse);
        allEmployeId.sort(null);
        for (Long id : allEmployeId) {
            if (!duplicateFilter.contains(id)) {
                duplicateFilter.add(id);
            }
        }
        for (Long id : duplicateFilter) {
            Employees employeesDTO = employeesRepository.findByEmployeeId(id);
            if (employeesDTO != null) {
                SelectedOrganizationInfoSubType4DTO employeesInfo = new SelectedOrganizationInfoSubType4DTO();
                employeesInfo.setEmployeeId(employeesDTO.getEmployeeId());
                employeesInfo.setEmployeeName(employeesDTO.getEmployeeName());
                employeesInfo.setEmployeeSurname(employeesDTO.getEmployeeSurname());
                employeesInfo.setPhotoFileName(employeesDTO.getPhotoFileName());
                employeesInfo.setPhotoFilePath(employeesDTO.getPhotoFilePath());
                if (employeesDTO.getPhotoFilePath() != null && StringUtils.isNotBlank(employeesDTO.getPhotoFilePath())) {
                    employeesInfo.setPhotoFileUrl(S3CloudStorageClient.generatePresignedURL(
                            applicationProperties.getUploadBucket(), employeesDTO.getPhotoFilePath(),
                            applicationProperties.getExpiredSeconds()));
                }
                listInfoEmployee.add(employeesInfo);
            }
        }
        response.setEmployees(listInfoEmployee);
        return response;
    }

    /**
     * get list info department
     *
     * @param departmentId data need for get list info department
     * @param listDataDepartmentResponse list info department
     * @param allEmployeId All user id in group and department
     */
    private void getListDataDepartmentResponse(List<Long> departmentId,
            List<SelectedOrganizationInfoSubType2DTO> listDataDepartmentResponse, List<Long> allEmployeId) {
        List<DepartmentSelectedOrganizationDTO> listDepartmentSelectedOrganization = employeesRepositoryCustom
                .getDepartmentSelectedOrganization(departmentId);
        HashMap<Long, SelectedOrganizationInfoSubType2DTO> mapData = new HashMap<>();
        if (listDepartmentSelectedOrganization != null && !listDepartmentSelectedOrganization.isEmpty()) {
            for (DepartmentSelectedOrganizationDTO departmentSelectedOrganization : listDepartmentSelectedOrganization) {
                if (!mapData.containsKey(departmentSelectedOrganization.getDepartmentId())) {
                    SelectedOrganizationInfoSubType2DTO dataResponse = new SelectedOrganizationInfoSubType2DTO();
                    dataResponse.setDepartmentId(departmentSelectedOrganization.getDepartmentId());
                    dataResponse.setDepartmentName(departmentSelectedOrganization.getDepartmentName());
                    if (departmentSelectedOrganization.getParentDepartmentId() != null) {
                        SelectedOrganizationInfoSubType6DTO dataParentDepartment = new SelectedOrganizationInfoSubType6DTO();
                        dataParentDepartment.setDepartmentId(departmentSelectedOrganization.getParentDepartmentId());
                        dataParentDepartment
                                .setDepartmentName(departmentSelectedOrganization.getParentDepartmentName());
                        dataResponse.setParentDepartment(dataParentDepartment);
                    }
                    if (departmentSelectedOrganization.getEmployeeId() != null) {
                        List<Long> listEmployeeId = new ArrayList<>();
                        listEmployeeId.add(departmentSelectedOrganization.getEmployeeId());
                        dataResponse.setEmployeeIds(listEmployeeId);
                        allEmployeId.add(departmentSelectedOrganization.getEmployeeId());
                    }
                    mapData.put(departmentSelectedOrganization.getDepartmentId(), dataResponse);
                }
                else {
                    SelectedOrganizationInfoSubType2DTO dataResponse = mapData
                            .get(departmentSelectedOrganization.getDepartmentId());
                    if (departmentSelectedOrganization.getEmployeeId() != null) {
                        List<Long> listEmployeeId = dataResponse.getEmployeeIds();
                        listEmployeeId.add(departmentSelectedOrganization.getEmployeeId());
                        dataResponse.setEmployeeIds(listEmployeeId);
                        allEmployeId.add(departmentSelectedOrganization.getEmployeeId());
                    }
                    mapData.put(departmentSelectedOrganization.getDepartmentId(), dataResponse);
                }
            }
        }
        Collection<SelectedOrganizationInfoSubType2DTO> values = mapData.values();
        listDataDepartmentResponse.addAll(values);
    }

    /**
     * get list info group
     *
     * @param groupId data need for get list info group
     * @param listDataGroupResponse list info group
     * @param allEmployeId All user id in group and department
     */
    private void getListDataGroupResponse(List<Long> groupId,
            List<SelectedOrganizationInfoSubType3DTO> listDataGroupResponse, List<Long> allEmployeId,
            Long employeeIdLogin) {
        List<GroupSelectedOrganizationDTO> listGroupSelectedOrganizationDTO = employeesRepositoryCustom
                .getGroupSelectedOrganization(groupId);
        // Get group by employeeId login
        List<Long> lstGroupIdFromEmployeIdLogin = employeesGroupsRepository.getGroupIdByEmployeeId(employeeIdLogin);
        HashMap<Long, SelectedOrganizationInfoSubType3DTO> mapData = new HashMap<>();
        if (listGroupSelectedOrganizationDTO != null && !listGroupSelectedOrganizationDTO.isEmpty()) {
            for (GroupSelectedOrganizationDTO groupSelectedOrganization : listGroupSelectedOrganizationDTO) {
                if (!mapData.containsKey(groupSelectedOrganization.getGroupId())) {
                    SelectedOrganizationInfoSubType3DTO dataResponse = new SelectedOrganizationInfoSubType3DTO();
                    dataResponse.setGroupId(groupSelectedOrganization.getGroupId());
                    dataResponse.setGroupName(groupSelectedOrganization.getGroupName());
                    // Check groupId exists groups of employeeId login
                    if (groupSelectedOrganization.getEmployeeId() != null && !lstGroupIdFromEmployeIdLogin.isEmpty()
                            && lstGroupIdFromEmployeIdLogin.contains(groupSelectedOrganization.getGroupId())) {
                        List<Long> listEmployeeId = new ArrayList<>();
                        listEmployeeId.add(groupSelectedOrganization.getEmployeeId());
                        dataResponse.setEmployeeIds(listEmployeeId);
                        allEmployeId.add(groupSelectedOrganization.getEmployeeId());
                    }
                    mapData.put(groupSelectedOrganization.getGroupId(), dataResponse);
                } else {
                    SelectedOrganizationInfoSubType3DTO dataResponse = mapData
                            .get(groupSelectedOrganization.getGroupId());
                    // Check groupId exists groups of employeeId login
                    if (groupSelectedOrganization.getEmployeeId() != null && !lstGroupIdFromEmployeIdLogin.isEmpty()
                            && lstGroupIdFromEmployeIdLogin.contains(groupSelectedOrganization.getGroupId())) {
                        List<Long> listEmployeeId = dataResponse.getEmployeeIds();
                        listEmployeeId.add(groupSelectedOrganization.getEmployeeId());
                        dataResponse.setEmployeeIds(listEmployeeId);
                        allEmployeId.add(groupSelectedOrganization.getEmployeeId());
                    }
                    mapData.put(groupSelectedOrganization.getGroupId(), dataResponse);
                }
            }
        }
        Collection<SelectedOrganizationInfoSubType3DTO> values = mapData.values();
        listDataGroupResponse.addAll(values);
    }

    /**
     * get list info employee
     *
     * @param employeeId data need for get list info employee
     * @param langCode user language
     * @param listDataEmployeeResponse list info employee
     */
    private void getListDataEmployeeResponse(List<Long> employeeId, String langCode,
            List<SelectedOrganizationInfoSubType1DTO> listDataEmployeeResponse) {
        List<EmployeeSelectedOrganizationDTO> listEmployeeSelectedOrganization = employeesRepositoryCustom
                .getEmployeeSelectedOrganization(employeeId, langCode);
        HashMap<Long, SelectedOrganizationInfoSubType1DTO> mapData = new HashMap<>();
        if (listEmployeeSelectedOrganization != null && !listEmployeeSelectedOrganization.isEmpty()) {
            for (EmployeeSelectedOrganizationDTO employeeSelectedOrganization : listEmployeeSelectedOrganization) {
                if (!mapData.containsKey(employeeSelectedOrganization.getEmployeeId())) {
                    SelectedOrganizationInfoSubType1DTO dataResponse = new SelectedOrganizationInfoSubType1DTO();
                    dataResponse.setEmployeeId(employeeSelectedOrganization.getEmployeeId());
                    dataResponse.setEmployeeName(employeeSelectedOrganization.getEmployeeName());
                    dataResponse.setPhotoFileName(employeeSelectedOrganization.getPhotoFileName());
                    dataResponse.setPhotoFilePath(employeeSelectedOrganization.getPhotoFilePath());
                    if (StringUtils.isNotBlank(employeeSelectedOrganization.getPhotoFilePath())) {
                        dataResponse.setPhotoFileUrl(S3CloudStorageClient.generatePresignedURL(
                                applicationProperties.getUploadBucket(), employeeSelectedOrganization.getPhotoFilePath(),
                                applicationProperties.getExpiredSeconds()));
                    }
                    dataResponse.setEmployeeSurname(employeeSelectedOrganization.getEmployeeSurname());
                    if (employeeSelectedOrganization.getDepartmentId() != null) {
                        SelectedOrganizationInfoSubType5DTO departmentPositionData = new SelectedOrganizationInfoSubType5DTO();
                        departmentPositionData.setDepartmentId(employeeSelectedOrganization.getDepartmentId());
                        departmentPositionData.setDepartmentName(employeeSelectedOrganization.getDepartmentName());
                        departmentPositionData.setPositionId(employeeSelectedOrganization.getPositionId());
                        departmentPositionData.setPositionName(employeeSelectedOrganization.getPositionName());
                        List<SelectedOrganizationInfoSubType5DTO> listDepartmentPositionData = new ArrayList<>();
                        listDepartmentPositionData.add(departmentPositionData);
                        dataResponse.setDepartments(listDepartmentPositionData);
                    }
                    mapData.put(employeeSelectedOrganization.getEmployeeId(), dataResponse);
                }
                else {
                    SelectedOrganizationInfoSubType1DTO dataResponse = mapData
                            .get(employeeSelectedOrganization.getEmployeeId());
                    if (employeeSelectedOrganization.getDepartmentId() != null) {
                        List<SelectedOrganizationInfoSubType5DTO> listDepartmentPositionData = dataResponse
                                .getDepartments();
                        SelectedOrganizationInfoSubType5DTO departmentPositionData = new SelectedOrganizationInfoSubType5DTO();
                        departmentPositionData.setDepartmentId(employeeSelectedOrganization.getDepartmentId());
                        departmentPositionData.setDepartmentName(employeeSelectedOrganization.getDepartmentName());
                        departmentPositionData.setPositionId(employeeSelectedOrganization.getPositionId());
                        departmentPositionData.setPositionName(
                                getNameByLangCode(employeeSelectedOrganization.getPositionName(), langCode));
                        listDepartmentPositionData.add(departmentPositionData);
                        dataResponse.setDepartments(listDepartmentPositionData);
                    }
                    mapData.put(dataResponse.getEmployeeId(), dataResponse);
                }
            }
        }
        Collection<SelectedOrganizationInfoSubType1DTO> values = mapData.values();
        listDataEmployeeResponse.addAll(values);
    }

    /**
     * json string label data
     *
     * @param stringJsonB
     * @return string by langCode
     */
    private String getNameByLangCode(String stringJsonB, String langCode) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
        if (StringUtils.isNotBlank(stringJsonB)) {
            try {
                Map<String, Object> jsonObject;
                jsonObject = mapper.readValue(stringJsonB, typeRef);
                if (jsonObject.get(langCode) != null) {
                    return (String) jsonObject.get(langCode);
                }
            } catch (IOException e) {
                return stringJsonB;
            }
        }
        return stringJsonB;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#
     * getDataByRecordIds(java.util.List, java.util.List)
     */
    @Override
    public GetDataByRecordIdsOutDTO getDataByRecordIds(List<Long> recordIds, List<GetDataByRecordIdsInDTO> fieldInfo, Long employeeIdLogin) {
        if (recordIds == null || recordIds.isEmpty()) {
            throw new CustomRestException("Param [recordIds] is not null",CommonUtils.putError(ConstantsEmployees.PARAM_RECORD_IDS,
                    Constants.RIQUIRED_CODE));
        }
        if (fieldInfo == null || fieldInfo.isEmpty()) {
            throw new CustomRestException("Param [fieldInfo] is not null", CommonUtils.putError(ConstantsEmployees.PARAM_FIELD_INFO,
                    Constants.RIQUIRED_CODE));
        }
        GetDataByRecordIdsOutDTO response = new GetDataByRecordIdsOutDTO();
        List<Long> departmentIds = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();
        List<Long> employeeIds = new ArrayList<>();
        List<CustomFieldsItemResponseDTO> lstFieldItem = new ArrayList<>();
        List<Employees> employeeList = new ArrayList<>();
        List<Long> relationIds = new ArrayList<>();
        recordIds.forEach(id -> {
            Employees employee = employeesRepository.findByEmployeeId(id);
            if (employee != null) {
                employeeList.add(employee);
            }
        });
        Map<Integer, Map<Long, List<GetDataByRecordIdsSubType2DTO>>> relationRequestsMap = new HashMap<>();
        Map<Long, List<GetDataByRecordIdsSubType2DTO>> relationMap = new HashMap<>();
        List<CalculatorFormularDTO> calculatorFormular = employeesRepositoryCustom
                .getAllCalculatorFormular(FieldBelongEnum.EMPLOYEE.getCode());
        for (int i = 0; i < employeeList.size(); i++) {
            Employees employee = employeeList.get(i);
            GetDataByRecordIdsSubType1DTO record = new GetDataByRecordIdsSubType1DTO();
            record.setRecordId(employee.getEmployeeId());
            Map<String, Object> dynamicDataMap = null;
            for (int j = 0; j < fieldInfo.size(); j++) {
                GetDataByRecordIdsInDTO field = fieldInfo.get(j);
                GetDataByRecordIdsSubType2DTO dataInfo = new GetDataByRecordIdsSubType2DTO();
                dataInfo.setFieldId(field.getFieldId());
                dataInfo.setFieldName(field.getFieldName());
                dataInfo.setFieldType(field.getFieldType());
                dataInfo.setIsDefault(field.getIsDefault());
                if (field.getIsDefault() != null && field.getIsDefault().booleanValue()) {
                    dataInfo.setValue(ReflectionUtils.getAttrAsString(Employees.class, employee,CommonUtils.snakeToCamel(field.getFieldName(), false)));
                } else {
                    if (dynamicDataMap == null) {
                        dynamicDataMap = RelationUtil.dynamicDataStringToMap(employee.getEmployeeData(), objectMapper);
                    }
                    Object value = dynamicDataMap.get(field.getFieldName());
                    if (value != null) {
                        if (value instanceof String) {
                            dataInfo.setValue(StringUtil.safeCastToString(dynamicDataMap.get(field.getFieldName())));
                        } else {
                            try {
                                dataInfo.setValue(objectMapper.writeValueAsString(value));
                            } catch (JsonProcessingException e) {
                                log.error(e.getLocalizedMessage());
                            }
                        }
                    }
                }
                if (FieldTypeEnum.RELATION.getCode().equals(StringUtil.safeCastToString(field.getFieldType()))) {
                    List<GetDataByRecordIdsSubType2DTO> dataInfoWithSameRelation = relationMap.get(field.getFieldId());
                    if (dataInfoWithSameRelation == null) {
                        dataInfoWithSameRelation = new ArrayList<>();
                    }
                    relationIds.add(field.getRelationData().getFieldId());
                    dataInfo.setRelationData(field.getRelationData());
                    dataInfo.setRecordId(employee.getEmployeeId());
                    dataInfoWithSameRelation.add(dataInfo);
                    relationMap.put(field.getFieldId(), dataInfoWithSameRelation);
                } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(dataInfo.getFieldType().toString())) {
                    getEmployeeDepartmentGroup(dataInfo, departmentIds, employeeIds, groupIds);
                } else if (FieldTypeEnum.CALCULATION.getCode().equals(dataInfo.getFieldType().toString())
                        && calculatorFormular != null) {
                    for (int k = 0; k < calculatorFormular.size(); k++) {
                        CalculatorFormularDTO formular = calculatorFormular.get(k);
                        if (formular.getFieldName().equals(field.getFieldName())
                                && StringUtils.isNotBlank(formular.getConfigValue())) {
                            dataInfo.setValue(employeesRepositoryCustom.getCalculation(formular.getConfigValue(),
                                    employee.getEmployeeId()));
                        }
                    }
                } else if (FieldTypeEnum.FILE.getCode().equals(dataInfo.getFieldType().toString()) && StringUtils.isNotBlank(dataInfo.getValue())) {
                    List<FileInfosDTO> fileInfo = S3FileUtil.insertFileUrl(dataInfo.getValue(), objectMapper,
                            applicationProperties.getUploadBucket(), applicationProperties.getExpiredSeconds());
                    if(fileInfo != null && !fileInfo.isEmpty()) {
                        try {
                            dataInfo.setValue(objectMapper.writeValueAsString(fileInfo));
                        } catch (JsonProcessingException e) {
                            log.error(e.getLocalizedMessage());
                        }
                    }
                }
                record.getDataInfos().add(dataInfo);
            }
            response.getRelationData().add(record);
        }
        String token = SecurityUtils.getTokenValue().orElse(null);
        if (!relationMap.isEmpty()) {
            GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
            request.setFieldIds(relationIds);
            List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null) {
                fieldsList = fieldInfoResponse.getCustomFieldsInfo();
            }
            fieldsList.forEach(f -> lstFieldItem.addAll(f.getFieldItems()));
            Map<Long, CustomFieldsInfoOutDTO> fieldMapById = fieldsList.stream().collect(Collectors.toMap(CustomFieldsInfoOutDTO::getFieldId, f -> f));

            for (Map.Entry<Long, List<GetDataByRecordIdsSubType2DTO>> relations : relationMap.entrySet()) {
                relations.getValue().forEach(relationParent -> {
                    CustomFieldsInfoOutDTO fieldOfRelation = fieldMapById.get(relationParent.getRelationData().getFieldId());
                    if (fieldOfRelation != null) {
                        Map<Long, List<GetDataByRecordIdsSubType2DTO>> dataInfoWithSameRelationService;
                        dataInfoWithSameRelationService = relationRequestsMap.get(fieldOfRelation.getFieldBelong());
                        if (dataInfoWithSameRelationService == null) {
                            dataInfoWithSameRelationService = new HashMap<>();
                            relationRequestsMap.put(fieldOfRelation.getFieldBelong(), dataInfoWithSameRelationService);
                        }
                        dataInfoWithSameRelationService.put(relations.getKey(), relations.getValue());
                    }
                });

            }
            if (!relationRequestsMap.isEmpty()) {
                for (Map.Entry<Integer, Map<Long, List<GetDataByRecordIdsSubType2DTO>>> mapOfSameFieldId : relationRequestsMap
                        .entrySet()) {
                    GetDataByRecordIdsOutDTO relationResponse = getRelationRecordIds(mapOfSameFieldId.getKey(), mapOfSameFieldId.getValue(), fieldMapById, employeeIdLogin);
                    if (relationResponse != null) {
                        getRelationResponse(relationResponse, mapOfSameFieldId.getValue());
                    }
                }
            }
        } else {
            GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
            request.setFieldIds(fieldInfo.stream().map(GetDataByRecordIdsInDTO::getFieldId).collect(Collectors.toList()));
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null && fieldInfoResponse.getCustomFieldsInfo() != null) {
                List<CustomFieldsInfoOutDTO> fields = fieldInfoResponse.getCustomFieldsInfo();
                fields.forEach(f -> {
                    if (f.getFieldItems() != null) {
                        lstFieldItem.addAll(f.getFieldItems());
                        }
                    });
            }
        }
        response.getFieldItems().addAll(dataByRecordIdsMapper.toSubType3(lstFieldItem));
        if (!departmentIds.isEmpty() || !employeeIds.isEmpty() || !groupIds.isEmpty()) {
            SelectedOrganizationInfoOutDTO oranizationResponse = getSelectedOrganizationInfo(employeeIds, departmentIds,
                    groupIds, employeeIdLogin);
            if (oranizationResponse != null) {
                response.setDepartments(oranizationResponse.getDepartments());
                response.setEmployee(oranizationResponse.getEmployee());
                response.setEmployees(oranizationResponse.getEmployees());
                response.setGroupId(oranizationResponse.getGroupId());
            }
        }
        return response;
    }

    /**
     * get relation datas from the same service
     *
     * @param relationRequestsMap request map
     * @return relation data from the same service
     */
    private GetDataByRecordIdsOutDTO getRelationRecordIds(Integer fieldBelong,
            Map<Long, List<GetDataByRecordIdsSubType2DTO>> mapOfSameFieldId, Map<Long, CustomFieldsInfoOutDTO> fieldMapById, Long employeeIdLogin) {
        TypeReference<List<Long>> typeRef = new TypeReference<>() {};

        List<GetDataByRecordIdsInDTO> fieldInfo = new ArrayList<>();
        List<Long> recordIds = new ArrayList<>();
        for (Map.Entry<Long, List<GetDataByRecordIdsSubType2DTO>> mapOfSameRecordId : mapOfSameFieldId.entrySet()) {
            mapOfSameRecordId.getValue().forEach(record -> {
                List<Long> ids = null;
                try {
                    ids = objectMapper.readValue(record.getValue(), typeRef);
                } catch (IOException e) {
                    ids = new ArrayList<>();
                }
                ids.forEach(id -> {
                    if (!recordIds.contains(id)) {
                        recordIds.add(id);
                    }
                    Boolean duplicated = false;
                    for (int i = 0; i < fieldInfo.size(); i++) {
                        if (fieldInfo.get(i).getFieldId().equals(record.getFieldId())) {
                            duplicated = true;
                            break;
                        }
                    }
                    if (!duplicated) {
                        CustomFieldsInfoOutDTO fieldToGet = fieldMapById.get(record.getRelationData().getFieldId());

                        GetDataByRecordIdsInDTO fieldInfoRequest = new GetDataByRecordIdsInDTO();
                        fieldInfoRequest.setFieldId(fieldToGet.getFieldId());
                        fieldInfoRequest.setFieldName(fieldToGet.getFieldName());
                        fieldInfoRequest.setFieldType(fieldToGet.getFieldType());
                        fieldInfoRequest.setIsDefault(fieldToGet.getIsDefault());
                        fieldInfo.add(fieldInfoRequest);
                    }
                });
            });
        }
        if (FieldBelongEnum.EMPLOYEE.getCode().equals(fieldBelong)) {
            return this.getDataByRecordIds(recordIds, fieldInfo, employeeIdLogin);
        } else {
            String token = SecurityUtils.getTokenValue().orElse(null);
            return RelationUtil.getDataByRecordIds(restOperationUtils, recordIds, fieldInfo, fieldBelong, token, jwtTokenUtil.getTenantIdFromToken());
        }
    }

    /**
     * get data from recursive API call into response
     *
     * @param response response from recursive call
     * @param mapOfSameFieldId map of relation field
     */
    private void getRelationResponse(GetDataByRecordIdsOutDTO response,
            Map<Long, List<GetDataByRecordIdsSubType2DTO>> mapOfSameFieldId) {
        if (response.getRelationData() != null && !response.getRelationData().isEmpty()) {
            TypeReference<List<Long>> typeRef = new TypeReference<>() {};
            for (Map.Entry<Long, List<GetDataByRecordIdsSubType2DTO>> mapOfSameRecordId : mapOfSameFieldId.entrySet()) {
                mapOfSameRecordId.getValue().forEach(relation -> response.getRelationData().forEach(res -> {
                    List<Long> ids = null;
                    try {
                        ids = objectMapper.readValue(relation.getValue(), typeRef);
                    } catch (IOException e) {
                        ids = new ArrayList<>();
                    }

                    if (ids.contains(res.getRecordId())) {
                        relation.getChildrenRelationDatas().add(res);
                    }
                })
                );
            }
        }
    }

    /**
     * Get list employeId, departmentId and groupId
     *
     * @param dataInfo
     */
    private void getEmployeeDepartmentGroup(GetDataByRecordIdsSubType2DTO dataInfo, List<Long> departmentIds,
            List<Long> employeeIds, List<Long> groupIds) {
        String dynamicData = dataInfo.getValue();
        if (!StringUtil.isEmpty(dynamicData)) {
            List<Map<String, Object>> dataList = new ArrayList<>();
            try {
                TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {};
                dataList = objectMapper.readValue(dynamicData, listTypeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }

            dataList.forEach(data -> {
                Object departmentObj = data.get(Constants.FIELD_NAME_DEPARTMENT_ID);
                Object employeeObj = data.get(Constants.FIELD_NAME_EMPLOYEE_ID);
                Object groupObj = data.get(Constants.FIELD_NAME_GROUP_ID);

                if (departmentObj != null) {
                    departmentIds.add(Long.valueOf(departmentObj.toString()));
                }
                if (employeeObj != null) {
                    employeeIds.add(Long.valueOf(employeeObj.toString()));
                }
                if (groupObj != null) {
                    groupIds.add(Long.valueOf(groupObj.toString()));
                }
            });
        }
    }

    /**
     * Get list or group with only owner
     *
     * @param fieldName
     * @param fieldValue
     */
    @Override
    public List<GetOrganizationGroupDTO> getListOrGroupWithOnlyOneOwner(String fieldName, Long fieldValue) {
        List<GetOrganizationGroupDTO> getOrganizationGroupDTOS = new ArrayList<>();
        try {
            if (ObjectUtils.isEmpty(fieldName)) {
                return getOrganizationGroupDTOS;
            }
            if (ObjectUtils.isEmpty(fieldValue)) {
                return getOrganizationGroupDTOS;
            }
            if (GROUP_ID_FIELD.equals(fieldName)) {
                fieldName = PARTICIPANT_GROUP_ID_FIELD;
            }
            getOrganizationGroupDTOS = employeesRepositoryCustom.getListOrGroupWithOnlyOneOwner(fieldName, fieldValue);
        } catch (Exception ex){
            log.warn(ex.getLocalizedMessage());
        }
        return getOrganizationGroupDTOS;
    }
}
