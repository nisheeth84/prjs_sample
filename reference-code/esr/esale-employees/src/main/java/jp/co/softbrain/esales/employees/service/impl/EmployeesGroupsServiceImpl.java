package jp.co.softbrain.esales.employees.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupMembersRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupParticipantsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupSearchConditionsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.CustomFieldInfoResponseWrapperDTO;
import jp.co.softbrain.esales.employees.service.dto.CustomFieldItemResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsGroupsMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupAndGroupMemberDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupSubType3DTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeIconDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupAutoUpdateDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupInDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupParticipantsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupSearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;
import jp.co.softbrain.esales.employees.service.dto.GetFullEmployeesByParticipantResponse;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupsSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.GetParticipantDataByIdsResponse;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.LookupDataDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.SearchValueTypeDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GeneralSettingDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetGeneralSettingRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.RelationDataDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.mapper.CustomFieldInfoResponseWrapperGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesGroupsMapper;
import jp.co.softbrain.esales.employees.service.mapper.ItemReflectGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.LookupDataGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.RelationDataGrpcMapper;
import jp.co.softbrain.esales.employees.tenant.util.EmployeesCommonUtil;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.util.ChannelUtils;
import jp.co.softbrain.esales.employees.web.rest.GetEmployeesResource;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetEmployeesRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RefreshAutoGroupResponse;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service Implementation for managing {@link EmployeesGroups}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesGroupsServiceImpl implements EmployeesGroupsService {

    Logger log = LoggerFactory.getLogger(EmployeesGroupsServiceImpl.class);
    private static final Boolean IS_OWNER = true;
    private static final String ITEM_VALUE_INVALID = "Item's value is invalid";
    private static final String INSERT_DATA_CHANGE_FAILED = "Insert data change failed";
    private static final String VALIDATE_FAIL = "Validate failded.";
    private static final String URL_API_VALIDATE = "validate";

    @Autowired
    private GetEmployeesResource getEmployeesResource;

    @Autowired
    private final EmployeesGroupsRepository employeesGroupsRepository;


    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private EmployeesGroupSearchConditionsRepository employeesGroupSearchConditionRepository;

    @Autowired
    private EmployeesGroupMembersRepository employeesGroupMembersRepository;

    @Autowired
    private EmployeesGroupParticipantsRepository employeesGroupParticipantRepository;

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private final EmployeesCommonService employeesCommonService;

    @Autowired
    private EmployeesGroupMembersService employeesGroupMembersService;

    @Autowired
    private final EmployeesGroupsMapper employeesGroupsMapper;

    @Autowired
    private CustomFieldInfoResponseWrapperGrpcMapper customFieldInfoResponseWrapperGrpcMapper;

    @Autowired
    private LookupDataGrpcMapper lookupDataGrpcMapper;

    @Autowired
    private ItemReflectGrpcMapper itemReflectGrpcMapper;

    @Autowired
    private RelationDataGrpcMapper relationDataGrpcMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private EmployeesGroupParticipantsService employeesGroupParticipantsService;

    @Autowired
    private EmployeesGroupsService employeesGroupsService;

    @Autowired
    private EmployeesDepartmentsRepository employeesDepartmentsRepository;

    @Autowired
    private EmployeesGroupsRepositoryCustom employeesGroupsRepositoryCustom;

    Gson gson = new Gson();

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeesGroupSearchConditionsService employeesGroupSearchConditionsService;

    @Autowired
    private ChannelUtils channelUtils;

    public EmployeesGroupsServiceImpl(EmployeesGroupsRepository employeesGroupsRepository,
            EmployeesGroupsMapper employeesGroupsMapper, EmployeesCommonService employeesCommonService) {
        this.employeesGroupsRepository = employeesGroupsRepository;
        this.employeesGroupsMapper = employeesGroupsMapper;
        this.employeesCommonService = employeesCommonService;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO)
     */
    @Override
    public EmployeesGroupsDTO save(EmployeesGroupsDTO employeesGroupsDTO) {
        EmployeesGroups employeesGroups = employeesGroupsMapper.toEntity(employeesGroupsDTO);
        employeesGroups = employeesGroupsRepository.save(employeesGroups);
        return employeesGroupsMapper.toDto(employeesGroups);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<EmployeesGroupsDTO> findAll(Pageable pageable) {
        return employeesGroupsRepository.findAll(pageable).map(employeesGroupsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesGroupsDTO> findOne(Long id) {
        EmployeesGroups entity = employeesGroupsRepository.findByGroupId(id);
        if (entity != null) {
            return Optional.of(entity).map(employeesGroupsMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getGroupByConditions(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetGroupByNameDTO> getGroupByConditions(String conditions, Map<String, Object> parameters) {
        return employeesGroupsRepositoryCustom.getGroupByConditions(conditions, parameters);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesGroupsRepository.deleteById(id);
    }

    /**
     * @see EmployeesGroupsService#refreshAutoGroup(java.lang.Long)
     */
    @Override
    @Transactional
    public RefreshAutoGroupResponse refreshAutoGroup(Long idOfList) {
        RefreshAutoGroupResponse responseAPI = new RefreshAutoGroupResponse();
        // Get employeeId from token
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1. Validate parameters
        validateParameterRefreshAutoGroup(idOfList);

        // 2. Get group information
        List<EmployeesGroupAutoUpdateDTO> groupInformationList = employeesGroupsRepositoryCustom
                .findGroupInformationByGroupId(idOfList);
        // 3. Checking for validity.
        if (groupInformationList.isEmpty() || !Boolean.TRUE.equals(groupInformationList.get(0).getIsAutoGroup())) {
            throw new CustomRestException("Group invalid. Not auto group!",
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, ConstantsEmployees.NOT_GROUP_INFOMATION));
        }
        // 4. Search Employee information
        // a. Call API getCustomFieldsInfo
        GetCustomFieldsInfoRequest getCustomFieldsInfoRequest = new GetCustomFieldsInfoRequest();
        getCustomFieldsInfoRequest.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        CommonFieldInfoResponse getCustomFieldsInfo = channelUtils
                .callAPIGetCustomFieldInfo(getCustomFieldsInfoRequest);
        List<CustomFieldsInfoOutDTO> fieldsInfoList = getCustomFieldsInfo.getCustomFieldsInfo();

        // b. Create search conditions
        // b.make search_condiontions
        List<SearchItem> searchConditions = createSearchItem(fieldsInfoList, groupInformationList);
        log.debug("**************************listItem: {}", searchConditions);

        List<EmployeeInfoDTO> listEmployees = getEmployeesInfo(searchConditions);

        List<Long> employeeIdsChange = new ArrayList<>();
        List<Long> newEmployeeIdList = listEmployees.stream().map(EmployeeInfoDTO::getEmployeeId)
                .collect(Collectors.toList());
        boolean isOverWritte = Boolean.TRUE.equals(groupInformationList.get(0).getIsOverWrite());

        // 5. Update information group members
        fillEmployeesData(idOfList, isOverWritte, employeeIdsChange, newEmployeeIdList);

        // b. Insert member
        if (!newEmployeeIdList.isEmpty()) {
            insertEmployeesMember(idOfList, userId, listEmployees);
        }

        // 6. Update last_updated_date
        employeesGroupsService.findOne(idOfList).ifPresent(employeesGroup -> {
            employeesGroup.setLastUpdatedDate(Instant.now());
            employeesGroup.setUpdatedUser(userId);
            employeesGroupsService.save(employeesGroup);
        });

        // return if no id change
        if (employeeIdsChange.isEmpty()) {
            return responseAPI;
        }

        // 7. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIdsChange, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        return responseAPI;
    }

    /**
     * @param idOfList
     * @param employeeId
     * @param listEmployees
     */
    private void insertEmployeesMember(Long idOfList, Long employeeId, List<EmployeeInfoDTO> listEmployees) {
        List<EmployeesGroupMembersDTO> employeesGroupMemberDTOList = new ArrayList<>();
        listEmployees.forEach(employeesDTO -> {
            EmployeesGroupMembersDTO employeesGroupMembersDTO = new EmployeesGroupMembersDTO();
            employeesGroupMembersDTO.setGroupId(idOfList);
            employeesGroupMembersDTO.setEmployeeId(employeesDTO.getEmployeeId());
            employeesGroupMembersDTO.setCreatedUser(employeeId);
            employeesGroupMembersDTO.setUpdatedUser(employeeId);
            employeesGroupMemberDTOList.add(employeesGroupMembersDTO);
        });
        log.debug("****************************employeesGroupMemberDTOList: {}", employeesGroupMemberDTOList);
        employeesGroupMembersService.saveAll(employeesGroupMemberDTOList);
    }

    /**
     * @param idOfList
     * @param isOverWritte
     * @param employeeIds
     * @param employeeIds
     * @param newEmployeeIdList
     */
    private void fillEmployeesData(Long idOfList, boolean isOverWritte, List<Long> employeeIds,
            List<Long> newEmployeeIdList) {
        if (isOverWritte) {
            // get list id member old
            List<Long> oldEmployeeIdsList = employeesGroupMembersRepository
                    .findEmployeeIdsWithGroupIds(Arrays.asList(idOfList));
            // delete old member
            employeesGroupMembersRepository.deleteByGroupId(idOfList);
            oldEmployeeIdsList.removeIf(newEmployeeIdList::contains);
            employeeIds.addAll(oldEmployeeIdsList);
        } else {
            employeesGroupMembersRepository.deleteByGroupIdAndEmployeeIdIn(idOfList, newEmployeeIdList);
        }
        employeeIds.addAll(newEmployeeIdList);
    }

    /**
     * @param fieldsInfoList
     * @param groupInformationList
     * @return
     */
    private List<SearchItem> createSearchItem(List<CustomFieldsInfoOutDTO> fieldsInfoList, List<EmployeesGroupAutoUpdateDTO> groupInformationList) {
        List<SearchItem> searchConditions = new ArrayList<>();
        for (EmployeesGroupAutoUpdateDTO information : groupInformationList) {
            CustomFieldsInfoOutDTO field = fieldsInfoList.stream()
                .filter(f -> f.getFieldId().equals(information.getFieldId())).findAny().orElse(null);
            if (field == null) {
                continue;
            }
            SearchItem searchCondtion = new SearchItem();
            searchCondtion.setFieldId(field.getFieldId());
            searchCondtion.setFieldType(field.getFieldType());
            searchCondtion.setIsDefault(String.valueOf(field.getIsDefault()));
            searchCondtion.setTimeZoneOffset(information.getTimeZoneOffset());
            searchCondtion.setSearchType(
                information.getSearchType() == null ? "" : String.valueOf(information.getSearchType()));
            searchCondtion.setSearchOption(
                information.getSearchOption() == null ? "" : String.valueOf(information.getSearchOption()));

            searchCondtion.setFieldName(field.getFieldName());
            if (CommonUtils.isTextType(field.getFieldType())) {
                searchCondtion
                    .setFieldName(
                        searchCondtion.getFieldName().concat(ConstantsEmployees.SEARCH_KEYWORD_TYPE));
            }
            if (Boolean.FALSE.equals(field.getIsDefault())) {
                searchCondtion.setFieldName(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA
                    .concat(ConstantsEmployees.PERIOD)
                    .concat(searchCondtion.getFieldName().replace(ConstantsEmployees.DOT_KEYWORD, "")));
            }

            buildSearchValueForSearchItem(field, searchCondtion, information.getSearchValue());

            searchConditions.add(searchCondtion);
        }
        log.debug("**************searchConditions: {}", searchConditions);
        return searchConditions;
    }

    /**
     * build search value for search item
     *
     * @param field
     * @param searchItem
     * @param searchValue
     * @return
     */
    private void buildSearchValueForSearchItem(CustomFieldsInfoOutDTO field, SearchItem searchItem, String searchValue) {
        log.debug("***********************searchValue: {}", searchValue);
        if (org.apache.commons.lang.StringUtils.isBlank(searchValue)) {
            searchItem.setFieldValue("");
            return;
        }
        // for normal field
        if (!FieldTypeEnum.RELATION.getCode().equals(String.valueOf(field.getFieldType()))) {
            searchItem.setFieldValue(searchValue);
            return;
        }

        // for relation field
        // get id from realtion service
        List<Long> listIdRelation = getIdsFromRelationService(field, searchValue);
        if (listIdRelation.isEmpty()) {
            listIdRelation.add(ConstantsEmployees.LONG_VALUE_0L);
        }
        log.debug("****************listIdRelation: {}", listIdRelation);
        searchItem.setFieldValue(listIdRelation.toString());
        log.debug("**********searchItem : {}", searchItem);
    }

    /**
     * getIdsFromRelationService
     *
     * @param field - field
     * @param searchValue - search value
     * @return list id from relation data
     */
    private List<Long> getIdsFromRelationService(CustomFieldsInfoOutDTO field, String searchValue) {

        TypeReference<List<SearchItem>> listType = new TypeReference<>() {};

        List<SearchItem> listConditions = new ArrayList<>();

        // get list searchItem
        try {
            listConditions.addAll(objectMapper.readValue(searchValue, listType));
        } catch (Exception e) {
            log.debug("Parse Json failed, causeBy: {}", e.getLocalizedMessage());
        }
        RelationDataDTO relationData = field.getRelationData();
        if (relationData == null || relationData.getFieldBelong() == null) {
            return new ArrayList<>();
        }
        log.debug("*********************listConditions : {}", listConditions);

        if (FieldBelongEnum.ACTIVITY.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromActivities(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.BUSINESS_CARD.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromBusinessCards(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.CUSTOMER.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromCustomers(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.EMPLOYEE.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromEmployees(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.PRODUCT.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromProducts(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.TASK.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromTasks(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.TRADING_PRODUCT.getCode().equals(relationData.getFieldBelong())) {
            return EmployeesCommonUtil.getIdsRelationFromSales(listConditions, restOperationUtils);
        }

        return new ArrayList<>();
    }

    /**
     * Get employee info by id
     *
     * @param listItem
     *        list created user id
     * @return list Employee Info
     */
    private List<EmployeeInfoDTO> getEmployeesInfo(List<SearchItem> listItem) {
        if (listItem.isEmpty())
            return new ArrayList<>();

        // Get Employees
        GetEmployeesRequest getEmployeesRequest = new GetEmployeesRequest();
        getEmployeesRequest.setSearchConditions(listItem);
        getEmployeesRequest.setSelectedTargetType(0);
        getEmployeesRequest.setSelectedTargetId(0L);
        GetEmployeeResponse employeeResponse = getEmployeesResource.getEmployees(getEmployeesRequest).getBody();
        if (employeeResponse == null || employeeResponse.getEmployees() == null
                || employeeResponse.getEmployees().isEmpty()) {
            return new ArrayList<>();
        }

        return employeeResponse.getEmployees();
    }

    /**
     * validateParameterRefreshAutoGroup
     * 
     * @param idOfList - id of list to validate
     */
    private void validateParameterRefreshAutoGroup(Long idOfList) {
        if (idOfList == null) {
            throw new CustomRestException("Param [idOfList] is not null.",
                    CommonUtils.putError(ConstantsEmployees.ID_OF_LIST, Constants.RIQUIRED_CODE));
        }
        // Validate common check [idOfList] is number not negative.
        EmployeesGroupMembersDTO groupMemberDTO = new EmployeesGroupMembersDTO();
        groupMemberDTO.setGroupId(idOfList);

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = jsonBuilder.convertObject(groupMemberDTO);
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, URL_API_VALIDATE,
                HttpMethod.POST, validateRequest, ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException("Param [idOfList] is number not negative.",
                    CommonUtils.putError(ConstantsEmployees.ID_OF_LIST, Constants.NUMBER_NOT_NEGATIVE));
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getInitializeGroupModalInfo(java.lang.Long,
     *      java.lang.Boolean, java.lang.Boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeGroupModalOutDTO getInitializeGroupModalInfo(Long groupId, Boolean isOwnerGroup,
            Boolean isAutoGroup) {
        InitializeGroupModalOutDTO responseDTO = new InitializeGroupModalOutDTO();
        List<EmployeesGroupsDTO> groups = new ArrayList<>();
        EmployeesGroupsDTO empGroupDto = null;

        // Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1. Validate parameters
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.GROUP_ID, (Object) groupId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, URL_API_VALIDATE,
                HttpMethod.POST, validateRequest, ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }

        if (groupId != null) {
            // 2. Get Information Group
            Optional<EmployeesGroupsDTO> empGroup = this.findOne(groupId);
            if (empGroup.isPresent()) {
                empGroupDto = empGroup.get();
                responseDTO.setGroup(empGroupDto);
                // 3. Get Info Search Condition Group
                responseDTO.setSearchConditions(this.getGroupSearchConditions(groupId, empGroupDto.getIsAutoGroup()));
                // 4. Get Info participants Group
                responseDTO.setGroupParticipants(this.getGroupParticipants(groupId, empGroupDto.getGroupType()));
                responseDTO = createParticipantData(responseDTO);
            }
        }

        // get group and department of employeeId
        List<Long> groupIds = new ArrayList<>();
        List<Long> departmentIds = new ArrayList<>();

        GetGroupAndDepartmentByEmployeeIdsOutDTO groupDepOut = employeesService
                .getGroupAndDepartmentByEmployeeIds(Arrays.asList(employeeId));

        if (groupDepOut != null && !CollectionUtils.isEmpty(groupDepOut.getEmployees())) {
            groupDepOut.getEmployees().forEach(emp -> {
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    departmentIds.addAll(emp.getDepartmentIds());
                }
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    groupIds.addAll(emp.getGroupIds());
                }
            });
        }

        // . Get my group and share group owner
        if (Boolean.TRUE.equals(isOwnerGroup)) {
            // a. Call getMyGroups
            List<EmployeesGroupsDTO> listGroups = employeesCommonService.getMyGroups(employeeId);
            groups.addAll(listGroups);
            // b. Call getSharedGroups
            listGroups = employeesCommonService.getSharedGroups(employeeId, departmentIds, groupIds, IS_OWNER);
            groups.addAll(listGroups);
            Collections.sort(groups,
                    (eGroup1, eGroup2) -> eGroup1.getDisplayOrder().compareTo(eGroup2.getDisplayOrder()));
        }
        responseDTO.setGroups(groups);

        if ((empGroupDto != null && Boolean.TRUE.equals(empGroupDto.getIsAutoGroup()))
                || Boolean.TRUE.equals(isAutoGroup)) {
            GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
            request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-custom-fields-info", HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            List<CustomFieldsInfoOutDTO> customFieldsInfo = new ArrayList<>();
            if (fieldInfoResponse != null) {
                customFieldsInfo = fieldInfoResponse.getCustomFieldsInfo();
            }
            List<CustomFieldInfoResponseWrapperDTO> customFields = new ArrayList<>();
            customFieldsInfo.forEach(fields -> customFields.add(this.getCustomFieldInfo(fields)));
            responseDTO.setCustomFields(customFields);
        }
        // 7. Get time auto update
        if (Boolean.TRUE.equals(isAutoGroup)) {
            GetGeneralSettingRequest request = new GetGeneralSettingRequest();
            request.setSettingName("list_update_time");
            GeneralSettingDTO generalSettingDTO = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-general-setting", HttpMethod.POST, request, GeneralSettingDTO.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (generalSettingDTO != null) {
                responseDTO.setListUpdateTime(generalSettingDTO.getSettingValue());
            }
        }
        return responseDTO;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getParticipantDataByIds(List,
     *      List, List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetParticipantDataByIdsResponse getParticipantDataByIds(List<Long> participantEmployeeIds,
            List<Long> participantDepartmentIds, List<Long> participantGroupIds) {
        GetParticipantDataByIdsResponse getParticipantDataByIdsResponse = new GetParticipantDataByIdsResponse();

        // build employee participant
        if (!participantEmployeeIds.isEmpty()) {
            getParticipantDataByIdsResponse.setParticipantEmployees(buildEmployeesParticipant(participantEmployeeIds));
        }

        // build department participant
        if (!participantDepartmentIds.isEmpty()) {
            getParticipantDataByIdsResponse
                    .setParticipantDepartments(buildDepartmentsParticipant(participantDepartmentIds));
        }

        // build group participant
        if (!participantGroupIds.isEmpty()) {
            getParticipantDataByIdsResponse.setParticipantGroups(buildGroupsParticipant(participantGroupIds));
        }
        return getParticipantDataByIdsResponse;
    }

    /**
     * buildEmployeesParticipant
     * 
     * @param participantEmployeeIds - id of employees
     * @return list participant type employee
     */
    private List<ParticipantEmployeesDTO> buildEmployeesParticipant(List<Long> participantEmployeeIds) {
        String langKey = jwtTokenUtil.getLanguageCodeFromToken();
        List<InitializeGroupModalSubType2DTO> empInformations = employeesRepositoryCustom
                .getEmployeesByEmployeesIds(participantEmployeeIds, langKey);

        // build list response
        List<ParticipantEmployeesDTO> participantEmployees = new ArrayList<>();

        for (InitializeGroupModalSubType2DTO empInformation : empInformations) {
            ParticipantEmployeesDTO participantEmployee = new ParticipantEmployeesDTO();
            participantEmployee.setEmployeeId(empInformation.getEmployeeId());
            participantEmployee.setEmployeeSurname(empInformation.getEmployeeSurname());
            participantEmployee.setEmployeeName(empInformation.getEmployeeName());
            participantEmployee.setDepartmentName(empInformation.getDepartmentName());
            participantEmployee.setPositionId(empInformation.getPositionId());
            participantEmployee.setPositionName(empInformation.getPositionName());

            // build employee Icon
            EmployeeIconDTO empIcon = new EmployeeIconDTO();
            empIcon.setFileName(empInformation.getPhotoFileName());
            empIcon.setFilePath(empInformation.getPhotoFilePath());
            if (!StringUtil.isEmpty(empInformation.getPhotoFilePath())) {
                empIcon.setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        empInformation.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
                participantEmployee.setEmployeeIcon(empIcon);
            }

            participantEmployees.add(participantEmployee);
        }
        return participantEmployees;
    }

    /**
     * buildDepartmentsParticipant
     * 
     * @param participantDepartmentIds - id of department
     * @return list participant type department
     */
    private List<ParticipantDepartmentDTO> buildDepartmentsParticipant(List<Long> participantDepartmentIds) {
        List<ParticipantDepartmentDTO> departmentsList = departmentsRepositoryCustom
                .getDepartmentsByDepartmentIds(participantDepartmentIds);
        if (departmentsList.isEmpty()) {
            return departmentsList;
        }

        // get member for department
        List<DepartmentsGroupsMembersDTO> listAllMember = employeesRepositoryCustom
                .getListMemberByOrganizationInfo(participantDepartmentIds, 0);
        if (listAllMember.isEmpty()) {
            return departmentsList;
        }
        // build icon for each employee
        buildIconLogoForeachEmployee(listAllMember);
        departmentsList.forEach(dep -> {
            List<DepartmentsGroupsMembersDTO> listMemberDepartment = listAllMember.stream()
                    .filter(emp -> dep.getDepartmentId().equals(emp.getOrgId())).collect(Collectors.toList());
            dep.setEmployeesDepartments(listMemberDepartment);
        });

        return departmentsList;
    }

    /**
     * buildIconLogoForeachEmployee
     * 
     * @param listAllMember
     */
    private void buildIconLogoForeachEmployee(List<DepartmentsGroupsMembersDTO> listEmployee) {
        listEmployee.forEach(emp -> {
            if (StringUtils.isNotBlank(emp.getPhotoFilePath())) {
                emp.setPhotoFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        emp.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
            }
        });

    }

    /**
     * buildGroupsParticipant
     * 
     * @param participantGroupIds - id of groups
     * @return list participant type group
     */
    private List<ParticipantGroupsDTO> buildGroupsParticipant(List<Long> participantGroupIds) {
        List<EmployeesGroupsDTO> groupListFromDAO = employeesGroupsRepositoryCustom
                .getGroupByGroupParticipant(participantGroupIds);
        if (groupListFromDAO.isEmpty()) {
            return new ArrayList<>();
        }

        List<ParticipantGroupsDTO> groupList = employeesGroupsMapper.toListGroupParticipant(groupListFromDAO);

        // get member for groups
        List<DepartmentsGroupsMembersDTO> listAllMember = employeesRepositoryCustom
                .getListMemberByOrganizationInfo(participantGroupIds, 1);
        if (listAllMember.isEmpty()) {
            return groupList;
        }
        // build icon for each employee
        buildIconLogoForeachEmployee(listAllMember);
        groupList.forEach(group -> {
            List<DepartmentsGroupsMembersDTO> listMemberGroup = listAllMember.stream()
                    .filter(emp -> group.getGroupId().equals(emp.getOrgId())).collect(Collectors.toList());
            group.setEmployeesGroups(listMemberGroup);
        });

        return groupList;
    }

    /**
     * Create participant employees
     *
     * @param responseDTO
     * @return InitializeGroupModalOutDTO
     */
    private InitializeGroupModalOutDTO createParticipantData(InitializeGroupModalOutDTO responseDTO) {
        List<Long> empIds = new ArrayList<>();
        List<Long> depIds = new ArrayList<>();
        List<Long> participantGroupIds = new ArrayList<>();

        for (EmployeesGroupParticipantsDTO empGroupParticipant : responseDTO.getGroupParticipants()) {
            if (empGroupParticipant.getEmployeeId() != null) {
                empIds.add(empGroupParticipant.getEmployeeId());
            }
            if (empGroupParticipant.getDepartmentId() != null) {
                depIds.add(empGroupParticipant.getDepartmentId());
            }
            if (empGroupParticipant.getParticipantGroupId() != null) {
                participantGroupIds.add(empGroupParticipant.getParticipantGroupId());
            }
        }

        GetParticipantDataByIdsResponse getParticipantDataByIdsResponse = getParticipantDataByIds(empIds, depIds,
                participantGroupIds);
        responseDTO.setParticipantEmployees(getParticipantDataByIdsResponse.getParticipantEmployees());
        responseDTO.setParticipantDepartments(getParticipantDataByIdsResponse.getParticipantDepartments());
        responseDTO.setParticipantGroups(getParticipantDataByIdsResponse.getParticipantGroups());
        return responseDTO;
    }

    /**
     * get Fields
     *
     * @param fields
     * @return
     */
    private CustomFieldInfoResponseWrapperDTO getCustomFieldInfo(CustomFieldsInfoOutDTO fields) {
        CustomFieldInfoResponseWrapperDTO customFieldInfoResponseWrapperDTO = customFieldInfoResponseWrapperGrpcMapper
                .toDto(fields);
        Optional.ofNullable(fields.getLookupData()).ifPresent(lData -> {
            LookupDataDTO lookupData = lookupDataGrpcMapper.toDTOWithoutItemReflect(lData);
            lookupData.setItemReflect(itemReflectGrpcMapper.toDto(lData.getItemReflect()));
            customFieldInfoResponseWrapperDTO.setLookupData(lookupData);
        });
        customFieldInfoResponseWrapperDTO.setRelationData(relationDataGrpcMapper.toDto(fields.getRelationData()));
        customFieldInfoResponseWrapperDTO.setTabData(fields.getTabData());
        List<CustomFieldsItemResponseDTO> fieldItems = fields.getFieldItems();
        List<CustomFieldItemResponseDTO> customFieldItems = this.getCustomFieldItemResponseDTO(fieldItems);
        customFieldInfoResponseWrapperDTO.setFieldItems(customFieldItems);
        return customFieldInfoResponseWrapperDTO;
    }

    /**
     * get list FieldItems
     *
     * @param fieldItems
     * @return
     */
    private List<CustomFieldItemResponseDTO> getCustomFieldItemResponseDTO(
            List<CustomFieldsItemResponseDTO> fieldItems) {
        List<CustomFieldItemResponseDTO> customFieldItems = new ArrayList<>();
        fieldItems.forEach(fieldItem -> {
            CustomFieldItemResponseDTO customFieldItem = new CustomFieldItemResponseDTO();
            customFieldItem.setItemId(fieldItem.getItemId());
            customFieldItem.setIsAvailable(fieldItem.getIsAvailable());
            customFieldItem.setItemOrder(fieldItem.getItemOrder());
            customFieldItem.setIsDefault(fieldItem.getIsDefault());
            customFieldItem.setItemLabel(fieldItem.getItemLabel());

            customFieldItems.add(customFieldItem);
        });
        return customFieldItems;
    }

    /**
     * Get Info Search Condition Group
     *
     * @param groupId
     *            the groupId of the entity
     * @param isAutoGroup
     *            isAutoGroup
     * @return list of the EmployeesGroupSearchConditionsDTO
     */
    private List<EmployeesGroupSearchConditionsDTO> getGroupSearchConditions(Long groupId, Boolean isAutoGroup) {
        List<EmployeesGroupSearchConditionsDTO> listGroupSearchConditions = new ArrayList<>();
        if (Boolean.TRUE.equals(isAutoGroup)) {
            listGroupSearchConditions = employeesGroupSearchConditionsService.getGroupSearchConditions(groupId);
        }
        return listGroupSearchConditions;
    }

    /**
     * get info participants group
     *
     * @param groupId
     *            the groupId of the entity
     * @param groupType
     *            groupType
     * @return list of the EmployeesGroupParticipantsDTO
     */
    private List<EmployeesGroupParticipantsDTO> getGroupParticipants(Long groupId, Integer groupType) {
        List<EmployeesGroupParticipantsDTO> groupParticipants = new ArrayList<>();
        if (groupType.equals(ConstantsEmployees.SHARED_GROUP)) {
            groupParticipants = employeesGroupParticipantsService.getGroupParticipants(groupId);
        }
        return groupParticipants;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#createGroup(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupInDTO)
     */
    @Override
    @Transactional
    public Long createGroup(EmployeesGroupInDTO groupParams) {
        // Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1. Validate parameters api createGroup
        this.createGroupValidateParameters(groupParams);

        // 2.1 Insert employees_groups
        EmployeesGroupsDTO employeesGroupsDTO = this.insertEmployeesGroups(groupParams, employeeId);
        Long groupId = employeesGroupsDTO.getGroupId();

        if (groupParams.getGroupType().equals(ConstantsEmployees.MY_GROUP)) {
            // 2.2 Insert employees_group_participants (in case of creating my
            // group)
            insertEmployeesGroupParticipantsDTO(groupId, null);
        }

        if (groupParams.getGroupType().equals(ConstantsEmployees.SHARED_GROUP)) {

            // 3. Insert employees_group_participants (in case of creating
            // shared group)
            insertEmployeesGroupParticipantsDTO(groupId, groupParams.getGroupParticipants());
        }
        if (groupParams.getGroupMembers() != null && !groupParams.getGroupMembers().isEmpty()) {
            // 4. insert employee_group_member (in case of creating a group with
            // n records)
            insertEmployeesGroupMembers(groupParams.getGroupMembers(), groupId, employeeId);
        }

        if (groupParams.getSearchConditions() != null && Boolean.TRUE.equals(groupParams.getIsAutoGroup())) {
            // 5. Insert employees_group_search_conditions
            insertEmployeesGroupSearchConditions(groupParams.getSearchConditions(), groupId, employeeId);
        }

        // 6. request create data for ElasticSearch
        if (groupParams.getGroupMembers() != null && !groupParams.getGroupMembers().isEmpty()) {
            List<Long> employeeIds = new ArrayList<>();
            groupParams.getGroupMembers().forEach(groupMember -> employeeIds.add(groupMember.getEmployeeId()));
            if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                    Constants.ChangeAction.UPDATE.getValue()))) {
                throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                        CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
            }
        }

        return groupId;
    }

    /**
     * Validate parameters api createGroup
     *
     * @param groupParams
     *            the information group
     */
    private void createGroupValidateParameters(EmployeesGroupInDTO groupParams) {
        List<Map<String, Object>> errors = validateGroupParameter(groupParams);

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.GROUP_PARTICIPANT, groupParams.getGroupParticipants());
        fixedParams.put("groupMembers", groupParams.getGroupMembers());
        fixedParams.put(ConstantsEmployees.GROUP_TYPE, groupParams.getGroupType());
        fixedParams.put(ConstantsEmployees.GROUP_NAME, groupParams.getGroupName());
        String validateJson = jsonBuilder.build(Constants.FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        errors.addAll(validateCommons(validateJson));

        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * Validate parameters api updateGroup
     *
     * @param groupParams
     *            the information group
     * @return the list of Map<String, Object>
     */
    private List<Map<String, Object>> validateGroupParameter(EmployeesGroupInDTO groupParams) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (StringUtils.isEmpty(groupParams.getGroupName())) {
            errors.add(CommonUtils.putError(ConstantsEmployees.GROUP_NAME, Constants.RIQUIRED_CODE));
        }
        if (groupParams.getGroupType() == null) {
            errors.add(CommonUtils.putError(ConstantsEmployees.GROUP_TYPE, Constants.RIQUIRED_CODE));
        }
        if (groupParams.getIsAutoGroup() == null) {
            errors.add(CommonUtils.putError(ConstantsEmployees.IS_AUTO_GROUP, Constants.RIQUIRED_CODE));
        } else if (Boolean.TRUE
                .equals(groupParams.getIsAutoGroup() && CollectionUtils.isEmpty(groupParams.getSearchConditions()))) {
            errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_CONDITION,
                    ConstantsEmployees.CONDITION_GROUP_AUTO_NOT_EXIST));
        }

        errors.addAll(this.validateParamaterSearchConditions(groupParams.getSearchConditions()));

        if (!ConstantsEmployees.SHARED_GROUP.equals(groupParams.getGroupType())) {
            return errors;
        }

        if (groupParams.getGroupParticipants() == null || groupParams.getGroupParticipants().isEmpty()) {
            errors.add(CommonUtils.putError(ConstantsEmployees.GROUP_PARTICIPANT, Constants.RIQUIRED_CODE));
        }

        List<EmployeeGroupSubType1DTO> groupParticipants = groupParams.getGroupParticipants();
        if (groupParticipants != null) {
            // Check exist member is owner
            boolean itemExists = groupParticipants.stream()
                    .anyMatch(gp -> gp.getParticipantType().equals(ConstantsEmployees.MEMBER_TYPE_OWNER));
            if (!itemExists) {
                errors.add(CommonUtils.putError(ConstantsEmployees.GROUP_PARTICIPANT, Constants.AT_LEAST_1_IS_OWNER));
            }
            int index = 0;
            for (EmployeeGroupSubType1DTO groupParticipant : groupParams.getGroupParticipants()) {
                if (groupParticipant.getEmployeeId() == null && groupParticipant.getDepartmentId() == null
                        && groupParticipant.getParticipantGroupId() == null) {
                    errors.add(CommonUtils.putError("employeeId/ departmentId/ participantGroupId",
                            Constants.RIQUIRED_CODE, index));
                }
                index++;
            }
        }
        return errors;
    }

    /**
     * Get the last order employeesGroups by displayOrder.
     *
     * @return The last order employeesGroups
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesGroupsDTO> getLastOrderGroup() {
        return employeesGroupsRepository.findFirstByDisplayOrderNotNullOrderByDisplayOrderDesc()
                .map(employeesGroupsMapper::toDto);
    }

    /**
     * Insert a record employees_groups
     *
     * @param groupParams
     *            the information group
     * @param employeeId
     *            the id of employee login
     * @return the entity of EmployeesGroupsDTO
     */
    private EmployeesGroupsDTO insertEmployeesGroups(EmployeesGroupInDTO groupParams, Long employeeId) {
        EmployeesGroupsDTO employeesGroupsDTO = new EmployeesGroupsDTO();
        employeesGroupsDTO.setCreatedUser(employeeId);
        employeesGroupsDTO.setGroupName(groupParams.getGroupName());
        employeesGroupsDTO.setGroupType(groupParams.getGroupType());
        employeesGroupsDTO.setIsAutoGroup(groupParams.getIsAutoGroup());
        employeesGroupsDTO.setIsOverWrite(groupParams.getIsOverWrite());
        Optional<EmployeesGroupsDTO> dto = getLastOrderGroup();
        if (!dto.isEmpty()) {
            employeesGroupsDTO.setDisplayOrder(dto.get().getDisplayOrder() + 1);
        } else {
            employeesGroupsDTO.setDisplayOrder(1);
        }
        employeesGroupsDTO.setUpdatedUser(employeeId);
        return employeesGroupsService.save(employeesGroupsDTO);
    }

    /**
     * create a object of EmployeesGroupParticipantsDTO
     *
     * @param groupId
     *        the groupId of the entity
     * @param employeeId
     *        the id of employee login
     * @param groupParticipantsList
     *        the information Group Participant
     */
    private void insertEmployeesGroupParticipantsDTO(Long groupId,
            List<EmployeeGroupSubType1DTO> groupParticipantsList) {
        List<EmployeesGroupParticipantsDTO> employeesGroupParticipantsDTOList = new ArrayList<>();

        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        // create default if list null
        if (CollectionUtils.isEmpty(groupParticipantsList)) {
            EmployeesGroupParticipantsDTO employeesGroupParticipantsDTO = new EmployeesGroupParticipantsDTO();
            employeesGroupParticipantsDTO.setGroupId(groupId);
            employeesGroupParticipantsDTO.setEmployeeId(userId);
            employeesGroupParticipantsDTO.setParticipantType(ConstantsEmployees.MEMBER_TYPE_OWNER);
            employeesGroupParticipantsDTO.setCreatedUser(userId);
            employeesGroupParticipantsDTO.setUpdatedUser(userId);
            employeesGroupParticipantsDTOList.add(employeesGroupParticipantsDTO);
        } else {
            groupParticipantsList.forEach(groupParticipants -> {
                EmployeesGroupParticipantsDTO employeesGroupParticipantsDTO = new EmployeesGroupParticipantsDTO();
                employeesGroupParticipantsDTO.setGroupId(groupId);
                employeesGroupParticipantsDTO.setEmployeeId(groupParticipants.getEmployeeId());
                employeesGroupParticipantsDTO.setDepartmentId(groupParticipants.getDepartmentId());
                employeesGroupParticipantsDTO.setParticipantGroupId(groupParticipants.getParticipantGroupId());
                employeesGroupParticipantsDTO.setParticipantType(groupParticipants.getParticipantType());
                employeesGroupParticipantsDTO.setCreatedUser(userId);
                employeesGroupParticipantsDTO.setUpdatedUser(userId);
                employeesGroupParticipantsDTOList.add(employeesGroupParticipantsDTO);
            });
        }

        if (!employeesGroupParticipantsDTOList.isEmpty()) {
            employeesGroupParticipantsService.saveAll(employeesGroupParticipantsDTOList);
        }
    }

    /**
     * Insert list employees_group_members
     *
     * @param groupMembers
     *            the information Group Members
     * @param groupId
     *            the groupId of the entity
     * @param employeeId
     *            the id of employee login
     */
    private void insertEmployeesGroupMembers(List<EmployeeGroupSubType3DTO> groupMembers, Long groupId,
            Long employeeId) {
        List<EmployeesGroupMembersDTO> employeesGroupMembersDTOList = new ArrayList<>();
        for (EmployeeGroupSubType3DTO item : groupMembers) {
            if (item.getEmployeeId() != null) {
                EmployeesGroupMembersDTO employeesGroupMembersDTO = new EmployeesGroupMembersDTO();
                employeesGroupMembersDTO.setGroupId(groupId);
                employeesGroupMembersDTO.setEmployeeId(item.getEmployeeId());
                employeesGroupMembersDTO.setCreatedUser(employeeId);
                employeesGroupMembersDTO.setUpdatedUser(employeeId);
                employeesGroupMembersDTOList.add(employeesGroupMembersDTO);
            }
        }
        if (!employeesGroupMembersDTOList.isEmpty()) {
            employeesGroupMembersService.saveAll(employeesGroupMembersDTOList);
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#updateGroup(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupInDTO)
     */
    @Override
    @Transactional
    public Long updateGroup(EmployeesGroupInDTO groupParams) {
        // 0. Get employeeId from token
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1. Validate parameters api updateGroup
        this.updateGroupValidateParameters(groupParams);

        String groupNameOld = "";
        // 2. Update data employees_groups
        Optional<EmployeesGroupsDTO> employeesGroups = this.findOne(groupParams.getGroupId());
        if (employeesGroups.isPresent()) {
            EmployeesGroupsDTO employeesGroupsDTO = employeesGroups.get();
            groupNameOld = employeesGroupsDTO.getGroupName();
            employeesGroupsDTO.setGroupName(groupParams.getGroupName());
            employeesGroupsDTO.setGroupType(groupParams.getGroupType());
            employeesGroupsDTO.setIsAutoGroup(groupParams.getIsAutoGroup());
            employeesGroupsDTO.setIsOverWrite(groupParams.getIsOverWrite());
            employeesGroupsDTO.setUpdatedUser(userId);
            this.save(employeesGroupsDTO);
        } else {
            throw new CustomRestException("error-exclusive",
                    CommonUtils.putError("employeesGroups", Constants.EXCLUSIVE_CODE));
        }

        if (groupParams.getGroupType().equals(ConstantsEmployees.SHARED_GROUP)) {
            // 3. Update employees_group_participants with condition group_type
            // = 2
            updateEmployeesGroupParticipants(groupParams);
        }

        if (Boolean.TRUE.equals(groupParams.getIsAutoGroup())) {
            // 4. Update employees_group_search_conditions witch condition
            // is_auto_group = true
            updateEmployeesGroupSearchConditions(groupParams, userId);
        }

        // 5. request create data for ElasticSearch
        if (!checkSameName(groupNameOld, groupParams.getGroupName())) {
            List<Long> groupIds = new ArrayList<>();
            groupIds.add(groupParams.getGroupId());
            if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(null, null, groupIds,
                    Constants.ChangeAction.UPDATE.getValue()))) {
                throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                        CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
            }
        }

        return groupParams.getGroupId();
    }

    /**
     * Check change name
     *
     * @param nameOld
     *            name before update
     * @param nameParam
     *            name after update
     * @return true if same , false if not same
     */
    private boolean checkSameName(String nameOld, String nameParam) {
        boolean result = false;
        if ((nameOld == null && nameParam == null) || (nameOld != null && nameOld.equals(nameParam))) {
            result = true;
        }
        return result;
    }

    /**
     * Validate parameters api updateGroup
     *
     * @param groupParams
     *            the information group
     */
    private void updateGroupValidateParameters(EmployeesGroupInDTO groupParams) {
        List<Map<String, Object>> errors = validateGroupParameter(groupParams);
        if (groupParams.getGroupId() == null) {
            errors.add(CommonUtils.putError(ConstantsEmployees.GROUP_ID, Constants.RIQUIRED_CODE));
        }

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.GROUP_PARTICIPANT, groupParams.getGroupParticipants());
        fixedParams.put(ConstantsEmployees.GROUP_TYPE, groupParams.getGroupType());
        fixedParams.put(ConstantsEmployees.GROUP_NAME, groupParams.getGroupName());
        String validateJson = jsonBuilder.build(Constants.FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        errors.addAll(validateCommons(validateJson));

        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * Update group validate parameter
     *
     * @param validateJson
     * @return
     */
    private List<Map<String, Object>> validateCommons(String validateJson) {

        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateRequest validateRequest = new ValidateRequest();
        validateRequest.setRequestData(validateJson);
        // Validate commons
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, URL_API_VALIDATE,
                HttpMethod.POST, validateRequest, ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }

        return response.getErrors();
    }

    /**
     * validate array searchConditions
     *
     * @param searchConditions
     *            list group Participants
     * @return the list of Map<String, Object>
     */
    private List<Map<String, Object>> validateParamaterSearchConditions(
            List<EmployeeGroupSubType2DTO> searchConditions) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (searchConditions == null) {
            return errors;
        }
        int index = 0;
        for (EmployeeGroupSubType2DTO employeeGroupSubType2 : searchConditions) {
            if (employeeGroupSubType2.getFieldId() != null
                    && employeeGroupSubType2.getFieldId() <= ConstantsEmployees.NUMBER_ZERO) {
                errors.add(CommonUtils.putError(ConstantsEmployees.FIELD_ID, Constants.NUMBER_NOT_NEGATIVE, index));
            }
            if (employeeGroupSubType2.getSearchOption() != null
                    && employeeGroupSubType2.getSearchOption() <= ConstantsEmployees.NUMBER_ZERO) {
                errors.add(
                        CommonUtils.putError(ConstantsEmployees.SEARCH_OPTION, Constants.NUMBER_NOT_NEGATIVE, index));
            }
            if (employeeGroupSubType2.getSearchType() != null
                    && employeeGroupSubType2.getSearchType() <= ConstantsEmployees.NUMBER_ZERO) {
                errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_TYPE, Constants.NUMBER_NOT_NEGATIVE, index));
            }

            index++;
        }
        return errors;
    }


    /**
     * validate parameter searchValue
     *
     * @param fieldType
     *            fieldType
     * @param searchValueTypeDTO
     *            the entity of searchValueTypeDTO
     * @param rowId
     *            rowId
     * @return the list of Map<String, Object>
     */
    public List<Map<String, Object>> validateParameterSearchValue(String fieldType,
            SearchValueTypeDTO searchValueTypeDTO, Integer rowId) {
        List<Map<String, Object>> errors = new ArrayList<>();

        if (FieldTypeEnum.DATE.getCode().equals(fieldType)) {
            if (isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_YEAR_MONTH_SLASH)
                    || isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH)
                    || isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_YEAR_MONTH_DAY_HYPHEN)
                    || isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_MMDD)) {
                // do no thing
            } else {
                errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_VALUE, Constants.DATE_INVALID_CODE, rowId));
            }
        } else if (FieldTypeEnum.DATETIME.getCode().equals(fieldType)) {
            if (isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_YEAR_MONTH_DAY_SEC_SLASH)
                    || isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_YEAR_MONTH_DAY_SEC_HYPHEN)) {
                // do no thing
            } else {
                errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_VALUE, Constants.DATE_INVALID_CODE, rowId));
            }
        } else if (FieldTypeEnum.TIME.getCode().equals(fieldType)
                && !(isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_HOUR_MINUTE)
                        || isDateFormat(searchValueTypeDTO.getValue(), DateUtil.FORMAT_HOUR_MINUTE_SECOND))) {
            errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_VALUE, Constants.TIME_INVALID_CODE, rowId));
        } else if ((FieldTypeEnum.NUMBER.getCode().equals(fieldType)
                && !searchValueTypeDTO.getValue().matches(ConstantsEmployees.REGEX_INTEGER))
                && !(searchValueTypeDTO.getValue().matches(ConstantsEmployees.REGEX_DECIMAL))) {
            errors.add(CommonUtils.putError(ConstantsEmployees.SEARCH_VALUE, Constants.NUMBER_INVALID_CODE, rowId));
        }

        return errors;
    }

    /**
     * check validate Datetime
     *
     * @param target
     * @param formatter
     * @return
     */
    private boolean isDateFormat(String target, String formatter) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        Date parseDate = null;
        boolean result = true;
        try {
            parseDate = sdf.parse(target);
            if (!target.equals(sdf.format(parseDate))) {
                result = false;
            }
        } catch (ParseException e) {
            result = false;
        }
        return result;
    }

    /**
     * Update employees_group_members
     *
     * @param groupParams
     *            the information group
     * @param employeeId
     *            the employeeId of employee login
     */
    private void updateEmployeesGroupParticipants(EmployeesGroupInDTO groupParams) {
        employeesGroupParticipantsService.deleteByGroupId(groupParams.getGroupId());
        this.insertEmployeesGroupParticipantsDTO(groupParams.getGroupId(), groupParams.getGroupParticipants());
    }

    /**
     * Update employees_group_search_conditions
     *
     * @param groupParams
     *            the information group
     * @param employeeId
     *            employeeId the employeeId of employee login
     */
    private void updateEmployeesGroupSearchConditions(EmployeesGroupInDTO groupParams, Long employeeId) {
        employeesGroupSearchConditionsService.deleteByGroupId(groupParams.getGroupId());
        if (groupParams.getSearchConditions() != null) {
            this.insertEmployeesGroupSearchConditions(groupParams.getSearchConditions(), groupParams.getGroupId(),
                    employeeId);
        }
    }

    /**
     * Insert list employees_group_search_conditions
     *
     * @param searchConditions
     *            the information group search Conditions
     * @param groupId
     *            the groupId of the entity
     * @param employeeId
     *            the id of employee login
     */
    private void insertEmployeesGroupSearchConditions(List<EmployeeGroupSubType2DTO> searchConditions, Long groupId,
            Long employeeId) {
        List<EmployeesGroupSearchConditionsDTO> employeesGroupSearchConditionsDTOList = new ArrayList<>();
        for (EmployeeGroupSubType2DTO item : searchConditions) {
            if (item.getFieldId() != null) {
                EmployeesGroupSearchConditionsDTO employeesGroupSearchConditionsDTO = new EmployeesGroupSearchConditionsDTO();
                employeesGroupSearchConditionsDTO.setGroupId(groupId);
                employeesGroupSearchConditionsDTO.setFieldId(item.getFieldId());
                employeesGroupSearchConditionsDTO.setSearchType(item.getSearchType());
                employeesGroupSearchConditionsDTO.setFieldOrder(item.getFieldOrder());
                employeesGroupSearchConditionsDTO.setSearchOption(item.getSearchOption());
                employeesGroupSearchConditionsDTO.setSearchValue(item.getFieldValue());
                employeesGroupSearchConditionsDTO.setCreatedUser(employeeId);
                employeesGroupSearchConditionsDTO.setUpdatedUser(employeeId);
                employeesGroupSearchConditionsDTOList.add(employeesGroupSearchConditionsDTO);
            }
        }
        if (!employeesGroupSearchConditionsDTOList.isEmpty()) {
            employeesGroupSearchConditionsService.saveAll(employeesGroupSearchConditionsDTOList);
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#deleteGroup(java.lang.Long)
     */
    @Override
    public Long deleteGroup(Long groupId) {
        // 1.validate parameters
        // validate require
        if (groupId == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, Constants.RIQUIRED_CODE));
        }
        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.GROUP_ID, groupId);
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }

        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        // get department and group of user
        List<Long> depOfEmp = employeesDepartmentsRepository.findByEmployeeId(userId).stream()
                .map(EmployeesDepartments::getDepartmentId).collect(Collectors.toList());
        List<Long> groupOfEmp = employeesGroupMembersRepository.findGroupIdsWithEmployeeIds(Arrays.asList(userId));
        // 2. Delete group
        // 2.1 Get my group
        EmployeesGroups myGroup = employeesGroupsRepositoryCustom.getGroupWithOwnerPermision(groupId, userId, depOfEmp,
                groupOfEmp);
        // 2.2 if group not existed -> throw error
        if (myGroup == null) {
            throw new CustomRestException("Group has no longer existed",
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, ConstantsEmployees.NOT_EXISTED));
        }
        // 2.3 delete group_search_condition
        if (Boolean.TRUE.equals(myGroup.getIsAutoGroup())) {
            employeesGroupSearchConditionRepository.deleteByGroupId(groupId);
        }
        // 2.4 delete group_memeber
        employeesGroupMembersRepository.deleteByGroupId(groupId);
        // 2.5 delete group_participants
        employeesGroupParticipantRepository.deleteByGroupId(groupId);
        // 2.6 delete group
        employeesGroupsRepository.deleteById(groupId);

        return groupId;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getGroups(java.util.List,
     *      boolean, java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetGroupsOutDTO getGroups(List<Long> groupIds, boolean getEmployeesFlg, String languageKey) {
        // 1. Validate parameter
        if (groupIds == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, Constants.RIQUIRED_CODE));
        }

        // 2. Get list group and list employeeId
        List<EmployeeGroupAndGroupMemberDTO> listGroupsAndEmployeeIds = employeesGroupsRepositoryCustom
                .getGroupsAndEmployeeIds(groupIds, getEmployeesFlg);
        // 3. Get employee list
        // 3.1 Create a list of attached employeeIds
        List<Long> employeeIdList = new ArrayList<>();
        listGroupsAndEmployeeIds.stream()
                .filter(groupEmployeeIds -> getEmployeesFlg && groupEmployeeIds.getEmployeeId() != null
                        && !employeeIdList.contains(groupEmployeeIds.getEmployeeId()))
                .forEach(groupEmployeeIds -> employeeIdList.add(groupEmployeeIds.getEmployeeId()));
        // 3.2 Get information employee
        List<EmployeesWithEmployeeDataFormatDTO> listEmployees = employeesService.toEmployeesWithEmployeeDataFormat(
                employeesCommonService.getEmployees(employeeIdList, null, languageKey), true);
        // List<EmployeesWithEmployeeDataFormat>
        // 4. Make data response
        // Build groups
        List<GetGroupsSubType1DTO> groupsSubType1DTOs = new ArrayList<>();
        List<Long> groupIdList = new ArrayList<>();
        for (EmployeeGroupAndGroupMemberDTO group : listGroupsAndEmployeeIds) {
            Long groupId = group.getGroupId();
            if (groupIdList.contains(groupId)) {
                continue;
            }
            List<Long> employeeIds = new ArrayList<>();
            listGroupsAndEmployeeIds.stream()
                    .filter(group1 -> getEmployeesFlg && group1.getGroupId().equals(groupId)
                            && group1.getEmployeeId() != null && !employeeIds.contains(group1.getEmployeeId()))
                    .forEach(group1 -> employeeIds.add(group1.getEmployeeId()));
            GetGroupsSubType1DTO subType1DTO = new GetGroupsSubType1DTO();
            subType1DTO.setGroupId(groupId);
            subType1DTO.setGroupName(group.getGroupName());
            subType1DTO.setGroupType(group.getGroupType());
            subType1DTO.setIsAutoGroup(group.getIsAutoGroup());
            subType1DTO.setEmployeeIds(employeeIds);
            subType1DTO.setUpdatedDate(group.getUpdatedDate());
            groupsSubType1DTOs.add(subType1DTO);
            groupIdList.add(groupId);
        }

        GetGroupsOutDTO groupsSubType1DTO = new GetGroupsOutDTO();
        groupsSubType1DTO.setGroups(groupsSubType1DTOs);
        groupsSubType1DTO.setEmployees(listEmployees);
        return groupsSubType1DTO;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getGroupSuggestions(java.lang.String)
     */
    @Override
    public GetGroupSuggestionsResponseDTO getGroupSuggestions(String searchValue) {
        searchValue = "%" + StringUtil.escapeSqlCommand(searchValue) + "%";
        GetGroupSuggestionsResponseDTO response = new GetGroupSuggestionsResponseDTO();
        response.setGroupInfo(employeesGroupsRepositoryCustom
                .findGroupByOwnerAndGroupName(jwtTokenUtil.getEmployeeIdFromToken(), searchValue));
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupsService#getLastUpdatedDateByGroupId(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Instant getLastUpdatedDateByGroupId(Long groupId) {
        return employeesGroupsRepository.findLastUpdatedDateByGroupId(groupId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.impl.EmployeesGroupsServiceImpl#getFullEmployeesByParticipant(List
     *      , List , List )
     */
    @Override
    public GetFullEmployeesByParticipantResponse getFullEmployeesByParticipant(List<Long> employeeIds,
            List<Long> departmentIds, List<Long> groupIds) {
        List<Long> employeesIdsParticipant = new ArrayList<>();
        if (employeeIds != null && !employeeIds.isEmpty()) {
            employeesIdsParticipant.addAll(employeeIds);
        }
        if (departmentIds != null && !departmentIds.isEmpty()) {
            employeesIdsParticipant
                    .addAll(employeesDepartmentsRepository.findEmployeeIdsWithDepartmentIds(departmentIds));
        }
        if (groupIds != null && !groupIds.isEmpty()) {
            employeesIdsParticipant.addAll(employeesGroupsRepository.getListEmployeeIdByGroupId(groupIds));
        }
        // Remove duplicate elements
        employeesIdsParticipant = new ArrayList<>(new LinkedHashSet<>(employeesIdsParticipant));

        GetFullEmployeesByParticipantResponse getFullEmployeesByParticipantResponse = new GetFullEmployeesByParticipantResponse();
        getFullEmployeesByParticipantResponse.setEmployeesIdsParticipant(employeesIdsParticipant);
        return getFullEmployeesByParticipantResponse;
    }

}
