package jp.co.softbrain.esales.customers.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
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
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.CustomersList;
import jp.co.softbrain.esales.customers.domain.CustomersListFavourites;
import jp.co.softbrain.esales.customers.domain.CustomersListParticipants;
import jp.co.softbrain.esales.customers.repository.CustomersListFavouritesRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListMembersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListParticipantsRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom;
import jp.co.softbrain.esales.customers.repository.CustomersListSearchConditionsRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.CustomersListMembersService;
import jp.co.softbrain.esales.customers.service.CustomersListParticipantsService;
import jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService;
import jp.co.softbrain.esales.customers.service.CustomersListService;
import jp.co.softbrain.esales.customers.service.dto.CreateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateListOutSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.CustomFieldItemResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerNameDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMembersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListParticipantsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListSubType2DTO;
import jp.co.softbrain.esales.customers.service.dto.FieldsResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersListCustomerInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersListInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.GetListSuggestionsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeListModalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.ListParticipantsDTO;
import jp.co.softbrain.esales.customers.service.dto.LookupDataDTO;
import jp.co.softbrain.esales.customers.service.dto.SuggestionOutDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListInDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GeneralSettingDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetGeneralSettingRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.DataSyncElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetFullEmployeesByParticipantRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetFullEmployeesByParticipantResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetParticipantDataByIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetParticipantDataByIdsResponse;
import jp.co.softbrain.esales.customers.service.mapper.CustomersListMapper;
import jp.co.softbrain.esales.customers.service.mapper.FieldsResponseDTOMapper;
import jp.co.softbrain.esales.customers.service.mapper.ItemReflectDTOMapper;
import jp.co.softbrain.esales.customers.service.mapper.LookupDataDTOMapper;
import jp.co.softbrain.esales.customers.service.mapper.RelationDataDTOMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;

/**
 * Service Implementation for managing {@link CustomersList}
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersListServiceImpl implements CustomersListService {

    @Autowired
    private CustomersListRepository customersListRepository;

    @Autowired
    private CustomersListMapper customersListMapper;

    @Autowired
    private CustomersListSearchConditionsService customersListSearchConditionsService;

    Gson gson = new Gson();

    @Autowired
    private CustomersListParticipantsService customersListParticipantsService;

    @Autowired
    private CustomersListMembersService customersListMembersService;

    @Autowired
    private CustomersListRepositoryCustom customersListRepositoryCustom;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersCommonService customersCommonService;

    @Autowired
    private CustomersListSearchConditionsRepository customersListSearchConditionsRepository;

    @Autowired
    private CustomersListMembersRepository customersListMembersRepository;

    @Autowired
    private CustomersListParticipantsRepository customersListParticipantsRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private FieldsResponseDTOMapper fieldsResponseDTOMapper;

    @Autowired
    private LookupDataDTOMapper lookupDataDtoMapper;

    @Autowired
    private ItemReflectDTOMapper itemReflectDTOMapper;

    @Autowired
    private RelationDataDTOMapper relationDataDTOMapper;

    @Autowired
    private CustomersListFavouritesRepository customersListFavouritesRepository;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#save(jp.co.softbrain.esales.customers.service.dto.CustomersListDTO)
     */
    @Override
    public CustomersListDTO save(CustomersListDTO dto) {
        CustomersList entity = customersListMapper.toEntity(dto);
        entity = customersListRepository.save(entity);
        return customersListMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        customersListRepository.deleteByCustomerListId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersListDTO> findOne(Long id) {
        return customersListRepository.findByCustomerListId(id).map(customersListMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersListDTO> findAll(Pageable pageable) {
        return customersListRepository.findAll(pageable).map(customersListMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListDTO> findAll() {
        return customersListRepository.findAll().stream().map(customersListMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#
     * getInitializeListModal(java.lang.Long, java.lang.Boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeListModalResponseDTO getInitializeListModal(Long customerListId, Boolean isAutoList) {
        InitializeListModalResponseDTO responseDTO = new InitializeListModalResponseDTO();

        // 1. Validate parameter
        this.initializeListModalValiadateParameters(customerListId);
        boolean isAutoListNo2 = false;

        if (customerListId != null && customerListId > 0) {
            // 2. Get Info Customer List
            Optional<CustomersListDTO> customersListOptinal = this.findOne(customerListId);
            if (customersListOptinal.isPresent()) {
                responseDTO.setList(customersListOptinal.get());
                isAutoListNo2 = true;
            }

            // 3. Get Info List Search Conditions
            List<CustomersListSearchConditionsDTO> searchConditionList = customersListSearchConditionsService
                    .getListSearchConditions(customerListId).stream().map(searchCondition -> {
                        searchCondition.setFieldValue(searchCondition.getSearchValue());
                        return searchCondition;
                    }).collect(Collectors.toList());
            responseDTO.setSearchConditions(searchConditionList);

            // 4. Get Info List Participants
            List<CustomersListParticipantsDTO> participantsDTOList = customersListParticipantsService
                    .getListParticipants(customerListId);
            responseDTO.setListParticipants(participantsDTOList);
            responseDTO = createParticipantData(responseDTO);
        }

        // 5. Get Custom Fields Info
        if ((customerListId != null && isAutoListNo2) || Boolean.TRUE.equals(isAutoList)) {
            String token = SecurityUtils.getTokenValue().orElse(null);
            GetCustomFieldsInfoRequest getCustomFieldsInfoRequest = new GetCustomFieldsInfoRequest();
            getCustomFieldsInfoRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-custom-fields-info", HttpMethod.POST, getCustomFieldsInfoRequest,
                    CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());

            List<CustomFieldsInfoOutDTO> fieldsInfoList = fieldInfoResponse.getCustomFieldsInfo();
            List<FieldsResponseDTO> customFields = new ArrayList<>();
            fieldsInfoList.forEach(fields -> customFields.add(this.getCustomFieldInfo(fields)));
            responseDTO.setFields(customFields);
        }

        // 6. Call API getGeneralSetting
        String token = SecurityUtils.getTokenValue().orElse(null);
        if (Boolean.TRUE.equals(isAutoList)) {
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

    private InitializeListModalResponseDTO createParticipantData(InitializeListModalResponseDTO responseDTO) {
        List<Long> participantEmployeeIds = new ArrayList<>();
        List<Long> participantDepartmentIds = new ArrayList<>();
        List<Long> participantGroupIds = new ArrayList<>();

        for (CustomersListParticipantsDTO customerListParticipant : responseDTO.getListParticipants()) {
            if (customerListParticipant.getEmployeeId() != null) {
                participantEmployeeIds.add(customerListParticipant.getEmployeeId());
            }
            if (customerListParticipant.getDepartmentId() != null) {
                participantDepartmentIds.add(customerListParticipant.getDepartmentId());
            }
            if (customerListParticipant.getGroupId() != null) {
                participantGroupIds.add(customerListParticipant.getGroupId());
            }
        }

        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        GetParticipantDataByIdsRequest getParticipantDataByIdsRequest = new GetParticipantDataByIdsRequest();
        getParticipantDataByIdsRequest.setParticipantEmployeeIds(participantEmployeeIds);
        getParticipantDataByIdsRequest.setParticipantDepartmentIds(participantDepartmentIds);
        getParticipantDataByIdsRequest.setParticipantGroupIds(participantGroupIds);

        GetParticipantDataByIdsResponse getParticipantDataByIdsResponse = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES, ConstantsCustomers.API_GET_PARTICIPANT_DATA_BY_IDS, HttpMethod.POST,
                getParticipantDataByIdsRequest, GetParticipantDataByIdsResponse.class, token, tenantName);

        responseDTO.setParticipantEmployees(getParticipantDataByIdsResponse.getParticipantEmployees());
        responseDTO.setParticipantDepartments(getParticipantDataByIdsResponse.getParticipantDepartments());
        responseDTO.setParticipantGroups(getParticipantDataByIdsResponse.getParticipantGroups());

        return responseDTO;

    }

    /**
     * Validate parameters api initializeListModal
     * 
     * @param customerListId - id of customer list
     */
    private void initializeListModalValiadateParameters(Long customerListId) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, (Object) customerListId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);

        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * get Fields Response DTO from Fields
     * 
     * @param fields info of Fields
     * @return the Field Response DTO
     */
    private FieldsResponseDTO getCustomFieldInfo(CustomFieldsInfoOutDTO fields) {
        FieldsResponseDTO fieldsResponseDTO = fieldsResponseDTOMapper.toDto(fields);
        Optional.ofNullable(fields.getLookupData()).ifPresent(lData -> {
            LookupDataDTO lookupData = lookupDataDtoMapper.toDTOWithoutItemReflect(lData);
            lookupData.setItemReflect(itemReflectDTOMapper.toDto(lData.getItemReflect()));
            fieldsResponseDTO.setLookupData(lookupData);
        });
        fieldsResponseDTO.setRelationData(relationDataDTOMapper.toDto(fields.getRelationData()));
        fieldsResponseDTO.setTabData(fields.getTabData());
        List<CustomFieldsItemResponseDTO> fieldItems = fields.getFieldItems();
        List<CustomFieldItemResponseDTO> customFieldItems = this.getCustomFieldItemResponseDTO(fieldItems);
        fieldsResponseDTO.setFieldItems(customFieldItems);
        return fieldsResponseDTO;
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
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#createList(jp.co.softbrain.esales.customers.service.dto.CreateListInDTO)
     */
    @Override
    @Transactional
    public CreateListOutDTO createList(CreateListInDTO listParams) {
        CreateListOutDTO createListOutDTO = new CreateListOutDTO();
        // 0. Common processing
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameters
        this.createListValidateParameter(listParams);
        // 2.1 Create customers_list
        CustomersListDTO customersListDTO = this.insertCustomersList(listParams, employeeId);
        Long customerListID = customersListDTO.getCustomerListId();
        // 2.2 create customers_list_participants (my list)
        if (ConstantsCustomers.MY_LIST.equals(listParams.getCustomerListType())) {
            insertCustomersListParticipants(customerListID, employeeId);
        }
        // 3 create customers_list_participants (share list)
        if (ConstantsCustomers.SHARED_LIST.equals(listParams.getCustomerListType())) {
            insertCustomersListParticipants(customerListID, employeeId, listParams.getListParticipants());
        }
        // 4. Create customer_list_member (case n record)
        List<CustomersListMembersDTO> customersListMembersDTOList = new ArrayList<>();
        List<Long> listMembers = listParams.getListMembers();
        if (listMembers != null && !listMembers.isEmpty()) {
            customersListMembersDTOList = insertCustomersListMember(listMembers, customerListID, employeeId);
        }
        // 5. Create customers_list_search_conditions
        List<CustomersListSearchConditionsDTO> cuSearchConditionsDTOList = new ArrayList<>();
        if (Boolean.TRUE.equals(listParams.getIsAutoList()) && listParams.getSearchConditions() != null) {
            cuSearchConditionsDTOList = insertCustomersListSearchCondition(listParams.getSearchConditions(),
                    customerListID, employeeId);
        }
        // 6. Create Response for API
        int listMemberSize = customersListMembersDTOList.size();
        int searchConditionSize = cuSearchConditionsDTOList.size();
        int size = Math.max(listMemberSize, searchConditionSize);
        for (int i = 0; i < size; i++) {
            CreateListOutSubType1DTO crResponeSubDTO = new CreateListOutSubType1DTO();
            if (i < listMemberSize) {
                crResponeSubDTO.setCustomerListMemberId(customersListMembersDTOList.get(i).getCustomerListMemberId());
            }
            if (i < searchConditionSize) {
                crResponeSubDTO.setCustomerListSearchConditionId(
                        cuSearchConditionsDTOList.get(i).getCustomerListSearchConditionId());
            }
            createListOutDTO.getCustomerListMemberIds().add(crResponeSubDTO);
        }
        return createListOutDTO;
    }

    /**
     * Insert list customers_list_search_conditions
     * 
     * @param searchConditions the information customers list search Conditions
     * @param customerListID the customerListID of the entity
     * @param employeeId the id of employee login
     */
    private List<CustomersListSearchConditionsDTO> insertCustomersListSearchCondition(List<CustomersListSubType2DTO> searchConditions,
            Long customerListID, Long employeeId) {
        List<CustomersListSearchConditionsDTO> cuSearchConditionsDTOList = new ArrayList<>();
        searchConditions.forEach(item -> {
            CustomersListSearchConditionsDTO cuSearchConditionsDTO = new CustomersListSearchConditionsDTO();
            cuSearchConditionsDTO.setCustomerListId(customerListID);
            cuSearchConditionsDTO.setFieldId(item.getFieldId());
            cuSearchConditionsDTO.setSearchType(item.getSearchType());
            cuSearchConditionsDTO.setFieldOrder(item.getFieldOrder());
            cuSearchConditionsDTO.setSearchOption(item.getSearchOption());
            cuSearchConditionsDTO.setSearchValue(item.getFieldValue());
            cuSearchConditionsDTO.setFieldValue(item.getFieldValue());
            cuSearchConditionsDTO.setTimeZoneOffset(item.getTimeZoneOffset());
            cuSearchConditionsDTO.setCreatedUser(employeeId);
            cuSearchConditionsDTO.setUpdatedUser(employeeId);
            cuSearchConditionsDTOList.add(cuSearchConditionsDTO);
        });

        return customersListSearchConditionsService.saveAll(cuSearchConditionsDTOList);
    }

    /**
     * Insert into table Customers_List_Participants (share list)
     * 
     * @param customerListID the id of customer list
     * @param employeeId the id of employee login 
     * @param listParticipants the information of CustomersListParticipant
     * @return the list of CustomersListParticipantsDTO
     */
    private List<CustomersListParticipantsDTO> insertCustomersListParticipants(Long customerListID, Long employeeId,
            List<CustomersListSubType1DTO> listParticipants) {
        List<CustomersListParticipantsDTO> cuListParticipantsDTOList = new ArrayList<>();
        listParticipants.forEach(participants -> {
            CustomersListParticipantsDTO customersListParticipantsDTO = new CustomersListParticipantsDTO();
            customersListParticipantsDTO.setCustomerListId(customerListID);
            customersListParticipantsDTO.setEmployeeId(participants.getEmployeeId());
            customersListParticipantsDTO.setDepartmentId(participants.getDepartmentId());
            customersListParticipantsDTO.setGroupId(participants.getGroupId());
            customersListParticipantsDTO.setParticipantType(participants.getParticipantType());
            customersListParticipantsDTO.setCreatedUser(employeeId);
            customersListParticipantsDTO.setUpdatedUser(employeeId);
            cuListParticipantsDTOList.add(customersListParticipantsDTO);
        });

        return customersListParticipantsService.saveAll(cuListParticipantsDTOList);
    }

    /**
     * Insert into table Customers_List_Participants (my list)
     * 
     * @param customerListID the id of customer list
     * @param employeeId the id of employee login 
     */
    private void insertCustomersListParticipants(Long customerListID, Long employeeId) {
        CustomersListParticipantsDTO cuListParticipantsDTO = new CustomersListParticipantsDTO();
        cuListParticipantsDTO.setCustomerListId(customerListID);
        cuListParticipantsDTO.setEmployeeId(employeeId);
        cuListParticipantsDTO.setParticipantType(ConstantsCustomers.MEMBER_TYPE_OWNER);
        cuListParticipantsDTO.setCreatedUser(employeeId);
        cuListParticipantsDTO.setUpdatedUser(employeeId);
        customersListParticipantsService.save(cuListParticipantsDTO);
    }

    /**
     * insert CutomersListMember
     * 
     * @param listMembers the information Customers List Members
     * @param customerListID the customersListId of the entity
     * @param employeeId the id of employee login
     * @return 
     */
    private List<CustomersListMembersDTO> insertCustomersListMember(List<Long> listMembers, Long customerListID, Long employeeId) {
        List<CustomersListMembersDTO> customersListMembersDTOList = new ArrayList<>();
        listMembers.forEach(memberId -> {
            CustomersListMembersDTO customersListMembersDTO = new CustomersListMembersDTO();
            customersListMembersDTO.setCustomerListId(customerListID);
            customersListMembersDTO.setCustomerId(memberId);
            customersListMembersDTO.setCreatedUser(employeeId);
            customersListMembersDTO.setUpdatedUser(employeeId);
            customersListMembersDTOList.add(customersListMembersDTO);
        });
        return customersListMembersService.saveAll(customersListMembersDTOList);
    }

    /**
     * Insert a record customers_list
     * 
     * @param listParams the info of customer
     * @param employeeId the id of employee login
     * @return the entity of CustomersListDTO
     */
    private CustomersListDTO insertCustomersList(CreateListInDTO listParams, Long employeeId) {
        CustomersListDTO customersListDTO = new CustomersListDTO();
        customersListDTO.setCustomerListName(listParams.getCustomerListName());
        customersListDTO.setCustomerListType(listParams.getCustomerListType());
        customersListDTO.setIsAutoList(listParams.getIsAutoList());
        customersListDTO.setIsOverWrite(listParams.getIsOverWrite());
        customersListDTO.setCreatedUser(employeeId);
        customersListDTO.setUpdatedUser(employeeId);
        return this.save(customersListDTO);
    }

    /**
     * createListValidateRequireParameter
     * 
     * @param listParams
     * @return list Errors
     */
    private List<Map<String, Object>> createListValidateRequireParameter(CreateListInDTO listParams) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (StringUtils.isEmpty(listParams.getCustomerListName())) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_NAME, Constants.RIQUIRED_CODE, null));
        }
        if (listParams.getCustomerListType() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_TYPE, Constants.RIQUIRED_CODE, null));
        }
        if (listParams.getIsAutoList() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.IS_AUTO_LIST, Constants.RIQUIRED_CODE, null));
        }

        if (!ConstantsCustomers.SHARED_LIST.equals(listParams.getCustomerListType())) {
            return errors;
        }

        List<CustomersListSubType1DTO> groupParticipants = listParams.getListParticipants();
        if (groupParticipants == null || groupParticipants.isEmpty()) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_PARTICIPANT, Constants.RIQUIRED_CODE));
            return errors;
        }

        // Check exist member is owner
        boolean itemExists = groupParticipants.stream()
                .anyMatch(gp -> gp.getParticipantType().equals(ConstantsCustomers.MEMBER_TYPE_OWNER));
        if (!itemExists) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_PARTICIPANT, Constants.AT_LEAST_1_IS_OWNER));
        }
        int index = 0;
        for (CustomersListSubType1DTO groupParticipant : listParams.getListParticipants()) {
            if (groupParticipant.getEmployeeId() == null && groupParticipant.getDepartmentId() == null
                    && groupParticipant.getGroupId() == null) {
                errors.add(CommonUtils.putError("employeeId/ departmentId/ groupId", Constants.RIQUIRED_CODE, index));
            }
            index++;
        }
        return errors;
    }

    /**
     * createListValidateSearchConditionsParameter
     * 
     * @param listParams
     * @return list Errors
     */
    private List<Map<String, Object>> createListValidateSearchConditionsParameter(CreateListInDTO listParams) {
        List<CustomersListSubType2DTO> searchConditions = listParams.getSearchConditions();
        List<Map<String, Object>> errors = new ArrayList<>();
        if (Boolean.TRUE.equals(listParams.getIsAutoList())
                && (searchConditions == null || searchConditions.isEmpty())) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_SEARCH_CONDITION,
                    Constants.SEARCH_CONDITION_AUTO_NOT_EXIST, null));
        } else {
            errors.addAll(validateSearchConditionsParameter(searchConditions));
        }
        return errors;
    }
    
    /**
     * createListValidateSearchConditionsParameter
     * 
     * @param listParams
     * @return list Errors
     */
    private List<Map<String, Object>> validateSearchConditionsParameter(
            List<CustomersListSubType2DTO> searchConditions) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (searchConditions == null) {
            return errors;
        }
        int index = 0;
        for (CustomersListSubType2DTO cuSubType2DTO : searchConditions) {
            if (cuSubType2DTO.getFieldId() != null && cuSubType2DTO.getFieldId() <= ConstantsCustomers.NUMBER_ZERO) {
                errors.add(CommonUtils.putError(ConstantsCustomers.FIELD_ID, Constants.NUMBER_NOT_NEGATIVE, index));
            }
            if (cuSubType2DTO.getSearchOption() != null
                    && cuSubType2DTO.getSearchOption() <= ConstantsCustomers.NUMBER_ZERO) {
                errors.add(
                        CommonUtils.putError(ConstantsCustomers.SEARCH_OPTION, Constants.NUMBER_NOT_NEGATIVE, index));
            }
            if (cuSubType2DTO.getSearchType() != null
                    && cuSubType2DTO.getSearchType() <= ConstantsCustomers.NUMBER_ZERO) {
                errors.add(CommonUtils.putError(ConstantsCustomers.SEARCH_TYPE, Constants.NUMBER_NOT_NEGATIVE, index));
            }
            TypeReference<Map<String, Object>> mapType = new TypeReference<Map<String, Object>>() {};
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> searchValue = null;

            try {
                searchValue = objectMapper.readValue(cuSubType2DTO.getFieldValue(), mapType);
                String fieldType = cuSubType2DTO.getFieldType() == null ? "" : cuSubType2DTO.getFieldType().toString();
                errors.addAll(this.validateParameterFieldTypeAndSearchValue(fieldType, searchValue, index));
            } catch (Exception e) {
                index++;
            }
        }
        return errors;
    }

    /**
     * createListValidateCommon
     * 
     * @param listParams
     * @return list errors
     */
    private List<Map<String, Object>> createListValidateCommon(CreateListInDTO listParams) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_NAME, listParams.getCustomerListName());
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_TYPE, listParams.getCustomerListType());
        fixedParams.put(ConstantsCustomers.LIST_MEMBER, listParams.getListMembers());
        fixedParams.put(ConstantsCustomers.LIST_PARTICIPANT, listParams.getListParticipants());
        fixedParams.put(ConstantsCustomers.LIST_SEARCH_CONDITION, listParams.getSearchConditions());
        String validateJson = jsonBuilder.build(Constants.FieldBelong.CUSTOMER.getValue(), fixedParams,
                (Map<String, Object>) null);
        return validateCommons(validateJson);
    }

    /**
     * Validate parameter for API createList or update List
     * 
     * @param listParams list parameter of create list
     */
    private void createListValidateParameter(CreateListInDTO listParams) {
        // Validate require parameters
        List<Map<String, Object>> errors = createListValidateRequireParameter(listParams);
        // Validate searchConditions
        errors.addAll(createListValidateSearchConditionsParameter(listParams));
        // Validate common
        errors.addAll(createListValidateCommon(listParams));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * Update group validate parameter
     * 
     * @param validateJson
     *            string parameter validate
     * @return list error
     */
    private List<Map<String, Object>> validateCommons(String validateJson) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        return CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName);
    }

    /**
     * validate parameter fileType and searchValue
     * 
     * @param fieldType fieldType
     * @param searchValue searchValue
     * @param rowId rowId
     * @return the list of Map<String, Object>
     */
    private List<Map<String, Object>> validateParameterFieldTypeAndSearchValue(String fieldType,
            Map<String, Object> searchValue, Integer rowId) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (searchValue == null || searchValue.isEmpty()) {
            return errors;
        }
        searchValue.entrySet().stream().forEach(sValue -> {
            if (!(Constants.Query.SEARCH_FIELDS.FROM.toString().equalsIgnoreCase(sValue.getKey())
                    || Constants.Query.SEARCH_FIELDS.TO.toString().equalsIgnoreCase(sValue.getKey()))) {
                return;
            }
            if (errors.isEmpty()) {
                errors.addAll(validateParameterSearchValue(fieldType, sValue, rowId));
            }
        });
        return errors;
    }

    /**
     * validate parameter searchValue
     * 
     * @param fieldType fieldType
     * @param sValue the entity of searchValueTypeDTO
     * @param rowId rowId
     * @return the list of Map<String, Object>
     */
    private List<Map<String, Object>> validateParameterSearchValue(String fieldType, Entry<String, Object> entryValue,
            Integer rowId) {
        List<Map<String, Object>> errors = new ArrayList<>();

        String sValue = String.valueOf(entryValue.getValue());
        if ((FieldTypeEnum.NUMBER.getCode().equals(fieldType) && !sValue.matches(ConstantsCustomers.REGEX_INTEGER))
                && !(sValue.matches(ConstantsCustomers.REGEX_DECIMAL))) {
            errors.add(CommonUtils.putError(ConstantsCustomers.SEARCH_VALUE, Constants.NUMBER_INVALID_CODE, rowId));
        }

        return errors;
    }

    /**
     * updateListValidateRequireParameter
     * 
     * @param listParams
     * @return list Errors
     */
    private List<Map<String, Object>> updateListValidateRequireParameter(UpdateListInDTO listParams) {
        List<Map<String, Object>> errors = new ArrayList<>();
        if (listParams.getCustomerListId() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE, null));
        }
        if (StringUtils.isEmpty(listParams.getCustomerListName())) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_NAME, Constants.RIQUIRED_CODE, null));
        }
        if (listParams.getCustomerListType() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_TYPE, Constants.RIQUIRED_CODE, null));
        }
        if (listParams.getIsAutoList() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.IS_AUTO_LIST, Constants.RIQUIRED_CODE, null));
        }

        if (!ConstantsCustomers.SHARED_LIST.equals(listParams.getCustomerListType())) {
            return errors;
        }

        List<CustomersListSubType1DTO> groupParticipants = listParams.getListParticipants();
        if (groupParticipants == null || groupParticipants.isEmpty()) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_PARTICIPANT, Constants.RIQUIRED_CODE));
            return errors;
        }

        // Check exist member is owner
        boolean itemExists = groupParticipants.stream()
                .anyMatch(gp -> gp.getParticipantType().equals(ConstantsCustomers.MEMBER_TYPE_OWNER));
        if (!itemExists) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_PARTICIPANT, Constants.AT_LEAST_1_IS_OWNER));
        }
        int index = 0;
        for (CustomersListSubType1DTO groupParticipant : listParams.getListParticipants()) {
            if (groupParticipant.getEmployeeId() == null && groupParticipant.getDepartmentId() == null
                    && groupParticipant.getGroupId() == null) {
                errors.add(CommonUtils.putError("employeeId/ departmentId/ groupId", Constants.RIQUIRED_CODE, index));
            }
            index++;
        }
        return errors;
    }
    
    /**
     * updateListValidateSearchConditionsParameter
     * 
     * @param listParams
     * @return list Errors
     */
    private List<Map<String, Object>> updateListValidateSearchConditionsParameter(UpdateListInDTO listParams) {
        List<CustomersListSubType2DTO> searchConditions = listParams.getSearchConditions();
        List<Map<String, Object>> errors = new ArrayList<>();
        if (Boolean.TRUE.equals(listParams.getIsAutoList())
                && (searchConditions == null || searchConditions.isEmpty())) {
            errors.add(CommonUtils.putError(ConstantsCustomers.LIST_SEARCH_CONDITION,
                    Constants.SEARCH_CONDITION_AUTO_NOT_EXIST, null));
        } else {
            errors.addAll(validateSearchConditionsParameter(searchConditions));
        }
        return errors;
    }

    /**
     * updateListValidateCommon
     * 
     * @param listParams
     * @return list errors
     */
    private List<Map<String, Object>> updateListValidateCommon(UpdateListInDTO listParams) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, listParams.getCustomerListId());
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_NAME, listParams.getCustomerListName());
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_TYPE, listParams.getCustomerListType());
        fixedParams.put(ConstantsCustomers.LIST_PARTICIPANT, listParams.getListParticipants());
        fixedParams.put(ConstantsCustomers.LIST_SEARCH_CONDITION, listParams.getSearchConditions());
        String validateJson = jsonBuilder.build(Constants.FieldBelong.CUSTOMER.getValue(), fixedParams,
                (Map<String, Object>) null);
        return validateCommons(validateJson);
    }

    /**
     * Validate parameter for API createList or update List
     * 
     * @param listParams list parameter of create list
     */
    private void updateListValidateParameter(UpdateListInDTO listParams) {
        // Validate require parameters
        List<Map<String, Object>> errors = updateListValidateRequireParameter(listParams);
        // Validate searchConditions
        errors.addAll(updateListValidateSearchConditionsParameter(listParams));
        // Validate common
        errors.addAll(updateListValidateCommon(listParams));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#updateList(jp.co.softbrain.esales.customers.service.dto.UpdateListInDTO)
     */
    @Override
    @Transactional
    public UpdateListOutDTO updateList(UpdateListInDTO listParams) {
        UpdateListOutDTO updateListOutDTO = new UpdateListOutDTO();
        // 0. Common processing
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameters
        this.updateListValidateParameter(listParams);
        // 2. Update customers_list
        Optional<CustomersListDTO> customerList = this.findOne(listParams.getCustomerListId());
        if (customerList.isPresent()) {
            CustomersListDTO customersListDTO = customerList.get();
            customersListDTO.setCustomerListName(listParams.getCustomerListName());
            customersListDTO.setCustomerListType(listParams.getCustomerListType());
            customersListDTO.setIsAutoList(listParams.getIsAutoList());
            customersListDTO.setIsOverWrite(listParams.getIsOverWrite());
            this.save(customersListDTO);
        } else {
            throw new CustomRestException("error-exclusive",
                    CommonUtils.putError("updateList", Constants.EXCLUSIVE_CODE));
        }
        if (ConstantsCustomers.SHARED_LIST.equals(listParams.getCustomerListType())) {
            // 3.1 Update customer_list_favorites relation participant
            // old employees owner and viewer has favorites this list - ABCD
            List<Long> oldFavoritesEmployeeIds = customersListFavouritesRepository
                    .findEmployeeIdsWithCustomerListId(listParams.getCustomerListId());

            // new participants owner and viewer
            // -> new employees of this participant - CDEF
            GetFullEmployeesByParticipantRequest getFullEmployeesByParticipantRequest = createGetFullEmployeesByParticipantRequestData(
                    listParams);
            String token = SecurityUtils.getTokenValue().orElse(null);
            String tenantName = jwtTokenUtil.getTenantIdFromToken();

            GetFullEmployeesByParticipantResponse getFullEmployeesByParticipantResponse = restOperationUtils
                    .executeCallApi(Constants.PathEnum.EMPLOYEES,
                            ConstantsCustomers.API_GET_FULL_EMPLOYEES_BY_PARTICIPANT, HttpMethod.POST,
                            getFullEmployeesByParticipantRequest, GetFullEmployeesByParticipantResponse.class, token,
                            tenantName);
            List<Long> employeesIdsParticipant = getFullEmployeesByParticipantResponse.getEmployeesIdsParticipant();

            // remove customer_list_favorites where employees not in new list -
            // AB
            List<Long> listEmployeeFavoritesNeedRemove = new ArrayList<>();
            for (Long item : oldFavoritesEmployeeIds) {
                if (!employeesIdsParticipant.contains(item)) {
                    listEmployeeFavoritesNeedRemove.add(item);
                }
            }
            customersListFavouritesRepository.deleteByCustomerListIdAndEmployeeIdIn(listParams.getCustomerListId(),
                    listEmployeeFavoritesNeedRemove);
        }

        // 3.2 Update customers_list_participants
        List<CustomersListParticipantsDTO> cuListParticipantsDTOList = null;
        if (ConstantsCustomers.SHARED_LIST.equals(listParams.getCustomerListType())) {
            cuListParticipantsDTOList = updateCustomerListParticiants(listParams, employeeId);
        }
        // 4. Update customers_list_search_conditions witch condition is_auto_list = true
        List<CustomersListSearchConditionsDTO> cuSearchConditionsDTOList = null;
        if (Boolean.TRUE.equals(listParams.getIsAutoList())) {
            cuSearchConditionsDTOList = updateCustomerListSearchConditons(listParams, employeeId);
        }
        // 5. Create response for API
        updateListOutDTO.setCustomerListId(listParams.getCustomerListId());
        if (cuListParticipantsDTOList != null) {
            cuListParticipantsDTOList.forEach(participantsUpdated -> {
                CustomersListParticipantsDTO participantsDTO = new CustomersListParticipantsDTO();
                participantsDTO.setCustomerListParticipantId(participantsUpdated.getCustomerListParticipantId());
                updateListOutDTO.getCustomerListParticipantIds().add(participantsDTO);
            });
        }
        if (cuSearchConditionsDTOList != null) {
            cuSearchConditionsDTOList.forEach(searchConditionUpdated -> {
                CustomersListSearchConditionsDTO cuConditionsDTO = new CustomersListSearchConditionsDTO();
                cuConditionsDTO.setCustomerListSearchConditionId(searchConditionUpdated.getCustomerListSearchConditionId());
                updateListOutDTO.getCustomerListSearchConditionIds().add(cuConditionsDTO);
            });
        }
        return updateListOutDTO;
    }

    /**
     * createGetFullEmployeesByParticipantRequestData.
     * 
     * @param listParams createGetFullEmployeesByParticipantRequestData
     * @return GetFullEmployeesByParticipantRequest
     */
    private GetFullEmployeesByParticipantRequest createGetFullEmployeesByParticipantRequestData(
            UpdateListInDTO listParams) {
        GetFullEmployeesByParticipantRequest getFullEmployeesByParticipantRequest = new GetFullEmployeesByParticipantRequest();
        List<CustomersListSubType1DTO> listParticipants = listParams.getListParticipants();
        List<Long> employeeIds = new ArrayList<>();
        List<Long> departmentIds = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();
        listParticipants.forEach(item -> {
            if (item.getEmployeeId() != null) {
                employeeIds.add(item.getEmployeeId());
            }
            if (item.getDepartmentId() != null) {
                departmentIds.add(item.getDepartmentId());
            }
            if (item.getGroupId() != null) {
                groupIds.add(item.getGroupId());
            }
        });
        getFullEmployeesByParticipantRequest.setEmployeeIds(employeeIds);
        getFullEmployeesByParticipantRequest.setDepartmentIds(departmentIds);
        getFullEmployeesByParticipantRequest.setGroupIds(groupIds);
        return getFullEmployeesByParticipantRequest;
    }

    /**
     * Update customers_list_search_conditions
     * 
     * @param listParams the info Update
     * @param employeeId the employeeId of employee login
     */
    private List<CustomersListSearchConditionsDTO> updateCustomerListSearchConditons(UpdateListInDTO listParams,
            Long employeeId) {
        // 4.a Delete old customers_list_search_conditions
        customersListSearchConditionsService.deleteByCustomerListId(listParams.getCustomerListId());
        // 4.b Insert into customers_list_search_conditions
        return insertCustomersListSearchCondition(listParams.getSearchConditions(), listParams.getCustomerListId(),
                employeeId);
    }

    /**
     * Update customers_list_participants
     * 
     * @param listParams the info Update
     * @param employeeId the employeeId of employee login
     * @return the list of CustomersListParticipantsDTO
     */
    private List<CustomersListParticipantsDTO> updateCustomerListParticiants(UpdateListInDTO listParams, Long employeeId) {
        // 3.a Delete old customers_list_participants
        customersListParticipantsService.deleteByCustomerListId(listParams.getCustomerListId());
        // 3.b Insert into customers_list_participants
        return insertCustomersListParticipants(listParams.getCustomerListId(), employeeId,
                listParams.getListParticipants());
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#
     * getFavoriteCustomers(java.util.List)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetFavoriteCustomersOutDTO getFavoriteCustomers(List<Long> customerListFavouriteIds, Long employeeId) {
        // 1. Validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_FAVOURITE_IDS, customerListFavouriteIds);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // get data
        GetFavoriteCustomersOutDTO response = new GetFavoriteCustomersOutDTO();

        // 2. Get the list of favorite customers
        List<GetFavoriteCustomersListInfoDTO> listFavoriteCustomers = customersListRepositoryCustom
                .getFavoriteCustomers(customerListFavouriteIds);
        listFavoriteCustomers.removeIf(favoriteList -> favoriteList.getCustomerListId() == null);
        List<GetFavoriteCustomersListInfoDTO> listFavoriteCustomersFinal = new ArrayList<>();
        for (GetFavoriteCustomersListInfoDTO item : listFavoriteCustomers) {
            if (!listFavoriteCustomersFinal.contains(item)) {
                listFavoriteCustomersFinal.add(item);
            }
        }
        response.setListGroupCustomers(listFavoriteCustomersFinal);

        // 3. Get favorite List information by staff
        if (employeeId == null) {
            return response;
        }
        List<GetFavoriteCustomersSubType4DTO> listCusFavoriteByEmployeeId = customersListRepositoryCustom
                .getFavoriteCustomersByEmployeeId(employeeId);
        if (CollectionUtils.isEmpty(listCusFavoriteByEmployeeId)) {
            return response;
        }

        // process list
        Map<Long, GetFavoriteCustomersListCustomerInfoDTO> mapListFavorite = new LinkedHashMap<>();

        for (GetFavoriteCustomersSubType4DTO cusFavorite : listCusFavoriteByEmployeeId) {

            if (!mapListFavorite.containsKey(cusFavorite.getCustomerListId())) {
                GetFavoriteCustomersListCustomerInfoDTO listFavorite = new GetFavoriteCustomersListCustomerInfoDTO();
                listFavorite.setCustomerListFavouriteId(cusFavorite.getCustomerListFavouriteId());
                listFavorite.setCustomerListFavouriteName(cusFavorite.getCustomerListName());
                mapListFavorite.put(cusFavorite.getCustomerListId(), listFavorite);
            }

            if (cusFavorite.getCustomerId() != null) {
                CustomerNameDTO customer = new CustomerNameDTO();
                customer.setCustomerId(cusFavorite.getCustomerId());
                customer.setCustomerName(cusFavorite.getCustomerName());
                mapListFavorite.get(cusFavorite.getCustomerListId()).getListCustomer().add(customer);
            }
        }

        mapListFavorite.entrySet().stream()
                .forEach(entry -> response.getListFavoriteCustomerOfEmployee().add(entry.getValue()));
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomerListService#deleteList(java.lang.Long)
     */
    @Override
    @Transactional
    public Long deleteList(Long customerListId) {
        // 1.1. validate parameters
        if (customerListId == null) {
            throw new CustomRestException("Param[customerListId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2.validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2. delete list

        // 2.1 get list by customerListId
        Optional<CustomersList> customersListOptional = customersListRepository.findByCustomerListId(customerListId);
        CustomersList customersList = new CustomersList();
        if (customersListOptional.isPresent()) {
            customersList = customersListOptional.get();
        }
        // 2.2 check available when delete list
        if (!customersListOptional.isPresent() && checkOwnerEmployeeLoginOfList(customerListId)) {
            throw new CustomRestException("Param [customerList] is not existed",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMERS_LIST, ConstantsCustomers.NOT_EXISTED));
        }
        // 2.3. Delete favorite list by customerListId
        customersCommonService.deleteAllFavoriteListByCustomerListId(customerListId);
        // 2.4. delete condition information list
        if (Boolean.TRUE.equals(customersList.getIsAutoList())) {
            customersListSearchConditionsRepository.deleteByCustomerListId(customerListId);
        }
        // 2.5. delete information of partner of list
        customersListMembersRepository.deleteByCustomerListId(customerListId);
        // 2.6. delete member who enjoy list
        customersListParticipantsRepository.deleteByCustomerListId(customerListId);
        // 2.7. delete list
        customersListRepository.deleteByCustomerListId(customerListId);
        return customerListId;
    }

    /**
     * getParticipantsOfUserLogin
     * 
     * @return
     */
    private ListParticipantsDTO getParticipantsOfUserLogin() {
        Long employeeIdOfUserLogin = jwtTokenUtil.getEmployeeIdFromToken();
        List<Long> groupIdsOfUserLogin = new ArrayList<>();
        List<Long> departmentIdsOfUserLogin = new ArrayList<>();

        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        // get department and group of employeeLogin
        GetGroupAndDepartmentByEmployeeIdsRequest groupDepRequest = new GetGroupAndDepartmentByEmployeeIdsRequest();
        groupDepRequest.setEmployeeIds(Arrays.asList(employeeIdOfUserLogin));

        GetGroupAndDepartmentByEmployeeIdsOutDTO groupDepOut = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_GROUP_AND_DEPARTMENT_BY_EMPLOYEE_IDS, HttpMethod.POST, groupDepRequest,
                GetGroupAndDepartmentByEmployeeIdsOutDTO.class, token, tenantName);

        if (groupDepOut != null && !CollectionUtils.isEmpty(groupDepOut.getEmployees())) {
            groupDepOut.getEmployees().forEach(emp -> {
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    departmentIdsOfUserLogin.addAll(emp.getDepartmentIds());
                }
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    groupIdsOfUserLogin.addAll(emp.getGroupIds());
                }
            });
        }
        ListParticipantsDTO userLogin = new ListParticipantsDTO();
        userLogin.setEmployeeIds(Arrays.asList(employeeIdOfUserLogin));
        userLogin.setDepartmentIds(departmentIdsOfUserLogin);
        userLogin.setGroupIds(groupIdsOfUserLogin);
        return userLogin;
    }

    /**
     * checkOwnerEmployeeLoginOfList
     * 
     * @param customerListId
     * @return
     */
    private boolean checkOwnerEmployeeLoginOfList(Long customerListId) {

        // get group and department of EmployeeLogin
        ListParticipantsDTO userLogin = getParticipantsOfUserLogin();
        List<Long> employeeIdsOfUserLogin = userLogin.getEmployeeIds();
        List<Long> groupIdsOfUserLogin = userLogin.getDepartmentIds();
        List<Long> departmentIdsOfUserLogin = userLogin.getGroupIds();

        // get employeeId or department or group owner of customerListId
        List<Long> employeeIdOwner = new ArrayList<>();
        List<Long> groupIdsOwner = new ArrayList<>();
        List<Long> departmentIdsOwner = new ArrayList<>();
        List<CustomersListParticipants> customersListParticipantsList = customersListParticipantsRepository
                .findByCustomerListIdAndParticipantType(customerListId, ConstantsCustomers.PARTICIPANT_TYPE_OWNER);

        if (customersListParticipantsList != null && !customersListParticipantsList.isEmpty()) {
            customersListParticipantsList.forEach(item -> {
                if (item.getEmployeeId() != null) {
                    employeeIdOwner.add(item.getEmployeeId());
                }
                if (item.getDepartmentId() != null) {
                    groupIdsOwner.add(item.getDepartmentId());
                }
                if (item.getGroupId() != null) {
                    departmentIdsOwner.add(item.getGroupId());

                }
            });
        }

        // check existed user login in list owner
        boolean hasExistedEmployeeIdOwner = hasExistedLoginIdOwner(employeeIdsOfUserLogin, employeeIdOwner);
        boolean hasExistedDepartmentIdOwner = hasExistedLoginIdOwner(departmentIdsOfUserLogin,
                departmentIdsOfUserLogin);
        boolean hasExistedGroupIdOwner = hasExistedLoginIdOwner(groupIdsOfUserLogin, groupIdsOwner);

        return hasExistedEmployeeIdOwner || hasExistedDepartmentIdOwner || hasExistedGroupIdOwner;
    }

    /**
     * hasExistedLoginIdOwner
     * 
     * @param idsOfUserLogin
     * @param idsOwner
     * @return
     */
    private boolean hasExistedLoginIdOwner(List<Long> idsOfUserLogin, List<Long> idsOwner) {
        if (idsOfUserLogin != null && !idsOfUserLogin.isEmpty() && idsOwner != null && !idsOwner.isEmpty()) {
            for (Long item : idsOwner) {
                for (Long item2 : idsOfUserLogin) {
                    if (item.equals(item2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListService#getListSuggestions(java.lang.String)
     * @param searchValue
     * @return GetListSuggestionsOutDTO the entity response
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetListSuggestionsOutDTO getListSuggestions(String searchValue) {
        if (searchValue == null) {
            throw new CustomRestException("Param[customer_list_name] is null",
                    CommonUtils.putError("customerListName", Constants.RIQUIRED_CODE));
        }

        GetListSuggestionsOutDTO response = new GetListSuggestionsOutDTO();

        // get session info
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        // 1.Get List Info By SearchValue
        List<SuggestionOutDTO> listSuggestionOutDTOs = new ArrayList<>();
        String searchValueEscapeSql = StringUtil.escapeSqlCommand(searchValue);
        searchValueEscapeSql = "%" + searchValueEscapeSql + "%";

        // get group and department of Employee
        List<Long> groupIds = new ArrayList<>();
        List<Long> departmentIds = new ArrayList<>();

        GetGroupAndDepartmentByEmployeeIdsRequest groupDepRequest = new GetGroupAndDepartmentByEmployeeIdsRequest();
        groupDepRequest.setEmployeeIds(Arrays.asList(userId));

        GetGroupAndDepartmentByEmployeeIdsOutDTO groupDepOut = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_GROUP_AND_DEPARTMENT_BY_EMPLOYEE_IDS, HttpMethod.POST, groupDepRequest,
                GetGroupAndDepartmentByEmployeeIdsOutDTO.class, token, tenantName);

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

        List<CustomersListOptionalsDTO> listCustomers = customersListRepositoryCustom
                .getAllListOwnerWithSearchCondition(userId, departmentIds, groupIds, searchValueEscapeSql);
        if (listCustomers.isEmpty()) {
            return response;
        }

        // Check favorites for listCustomers of this user id login
        List<Long> customerListIds = new ArrayList<>();
        listCustomers.forEach(customer -> customerListIds.add(customer.getCustomerListId()));

        List<CustomersListFavourites> customersListFavouriteList = customersListFavouritesRepository
                .findByCustomerListIdInAndEmployeeId(customerListIds, userId);

        List<Long> customersListIdFavourites = new ArrayList<>();
        customersListFavouriteList.forEach(
                customersListFavourite -> customersListIdFavourites.add(customersListFavourite.getCustomerListId()));

        Map<Long, Long> mapSuggestion = new HashMap<>();
        List<Long> listCreateUser = new ArrayList<>();
        for (CustomersListOptionalsDTO customers : listCustomers) {
            SuggestionOutDTO suggestionOutDTO = new SuggestionOutDTO();
            suggestionOutDTO.setCustomerListId(customers.getCustomerListId());
            suggestionOutDTO.setCustomerListName(customers.getCustomerListName());
            suggestionOutDTO.setCustomerListType(customers.getCustomerListType());
            suggestionOutDTO.setIsAutoList(customers.getIsAutoList());
            suggestionOutDTO.setLastUpdatedDate(customers.getLastUpdatedDate());
            suggestionOutDTO.setIsOverWrite(customers.getIsOverWrite());
            suggestionOutDTO.setLastUpdatedDate(customers.getLastUpdatedDate());
            suggestionOutDTO.setParticipantType(customers.getParticipantType());

            suggestionOutDTO.setIsFavoriteList(customersListIdFavourites.contains(customers.getCustomerListId()));
            listSuggestionOutDTOs.add(suggestionOutDTO);
            listCreateUser.add(customers.getCreatedUser());
            mapSuggestion.put(customers.getCustomerListId(), customers.getCreatedUser());
        }
        // 2. get info employees
        DataSyncElasticSearchRequest dataSyncElasticSearchRequest = new DataSyncElasticSearchRequest();
        dataSyncElasticSearchRequest.setEmployeeIds(listCreateUser);
        // call API get-employees-by-ids
        GetEmployeesByIdsResponse employeesByIdsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS, HttpMethod.POST, dataSyncElasticSearchRequest,
                GetEmployeesByIdsResponse.class, token, tenantName);
        // 3. Create data Response for API
        Map<Long, String> empNameMap = new HashMap<>();
        employeesByIdsResponse.getEmployees().forEach(emp -> empNameMap.put(emp.getEmployeeId(),
                StringUtil.getFullName(emp.getEmployeeSurname(), emp.getEmployeeName())));
        listSuggestionOutDTOs.stream().forEach(listSuggest -> {
            Long empId = mapSuggestion.get(listSuggest.getCustomerListId());
            if (empId == null) {
                return;
            }
            listSuggest.setEmployeeName(empNameMap.get(empId));
        });
        response.setListInfo(listSuggestionOutDTOs);
        return response;
    }

}
