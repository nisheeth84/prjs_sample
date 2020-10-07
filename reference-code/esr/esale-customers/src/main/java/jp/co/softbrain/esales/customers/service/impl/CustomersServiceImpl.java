package jp.co.softbrain.esales.customers.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.config.Constants.Query;
import jp.co.softbrain.esales.customers.config.ApplicationProperties;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import jp.co.softbrain.esales.customers.domain.FieldInfo;
import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import jp.co.softbrain.esales.customers.domain.MastersStands;
import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.repository.CustomersHistoriesRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListMembersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom;
import jp.co.softbrain.esales.customers.repository.FieldInfoRepository;
import jp.co.softbrain.esales.customers.repository.MastersMotivationsRepository;
import jp.co.softbrain.esales.customers.repository.MastersStandsRepository;
import jp.co.softbrain.esales.customers.repository.NetworksStandsRepository;
import jp.co.softbrain.esales.customers.repository.SchedulesRepository;
import jp.co.softbrain.esales.customers.repository.TasksRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersBusinessService;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.MastersMotivationsService;
import jp.co.softbrain.esales.customers.service.MastersStandsService;
import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.CheckDeteleMasterScenariosOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CountCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CountRelationCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerAddressesOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerAddressesOutSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerDataTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutCustomFieldInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutCustomResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutFieldItemDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalFieldInfo;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerNameDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerPhotoDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersBusinessDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDataTabsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.DeleteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.DeleteCustomersOutSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.FieldInfosTabDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersSupType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerConnectionsMapDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerHistoryResponse;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerHistorySubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdByCustomerNameOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerListSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutDetailsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsInfoCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutCustomerRelations;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDataInfosDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutParentTreeDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType2DTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType3DTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetUrlQuicksightResponse;
import jp.co.softbrain.esales.customers.service.dto.InformationDetailsCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterMotivationInDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterMotivationOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterStandOutDTO;
import jp.co.softbrain.esales.customers.service.dto.MasterStandsInDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO;
import jp.co.softbrain.esales.customers.service.dto.NextActionsDTO;
import jp.co.softbrain.esales.customers.service.dto.NextSchedulesDTO;
import jp.co.softbrain.esales.customers.service.dto.PersonsInChargeDTO;
import jp.co.softbrain.esales.customers.service.dto.SelectCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.UpdateCustomerConnectionsMapOutDTO;
import jp.co.softbrain.esales.customers.service.dto.activities.CountActivityByCustomersRequest;
import jp.co.softbrain.esales.customers.service.dto.activities.CountActivityByCustomersResponse;
import jp.co.softbrain.esales.customers.service.dto.activities.CountActivityByCustomersSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.activities.GetActivitiesRequest;
import jp.co.softbrain.esales.customers.service.dto.activities.GetActivitiesResponse;
import jp.co.softbrain.esales.customers.service.dto.analysis.DashboardEmbedUrlResponse;
import jp.co.softbrain.esales.customers.service.dto.analysis.GetReportsRequest;
import jp.co.softbrain.esales.customers.service.dto.analysis.GetReportsResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.CountBusinessCardsByCustomerRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.CountBusinessCardsByCustomerResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationInSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationInSubType6DTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetDetailElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetEmployeeSuggestionsChoiceRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetEmployeeSuggestionsChoiceResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.GetFieldInfoTabsRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetFieldInfoTabsResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetTabsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetTabsInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.ReceiverDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.SuggestionsChoiceDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.TabsInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.UpdateListViewSettingRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.DataSyncElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupsRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.CountProductTradingbyCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.sales.CountProductTradingbyCustomersSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.sales.GetCountProductTradingbyCustomersRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingTabRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProgressesOutDTO;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProgressesRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.CountSchedulesRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CountSchedulesResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CountTaskByCustomerIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CountTaskByCustomerIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.CountTaskByCustomerIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.schedules.FilterWorkingDaysInDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.FilterWorkingDaysOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTaskTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTasksTabRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.RelationsWithCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.ScheduleCountByCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.SchedulesByCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.TaskAndScheduleByCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.TaskAndScheduleByCustomerRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.TasksByCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.timelines.CountTimelinesForm;
import jp.co.softbrain.esales.customers.service.dto.timelines.CountTimelinesInSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.timelines.CountTimelinesOutDTO;
import jp.co.softbrain.esales.customers.service.dto.timelines.CountTimelinesSubType1DTO;
import jp.co.softbrain.esales.customers.service.mapper.CustomerLayoutMapper;
import jp.co.softbrain.esales.customers.service.mapper.CustomersMapper;
import jp.co.softbrain.esales.customers.service.mapper.InformationDetailsCustomerMapper;
import jp.co.softbrain.esales.customers.service.mapper.MastersMotivationsMapper;
import jp.co.softbrain.esales.customers.service.mapper.MastersStandsMapper;
import jp.co.softbrain.esales.customers.service.mapper.SearchConditionsItemsMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.customers.util.ChannelUtils;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Service Implementation for managing {@link Customers}
 *
 * @author buithingocanh
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersServiceImpl implements CustomersService {
    private final Logger log = LoggerFactory.getLogger(CustomersServiceImpl.class);

    private static final String MODE = "mode";
    private static final Long NUMBER_ZERO = 0L;
    private static final Integer INTEGER_ZERO = 0;
    private static final String INF_SET_0008 = "INF_SET_0008";
    private static final String INF_SET_0009 = "INF_SET_0009";
    public static final String GET_FIELD_INFO_ITEM_API_METHOD = "getFieldInfoItemByFieldBelong";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    private static final String UPDATE_MASTER_MOTIVATIONS = "updateMasterMotivation";
    private static final String UPDATE_MASTER_STANDS = "updateMasterStand";
    private static final String DELETE_FILE_FAILED = "delete file failed";

    private static final String CUSTOMER_NAME = "customerName";
    public static final String SCENARIOIDS = "scenarioIds";
    private static final String FILE_NAME = "file_name";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private NetworksStandsRepository networksStandsRepository;

    @Autowired
    private MastersMotivationsMapper mastersMotivationsMapper;

    @Autowired
    private MastersStandsMapper mastersStandsMapper;

    @Autowired
    private CustomersMapper customersMapper;

    @Autowired
    private CustomersRepositoryCustom customersRepositoryCustom;

    @Autowired
    private MastersMotivationsRepository mastersMotivationsRepository;

    @Autowired
    private MastersStandsRepository mastersStandsRepository;

    @Autowired
    private CustomersCommonService customersCommonService;

    @Autowired
    private MastersMotivationsService mastersMotivationsService;

    @Autowired
    private CustomersBusinessService customersBusinessService;

    @Autowired
    private MastersStandsService mastersStandsService;

    @Autowired
    private CustomerLayoutMapper customerLayoutMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;
    @Autowired
    private ChannelUtils channelUtils;

    @Autowired
    private InformationDetailsCustomerMapper informationDetailsCustomerMapper;

    private Gson gson = new Gson();

    @Autowired
    private SearchConditionsItemsMapper searchConditionsItemsMapper;

    @Autowired
    private FieldInfoRepository fieldInfoRepository;

    @Autowired
    private CustomersListRepository customersListRepository;

    @Autowired
    private SchedulesRepository schedulesRepository;

    @Autowired
    private TasksRepository tasksRepository;
    
    @Autowired
    private CustomersHistoriesRepository customersHistoriesRepository;

    @Autowired
    private CustomersListMembersRepository customersListMembersRepository;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#save(jp.co.softbrain.esales.customers.service.dto.CustomersDTO)
     */
    @Override
    public CustomersDTO save(CustomersDTO dto) {
        Customers entity = customersMapper.toEntity(dto);
        entity = customersRepository.save(entity);
        return customersMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#saveAll(java.util.List)
     */
    @Override
    @Transactional
    public List<CustomersDTO> saveAll(List<CustomersDTO> customersDTOList) {
        List<Customers> customers = customersMapper.toEntity(customersDTOList);
        return customersMapper.toDto(customersRepository.saveAll(customers));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        customersRepository.deleteByCustomerId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersDTO> findOne(Long id) {
        return customersRepository.findByCustomerId(id).map(customersMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersDTO> findAll(Pageable pageable) {
        return customersRepository.findAll(pageable).map(customersMapper::toDto);
    }

    /**
     * Get all the Customers
     *
     * @return the list of the entities
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersDTO> findAll() {
        return customersRepository.findAll().stream().map(customersMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#countCustomers(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CountCustomersOutDTO countCustomers(Long employeeId) {
        CountCustomersOutDTO countCustomersOutDTO = new CountCustomersOutDTO();
        // 1. validate parameters
        countCustomersValidateParameter(employeeId);
        // 2. Get count the number of customers by employees are in chagre
        countCustomersOutDTO.setCount(customersRepository.countCustomers(employeeId));
        return countCustomersOutDTO;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service
     *      CustomersService#getCustomerConnectionsMap()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerConnectionsMapDTO getCustomerConnectionsMap() {
        GetCustomerConnectionsMapDTO reponse = new GetCustomerConnectionsMapDTO();
        // 1. get List masters_motivations
        List<MastersMotivations> listmastersMotivations = mastersMotivationsRepository
                .findAllByOrderByDisplayOrderAsc();
        List<MastersMotivationsDTO> reponseMasterMovation = new ArrayList<>();
        for (MastersMotivations motivations : listmastersMotivations) {
            MastersMotivationsDTO child = new MastersMotivationsDTO();
            if (!StringUtils.isBlank(motivations.getIconPath())) {
                child.setIconName(motivations.getIconName());
                child.setIconPath(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        motivations.getIconPath(), applicationProperties.getExpiredSeconds()));
            } else {
                child.setIconName(motivations.getIconName());
            }
            child.setBackgroundColor(motivations.getBackgroundColor());
            child.setDisplayOrder(motivations.getDisplayOrder());
            child.setIconType(motivations.getIconType());
            child.setIsAvailable(motivations.getIsAvailable());
            child.setMasterMotivationId(motivations.getMasterMotivationId());
            child.setMasterMotivationName(motivations.getMasterMotivationName());
            child.setUpdatedDate(motivations.getUpdatedDate());
            child.setCreatedUser(motivations.getCreatedUser());
            child.setUpdatedUser(motivations.getUpdatedUser());
            child.setCreatedDate(motivations.getCreatedDate());
            reponseMasterMovation.add(child);
        }

        // 2. get list masters_stands
        List<MastersStands> listMastersStands = mastersStandsRepository.findAllByOrderByDisplayOrderAsc();

        // 3. response
        List<MastersStandsDTO> masterStandsLst = new ArrayList<>();
        listMastersStands.forEach(masterStand -> {
            MastersStandsDTO mastersStandsDTO = mastersStandsMapper.toDto(masterStand);
            mastersStandsDTO.setUpdatedDate(masterStand.getUpdatedDate());
            mastersStandsDTO.setCreatedUser(masterStand.getCreatedUser());
            mastersStandsDTO.setUpdatedUser(masterStand.getUpdatedUser());
            mastersStandsDTO.setCreatedDate(masterStand.getCreatedDate());
            masterStandsLst.add(mastersStandsDTO);
        });
        reponse.setMastersStands(masterStandsLst);
        reponse.setMasterMotivations(reponseMasterMovation);
        return reponse;
    }

    /*
     * @see jp.co.softbrain.esales.customers.service
     * CustomersService#checkDeleteMasterScenarios(List Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CheckDeteleMasterScenariosOutDTO checkDeleteMasterScenarios(List<Long> scenarioIds) {
        CheckDeteleMasterScenariosOutDTO scenariosOutDTO = new CheckDeteleMasterScenariosOutDTO();
        // 1. Validate parameter
        if (scenarioIds == null || scenarioIds.isEmpty()) {
            throw new CustomRestException("[scenarioIds] = null ",
                    CommonUtils.putError(SCENARIOIDS, Constants.RIQUIRED_CODE));
        }
        // 2. Get masterMotivationIds
        List<Customers> checkDeleteMasterScenarios = customersRepository.findByscenarioIdIn(scenarioIds);
        // 3. create response
        List<Long> lstscenarioIds = checkDeleteMasterScenarios.stream().map(Customers::getScenarioId)
                .collect(Collectors.toList());
        scenariosOutDTO.setScenarios(lstscenarioIds);
        return scenariosOutDTO;
    }

    private void validateParam(List<Long> deletedMasterMotivations, List<Long> deletedMasterStands) {
        if (deletedMasterMotivations != null && !deletedMasterMotivations.isEmpty()) {
            // 2.1 check delete master motivations
            List<NetworksStands> checkDeleteMastersmotivations = networksStandsRepository
                    .findByMotivationIdIn(deletedMasterMotivations);

            if (!checkDeleteMastersmotivations.isEmpty()) {
                throw new CustomRestException("Param[deletedMasterMotivations] is exist",
                        CommonUtils.putError("deletedMasterMotivations", INF_SET_0009));
            }
        }
        if (deletedMasterStands != null && !deletedMasterStands.isEmpty()) {
            // 2.2 check delete master stands
            List<NetworksStands> checkDeleteMastersStands = networksStandsRepository
                    .findByStandIdIn(deletedMasterStands);

            if (!checkDeleteMastersStands.isEmpty()) {
                throw new CustomRestException("Param[deletedMasterStands] is exist",
                        CommonUtils.putError("deletedMasterStands", INF_SET_0008));
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service
     *      CustomersService#updateCustomerConnectionsMap(java.util.List<java.lang.Long>
     *      ,java.util.List<jp.co.softbrain.esales.customers.service.dto.MasterMotivationInDTO>
     *      ,java.util.List<java.lang.Long>
     *      ,java.util.List<jp.co.softbrain.esales.customers.service.dto.MasterStandsInDTO>
     *      ,graphql.schema.DataFetchingEnvironment)
     */
    @Override
    public UpdateCustomerConnectionsMapOutDTO updateCustomerConnectionsMap(List<Long> deletedMasterMotivations,
            List<MasterMotivationInDTO> masterMotivations, List<Long> deletedMasterStands,
            List<MasterStandsInDTO> masterStands, List<FileMappingDTO> files) throws IOException {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Check authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permision",
                    CommonUtils.putError(ConstantsCustomers.COLUMN_NAME_USER_ID, Constants.USER_NOT_PERMISSION));
        }
        // 2 Validate parameter
        validateParam(deletedMasterMotivations, deletedMasterStands);
        List<String> iconPathForDelete = new ArrayList<>();
        List<Long> deleteMasterMotivationsResponse = new ArrayList<>();
        List<Long> deleteMasterStandsResponse = new ArrayList<>();
        List<Long> insertMasterMotivations = new ArrayList<>();
        List<Long> updateMasterMotivations = new ArrayList<>();
        if (deletedMasterMotivations != null && !deletedMasterMotivations.isEmpty()) {
            // 3 get path file
            iconPathForDelete = mastersMotivationsRepository.findIconPath(deletedMasterMotivations);

            // 4 delete master motivations
            deleteMasterMotivationsResponse = mastersMotivationsRepository
                    .findListIdForDelete(deletedMasterMotivations);
            mastersMotivationsRepository.deleteByMasterMotivationIdIn(deleteMasterMotivationsResponse);
        }

        // 5 delete master stands
        if (deletedMasterStands != null && !deletedMasterStands.isEmpty()) {
            deleteMasterStandsResponse = mastersStandsRepository.findMastersStandsIdForDelete(deletedMasterStands);
            mastersStandsRepository.deleteByMasterStandIdIn(deleteMasterStandsResponse);
        }

        // 6 insert or update master motivation

        this.handleInsertUpdateMasterMotications(masterMotivations, employeeId, insertMasterMotivations,
                updateMasterMotivations, iconPathForDelete, files);
        List<Long> insertMasterStands = new ArrayList<>();
        List<Long> updateMasterStands = new ArrayList<>();

        // 7. insert or update master stands
        this.handleInsertOrUpdateMasterStands(masterStands, insertMasterStands, updateMasterStands);

        // 8 call API delete files
        this.deleteFiles(iconPathForDelete);

        // 9 create data response
        UpdateCustomerConnectionsMapOutDTO response = new UpdateCustomerConnectionsMapOutDTO();
        MasterMotivationOutDTO responseMasterMotivations = new MasterMotivationOutDTO();
        MasterStandOutDTO responseMasterStands = new MasterStandOutDTO();

        // set data to response master motivations
        responseMasterMotivations.setDeletedMasterMotivations(deleteMasterMotivationsResponse);
        responseMasterMotivations.setInsertedMasterMotivations(insertMasterMotivations);
        responseMasterMotivations.setUpdatedMasterMotivations(updateMasterMotivations);

        // set data to response master stands
        responseMasterStands.setDeletedMasterStands(deleteMasterStandsResponse);
        responseMasterStands.setInsertedMasterStands(insertMasterStands);
        responseMasterStands.setUpdatedMasterStands(updateMasterStands);

        // set response to DTO out
        response.setMasterMotivation(responseMasterMotivations);
        response.setMasterStand(responseMasterStands);

        return response;
    }

    /**
     * handle Insert Update MasterMotications
     *
     * @param masterMotivations : List masterMotivations for update
     * @param employeeId : employees id
     * @param imagePath : path image
     * @param insertMasterMotivations : List Long of output
     * @param updateMasterMotivations : List Long of output
     * @param iconPathForDelete : list string icon path for delete
     * @param files : files for upload file
     */
    private void handleInsertUpdateMasterMotications(List<MasterMotivationInDTO> masterMotivations, Long employeeId,
            List<Long> insertMasterMotivations, List<Long> updateMasterMotivations, List<String> iconPathForDelete,
            List<FileMappingDTO> files) {
        if (masterMotivations == null || masterMotivations.isEmpty()) {
            return;
        }
        for (MasterMotivationInDTO masterMotivationInDTO : masterMotivations) {
            StringBuilder imagePath = new StringBuilder();

            String iconName = mastersMotivationsRepository.findIconName(masterMotivationInDTO.getMasterMotivationId());
            if (iconName == null) {
                iconName = "";
            }
            if (iconName.equals(masterMotivationInDTO.getIconName())) {
                imagePath.append(mastersMotivationsRepository
                        .findIconPathForDelete(masterMotivationInDTO.getMasterMotivationId()));
            }
            if (INTEGER_ZERO.equals(masterMotivationInDTO.getIconType())
                    && !iconName.equals(masterMotivationInDTO.getIconName())) {
                // 6. call API uploadFiles
                files.forEach(filePath -> {
                    String uploadFileString = null;
                    String temp = filePath.getFileDataString();
                    String[] arrayPartName = temp.split("\\.");
                    if (arrayPartName.length > 0
                            && arrayPartName[0].equals(masterMotivationInDTO.getMasterMotivationId().toString())) {
                        List<FileMappingDTO> uploadFile = new ArrayList<>();
                        uploadFile.add(filePath);
                        String tenantName = jwtTokenUtil.getTenantIdFromToken();
                        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(employeeId,
                                uploadFile, tenantName, applicationProperties.getUploadBucket(),
                                FieldBelongEnum.CUSTOMER);
                        List<FileInfosDTO> listFile = new ArrayList<>();
                        if (uploadData != null) {
                            listFile = uploadData.get(masterMotivationInDTO.getMasterMotivationId()).get(FILE_NAME);
                        }

                        FileInfosDTO iconFile = listFile.get(0);
                        if (iconFile != null) {
                            uploadFileString = iconFile.getFilePath();
                        }
                        imagePath.append(uploadFileString);
                    }
                });
            }
            if (masterMotivationInDTO.getMasterMotivationId() < 0L) {
                // 6.1 insert master motivation
                masterMotivationInDTO.setMasterMotivationId(null);
                insertMasterMotivations
                        .add(this.insertOrUpdateMasterMotivations(masterMotivationInDTO, null, imagePath.toString())
                                .getMasterMotivationId());

            } else {
                // 6.2 update master motivation
                updateMasterMotivations(masterMotivationInDTO, iconPathForDelete, updateMasterMotivations,
                        imagePath.toString(), iconName);
            }
        }
    }

    /**
     * validate parameter api countCustomers
     *
     * @param employeeId employeeId
     */
    private void countCustomersValidateParameter(Long employeeId) {
        // 1.1 validate internal
        if (employeeId == null) {
            throw new CustomRestException("Param[employeeId] is null",
                    CommonUtils.putError(ConstantsCustomers.EMPLOYEE_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2 validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.EMPLOYEE_ID, employeeId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /*
     * @see jp.co.softbrain.esales.customers.service.CustomersService#
     * getChildCustomers(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetChildCustomersOutDTO getChildCustomers(Long customerId) {
        GetChildCustomersOutDTO getChildCustomersOutDTO = new GetChildCustomersOutDTO();
        // 1. validate parameter
        this.getChildCustomersValidateParameter(customerId);

        // 2. get child customers data
        List<GetChildCustomersSupType1DTO> childCustomers = customersRepositoryCustom.getChildCustomers(customerId)
                .stream().filter(child -> child.getLevel() > 0).collect(Collectors.toList());
        getChildCustomersOutDTO.setChildCustomers(childCustomers);
        return getChildCustomersOutDTO;
    }

    /**
     * validate parameter of api getChildCustomers
     *
     * @param customerId customerId
     */
    private void getChildCustomersValidateParameter(Long customerId) {
        // 1.1. validate internal
        if (customerId == null) {
            throw new CustomRestException("Param[employeeId] is null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }

        // 1.2. validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerList
     *      (java.lang.Boolean, java.lang.Boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerListOutDTO getCustomerList(Integer mode, Boolean isFavourite) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        if (mode == null) {
            mode = Integer.valueOf(1);
        }
        // get session info
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        GetCustomerListOutDTO getCustomerListOut = new GetCustomerListOutDTO();
        // get group and department of employeeId
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

        // 1. Get data myList
        List<CustomersListOptionalsDTO> myList = customersCommonService.getMyList(employeeId, departmentIds, groupIds,
                mode);
        List<GetCustomerListSubType1DTO> customerMyList = convertToListGetCustomerListSubType1DTO(myList);
        getCustomerListOut.setMyList(customerMyList);

        // 2. Get data sharedList
        Set<Long> setIds = new HashSet<>();
        List<CustomersListOptionalsDTO> sharedList = customersCommonService.getSharedList(employeeId, departmentIds,
                groupIds, mode).stream().filter(list -> setIds.add(list.getCustomerListId()))
                .collect(Collectors.toList());

        List<GetCustomerListSubType1DTO> customerSharedList = convertToListGetCustomerListSubType1DTO(sharedList);
        getCustomerListOut.setSharedList(customerSharedList);
        // 3. Get favouriteList
        if (Boolean.TRUE.equals(isFavourite)) {
            setIds.clear();
            List<CustomersListOptionalsDTO> favouriteList = customersCommonService.getFavouriteList(employeeId,
                    departmentIds, groupIds).stream().filter(list -> setIds.add(list.getCustomerListId()))
                    .collect(Collectors.toList());
            List<GetCustomerListSubType1DTO> customerFavouriteList = convertToListGetCustomerListSubType1DTO(
                    favouriteList);
            getCustomerListOut.setFavouriteList(customerFavouriteList);
        }
        return getCustomerListOut;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerSuggestion(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerSuggestionOutDTO getCustomerSuggestion(String keywords, Integer offset, List<Long> listIdChoice,
            Long relationFieldId) {
        GetCustomerSuggestionOutDTO responseDto = new GetCustomerSuggestionOutDTO();
        Long employeeIdToken = jwtTokenUtil.getEmployeeIdFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        // get custom field Info
        GetCustomFieldsInfoRequest fieldInforequest = new GetCustomFieldsInfoRequest();
        fieldInforequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInforequest,
                CommonFieldInfoResponse.class, token, tenantName);
        List<CustomFieldsInfoOutDTO> fieldInfoList = fieldResponse.getCustomFieldsInfo();

        Integer limit = 10;
        // 1. Check keywords
        List<Long> customerIds = new ArrayList<>();
        List<Long> employeeIdsElastic = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();
        List<Long> deparmentIdsElastic = new ArrayList<>();
        Map<Long,Long> customerMapping = new HashMap<>();
        if (StringUtil.isNull(keywords)) {
            // 2. Call API getEmployeeSuggestionsChoice
            List<SuggestionsChoiceDTO> historyChoice = getEmployeeSuggestionsChoice(employeeIdToken);
            if (CollectionUtils.isEmpty(historyChoice)) {
                return responseDto;
            } else {
                for (SuggestionsChoiceDTO data : historyChoice) {
                    customerIds.add(data.getIdResult());
                    customerMapping.put(data.getIdResult(), data.getSuggestionsChoiceId());
                }
            }
        } else {
            // 3. Search in elasticsearch
            List<SearchConditionDTO> searchConditionsGrpc = new ArrayList<>();
            if (StringUtils.isNotBlank(keywords)) {
                SearchConditionDTO fullNameItem = new SearchConditionDTO();
                fullNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.FULLTEXT.getCode()));
                fullNameItem.setFieldName(ConstantsCustomers.EMPLOYEE_FULL_NAME_FIELD);
                fullNameItem.setFieldValue(keywords);
                fullNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
                fullNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
                searchConditionsGrpc.add(fullNameItem);

                SearchConditionDTO fullNameKanaItem = new SearchConditionDTO();
                fullNameKanaItem.setFieldType(Integer.valueOf(FieldTypeEnum.FULLTEXT.getCode()));
                fullNameKanaItem.setFieldName(ConstantsCustomers.EMPLOYEE_FULL_NAME_KANA_FIELD);
                fullNameKanaItem.setFieldValue(keywords);
                fullNameKanaItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
                fullNameKanaItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
                searchConditionsGrpc.add(fullNameKanaItem);
            }
            GetDetailElasticSearchRequest elasticSearchRequest = new GetDetailElasticSearchRequest();
            elasticSearchRequest.setSearchConditions(searchConditionsGrpc);
            // set elasticsearch index
            String tenant = jwtTokenUtil.getTenantIdFromToken();
            if (StringUtil.isEmpty(tenant)) {
                tenant = TenantContextHolder.getTenant();
            }
            elasticSearchRequest.setIndex(String.format(ConstantsCustomers.ELASTICSEARCH_INDEX, tenant));
            // 3.1 call API get-detail-elastic-search
            SelectDetailElasticSearchResponse dataElasticSearchResponse = null;
            try {
                dataElasticSearchResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                        "get-detail-elastic-search", HttpMethod.POST, elasticSearchRequest,
                        SelectDetailElasticSearchResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
            } catch (RuntimeException e) {
                String msg = String.format(CALL_API_MSG_FAILED, ConstantsCustomers.GET_DATA_ELASTICSEARCH,
                        e.getLocalizedMessage());
                log.warn(msg);
                return responseDto;
            }
            // get employee_id list from elastic search result
            employeeIdsElastic = CustomersCommonUtil
                    .getIdsFromElasticSearchResponse(ConstantsCustomers.EMPLOYEE_ID_FIELD, dataElasticSearchResponse);

            // get department_id list from elastic search result
            deparmentIdsElastic = CustomersCommonUtil
                    .getIdsFromElasticSearchResponse(ConstantsCustomers.DEPARTMENT_ID_FIELD, dataElasticSearchResponse);

            // get group_id list from elastic search result
            groupIds = CustomersCommonUtil.getGroupIdsFromESResponse(dataElasticSearchResponse);

            // 3.2 Get customer id on ElasticSearch
            List<Long> customerIdsESResult = getCustomerElasticSearch(keywords, offset, limit);

            customerIds.addAll(customerIdsESResult);
        }
        // remove listIdChoice
        if (listIdChoice != null && !listIdChoice.isEmpty()) {
            customerIds = customerIds.stream()
                    .filter(customerId -> !listIdChoice.contains(customerId))
                    .collect(Collectors.toList());
        }

        List<Long> customerIdsCreatedRelation = new ArrayList<>();
        // 4. getCustomer Relation
        if (relationFieldId != null) {
            GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
            List<Long> relationIds = new ArrayList<>();
            relationIds.add(relationFieldId);
            request.setFieldIds(relationIds);
            List<CustomFieldsInfoOutDTO> fieldsList;
            CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST,
                    request,
                    CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null && fieldInfoResponse.getCustomFieldsInfo() != null) {
                fieldsList = fieldInfoResponse.getCustomFieldsInfo();
                if (Constants.RelationFormat.SINGLE.getValue().equals(fieldsList.get(0).getRelationData().getFormat())) {
                    customerIdsCreatedRelation
                            .addAll(customersRepositoryCustom.getCustomersIdsCreatedRelation(customerIds,
                                    fieldsList.get(0)));
                }
            }
        }
        // 6. Remove data customer not invalid
        customerIds = customerIds.stream().filter(customerId -> !customerIdsCreatedRelation.contains(customerId))
                .collect(Collectors.toList());

        // 7. get information customers
        List<GetCustomersByIdsSubType1DTO> listInfoCustomer = customersRepositoryCustom.getCustomersSuggestionByIds(
                customerIds, groupIds, employeeIdsElastic, deparmentIdsElastic, offset, limit);
        // 8. create response
        List<GetCustomerSuggestionSubType1DTO> customers = new ArrayList<>();
        if (listInfoCustomer != null && !listInfoCustomer.isEmpty()) {
            listInfoCustomer.forEach(item -> {
                GetCustomerSuggestionSubType1DTO dto = new GetCustomerSuggestionSubType1DTO();
                dto.setCustomerId(item.getCustomerId());
                dto.setCustomerName(item.getCustomerName());
                dto.setCustomerAliasName(item.getCustomerAliasName());
                dto.setCreatedDate(item.getCreatedDate());
                dto.setUpdatedDate(item.getUpdatedDate());
                dto.setPhoneNumber(item.getPhoneNumber());
                dto.setUrl(item.getUrl());
                dto.setMemo(item.getMemo());
                dto.setCustomerAddress(getAddressResoponse(item.getZipCode(), item.getBuilding(), item.getAddress()));
                PersonsInChargeDTO personsInCharge = new PersonsInChargeDTO();
                personsInCharge.setEmployeeId(item.getEmployeeId());
                personsInCharge.setDepartmentId(item.getDepartmentId());
                personsInCharge.setGroupId(item.getGroupId());
                dto.setPersonInCharge(personsInCharge);
                CustomerPhotoDTO customerPhoto = new CustomerPhotoDTO();
                customerPhoto.setPhotoFileName(item.getPhotoFileName());
                customerPhoto.setPhotoFilePath(item.getPhotoFilePath());
                customerPhoto.setFileUrl(buildFileUrl(item.getPhotoFilePath()));
                dto.setCustomerLogo(customerPhoto);
                dto.setCustomerData(CustomersCommonUtil.parseJsonCustomerData(item.getCustomerData(), fieldInfoList));
                if (StringUtil.isNull(keywords)) {
                    dto.setIdHistoryChoice(customerMapping.get(item.getCustomerId()));
                }
                customers.add(dto);
            });
        }
        responseDto.setCustomers(customers);
        return responseDto;
    }

    /**
     * Get address for response
     * 
     * @param zipCode
     *            zipCode
     * @param building
     *            building
     * @param address
     *            address
     * @return address response
     */
    private String getAddressResoponse(String zipCode, String building, String address) {
        StringBuilder addressBuider = new StringBuilder();
        if (!StringUtil.isEmpty(zipCode)) {
            addressBuider.append(zipCode);
            addressBuider.append(Constants.Query.SPACE);
        }
        if (!StringUtil.isEmpty(building)) {
            addressBuider.append(building);
            addressBuider.append(Constants.Query.SPACE);
        }
        if (!StringUtil.isEmpty(address)) {
            addressBuider.append(address);
        }
        return addressBuider.toString();
    }

    /**
     * Get customer id from elastich search
     * 
     * @param keywords
     *            keywords
     * @param employeeIdsElastic
     *            employee_id
     * @param deparmentIdsElastic
     *            department_id
     * @param groupIds
     *            group_id
     * @return list customer_id
     */
    private List<Long> getCustomerElasticSearch(String keywords, Integer offset, Integer limit) {
        List<Long> customerIds = new ArrayList<>();
        GetDetailElasticSearchRequest elasticSearchRequest = new GetDetailElasticSearchRequest();

        // set elasticsearch index
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (StringUtil.isEmpty(tenant)) {
            tenant = TenantContextHolder.getTenant();
        }
        elasticSearchRequest.setIndex(String.format(ConstantsCustomers.CUSTOMER_ELASTICSEARCH_INDEX, tenant));
        elasticSearchRequest.setOffset(offset);
        elasticSearchRequest.setLimit(limit);

        // build parameter "searchConditons"
        List<SearchConditionDTO> searchConditionList = new ArrayList<>();

        SearchConditionDTO cusNameItem = new SearchConditionDTO();
        cusNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        cusNameItem.setFieldName(ConstantsCustomers.CUSTOMER_NAME_FIELD);
        cusNameItem.setFieldValue(keywords);
        cusNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        cusNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
        searchConditionList.add(cusNameItem);

        SearchConditionDTO cusAliasNameItem = new SearchConditionDTO();
        cusAliasNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        cusAliasNameItem.setFieldName(ConstantsCustomers.CUSTOMER_ALIAS_NAME_FIELD);
        cusAliasNameItem.setFieldValue(keywords);
        cusAliasNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        cusAliasNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
        searchConditionList.add(cusAliasNameItem);

        SearchConditionDTO cusparentNameItem = new SearchConditionDTO();
        cusparentNameItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        cusparentNameItem.setFieldName(ConstantsCustomers.CUSTOMER_PARENT_NAME_FIELD);
        cusparentNameItem.setFieldValue(keywords);
        cusparentNameItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        cusparentNameItem.setFieldOperator(Constants.Elasticsearch.Operator.OR.getValue());
        searchConditionList.add(cusparentNameItem);
        // add to searchcondition
        elasticSearchRequest.setSearchConditions(searchConditionList);

        String token = SecurityUtils.getTokenValue().orElse(null);
        SelectDetailElasticSearchResponse dataElasticSearchResponse = null;
        try {
            dataElasticSearchResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-detail-elastic-search", HttpMethod.POST, elasticSearchRequest,
                    SelectDetailElasticSearchResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (RuntimeException e) {
            String msg = String.format(CALL_API_MSG_FAILED, ConstantsCustomers.GET_DATA_ELASTICSEARCH,
                    e.getLocalizedMessage());
            log.warn(msg);
            throw e;
        }
        customerIds.addAll(CustomersCommonUtil
                .getIdsFromElasticSearchResponse(ConstantsCustomers.CUSTOMER_COLUMN_ID,
                dataElasticSearchResponse));
        return customerIds;
    }

    /**
     * Call API to get Employee Suggestions Choice
     *
     * @param employeeId
     *            id of employee
     * @param searchType
     * @return
     */
    private List<SuggestionsChoiceDTO> getEmployeeSuggestionsChoice(Long employeeId) {
        List<SuggestionsChoiceDTO> historyChoice = new ArrayList<>();
        try {
            List<String> indexList = new ArrayList<>();
            indexList.add(ConstantsCustomers.INDEX_CUSTOMER_SUGGEST);
            GetEmployeeSuggestionsChoiceRequest reBuilder = new GetEmployeeSuggestionsChoiceRequest();
            reBuilder.setEmployeeId(employeeId);
            reBuilder.setIndex(indexList);
            reBuilder.setLimit(10);
            String token = SecurityUtils.getTokenValue().orElse(null);
            // Validate commons
            GetEmployeeSuggestionsChoiceResponse suChoiceResponse = restOperationUtils.executeCallApi(
                    Constants.PathEnum.COMMONS, ConstantsCustomers.API_GET_EMPLOYEE_SUGGESTION_CHOICE, HttpMethod.POST,
                    reBuilder, GetEmployeeSuggestionsChoiceResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
            if (suChoiceResponse != null && suChoiceResponse.getEmployeeSuggestionsChoice() != null) {
                historyChoice = suChoiceResponse.getEmployeeSuggestionsChoice();
            }
        } catch (Exception e) {
            throw new CustomRestException(e.getMessage(),
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        return historyChoice;
    }

    /**
     * convert list object of class CustomersListOptionalsDTO to list object of
     * class GetCustomerListSubType1DTO
     *
     * @param listCustomersListOptionalsDTO list object of class
     *        CustomersListOptionalsDTO
     * @return list object of class GetCustomerListSubType1DTO
     */
    private List<GetCustomerListSubType1DTO> convertToListGetCustomerListSubType1DTO(
            List<CustomersListOptionalsDTO> listCustomersListOptionalsDTO) {
        List<GetCustomerListSubType1DTO> result = new ArrayList<>();
        for (CustomersListOptionalsDTO item : listCustomersListOptionalsDTO) {
            GetCustomerListSubType1DTO customerListSubType1 = new GetCustomerListSubType1DTO();
            customerListSubType1.setListId(item.getCustomerListId());
            customerListSubType1.setListName(item.getCustomerListName());
            customerListSubType1.setIsAutoList(item.getIsAutoList());
            customerListSubType1.setCustomerListType(item.getCustomerListType());
            customerListSubType1.setUpdatedDate(item.getUpdatedDate());
            customerListSubType1.setParticipantType(item.getParticipantType());
            customerListSubType1.setIsOverWrite(item.getIsOverWrite());
            result.add(customerListSubType1);
        }
        return result;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerIdByName(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerIdByCustomerNameOutDTO getCustomerIdByName(String customerName) {
        // 1.Validate parameters
        if (customerName == null) {
            throw new CustomRestException("Param[customer_name] is null",
                    CommonUtils.putError(CUSTOMER_NAME, Constants.RIQUIRED_CODE));
        }
        // 2.Get customerId by customerName
        GetCustomerIdByCustomerNameOutDTO response = null;
        List<Customers> customer = customersRepository.findAllByCustomerNameOrderByCreatedDateDesc(customerName);
        if (customer == null || customer.isEmpty()) {
            return response;
        }
        response = new GetCustomerIdByCustomerNameOutDTO();
        response.setCustomerId(customer.get(0).getCustomerId());
        response.setUpdatedDate(customer.get(0).getUpdatedDate());
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCountRelationCustomer(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CountRelationCustomerOutDTO> getCountRelationCustomer(List<Long> customerIds) {
        List<CountRelationCustomerOutDTO> listCountRelations = new ArrayList<>();
        // 1. validate parameter
        this.countRelationCustomerValidateParameter(customerIds);
        // 2 Get the data related to the customer
        for (Long customerId : customerIds) {
            CountRelationCustomerOutDTO dto = new CountRelationCustomerOutDTO();
            dto.setCustomerId(customerId);
            listCountRelations.add(dto);
        }
        // count business card by customer
        countBusinessByCustomers(listCountRelations, customerIds);

        // count activities by customers
        countActivitiesByCustomers(listCountRelations, customerIds);

        // count task by customers
        countTaskByCustomers(listCountRelations, customerIds);

        // count product by customers
        countProductTradingsByCustomers(listCountRelations, customerIds);

        // count schedule by customer
        countSchedulesByCustomers(listCountRelations, customerIds);

        // count timeline
        countTimeLinesByCustomers(listCountRelations, customerIds);

        // TODO: count mails

        return listCountRelations;
    }

    /**
     * Count timeline by customer
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countTimeLinesByCustomers(List<CountRelationCustomerOutDTO> listCountRelations,
            List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        CountTimelinesForm countTimelineRequest = new CountTimelinesForm();

        CountTimelinesInSubType1DTO inputParam = new CountTimelinesInSubType1DTO();
        inputParam.setInputId(customerIds);
        inputParam.setInputType(ConstantsCustomers.TIMELINE_TYPE_CUSTOMER);
        countTimelineRequest.setInputParam(inputParam);
        countTimelineRequest.setCountType(Arrays.asList(1));
        try {
            CountTimelinesOutDTO countTimelineResponse = restOperationUtils.executeCallApi(PathEnum.TIMELINES,
                    ConstantsCustomers.API_COUNT_TIME_LINES, HttpMethod.POST, countTimelineRequest,
                    CountTimelinesOutDTO.class, token, tenantName);

            List<CountTimelinesSubType1DTO> listCounted = countTimelineResponse.getResults();
            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                listCounted.stream().filter(counted -> counted.getId().equals(customer.getCustomerId()))
                        .findAny()
                        .ifPresent(counted -> customer
                                .setCountTimelines(counted.getResult() == null ? ConstantsCustomers.LONG_VALUE_0L
                                        : counted.getResult()));
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_COUNT_SCHEDULES,
                    e.getLocalizedMessage()));
        }
    }

    /**
     * Count schedules by customers
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countSchedulesByCustomers(List<CountRelationCustomerOutDTO> listCountRelations,
            List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        CountSchedulesRequestDTO countScheduleRequest = new CountSchedulesRequestDTO();
        countScheduleRequest.setCustomerIds(customerIds);
        countScheduleRequest.setEmployeeIds(new ArrayList<>());

        try {
            CountSchedulesResponseDTO countSchedulesResponse = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_COUNT_SCHEDULES, HttpMethod.POST, countScheduleRequest,
                    CountSchedulesResponseDTO.class, token, tenantName);

            List<ScheduleCountByCustomerDTO> listCounted = countSchedulesResponse.getCountScheduleByCustomers();
            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                listCounted.stream().filter(counted -> counted.getCustomerId().equals(customer.getCustomerId()))
                        .findAny()
                        .ifPresent(counted -> customer.setCountSchedules(
                                counted.getNumberOfSchedule() == null ? ConstantsCustomers.LONG_VALUE_0L
                                        : Long.valueOf(counted.getNumberOfSchedule())));
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_COUNT_SCHEDULES,
                    e.getLocalizedMessage()));
        }

    }

    /**
     * Count product tradings by customers
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countProductTradingsByCustomers(List<CountRelationCustomerOutDTO> listCountRelations,
            List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        GetCountProductTradingbyCustomersRequest countProductTradingsRequest = new GetCountProductTradingbyCustomersRequest();
        countProductTradingsRequest.setCustomerIds(customerIds);

        try {
            CountProductTradingbyCustomersDTO countProductTradingsResponse = restOperationUtils.executeCallApi(
                    PathEnum.SALES, ConstantsCustomers.API_GET_COUNT_PRODUCT_TRADING_BY_CUSTOMERS, HttpMethod.POST,
                    countProductTradingsRequest, CountProductTradingbyCustomersDTO.class, token, tenantName);

            List<CountProductTradingbyCustomersSubType1DTO> listCounted = countProductTradingsResponse
                    .getQuantityProductTradingByCustomers();
            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                listCounted.stream().filter(counted -> counted.getCustomerId().equals(customer.getCustomerId()))
                        .findAny()
                        .ifPresent(counted -> customer.setCountProductTrading(
                                counted.getQuantityProductTrading() == null ? ConstantsCustomers.LONG_VALUE_0L
                                        : Long.valueOf(counted.getQuantityProductTrading())));
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_COUNT_PRODUCT_TRADING_BY_CUSTOMERS, e.getLocalizedMessage()));
        }
    }

    /**
     * Count activities by customers
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countTaskByCustomers(List<CountRelationCustomerOutDTO> listCountRelations, List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        CountTaskByCustomerIdsRequest countTaskRequest = new CountTaskByCustomerIdsRequest();
        countTaskRequest.setCustomerIds(customerIds);

        try {
            CountTaskByCustomerIdsResponse countTaskResponse = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_COUNT_TASK_BY_CUSTOMER_IDS, HttpMethod.POST, countTaskRequest,
                    CountTaskByCustomerIdsResponse.class, token, tenantName);

            List<CountTaskByCustomerIdsOutDTO> listCounted = countTaskResponse.getTasks();

            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                listCounted.stream().filter(counted -> counted.getCustomerId().equals(customer.getCustomerId()))
                        .findAny()
                        .ifPresent(counted -> customer
                                .setCountTasks(counted.getCountTask() == null ? ConstantsCustomers.LONG_VALUE_0L
                                        : Long.valueOf(counted.getCountTask())));
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_COUNT_TASK_BY_CUSTOMER_IDS, e.getLocalizedMessage()));
        }

    }

    /**
     * Count activities by customers
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countActivitiesByCustomers(List<CountRelationCustomerOutDTO> listCountRelations,
            List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        CountActivityByCustomersRequest countActivityRequest = new CountActivityByCustomersRequest();
        countActivityRequest.setCustomerIds(customerIds);

        try {
            CountActivityByCustomersResponse countActivityResponse = restOperationUtils.executeCallApi(
                    PathEnum.ACTIVITIES, ConstantsCustomers.API_COUNT_ACTIVITY_BY_CUSTOMERS, HttpMethod.POST,
                    countActivityRequest, CountActivityByCustomersResponse.class, token, tenantName);

            List<CountActivityByCustomersSubType1DTO> listCounted = countActivityResponse
                    .getQuantityActivityByCustomers();

            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                listCounted.stream().filter(counted -> counted.getCustomerId().equals(customer.getCustomerId()))
                        .findAny()
                        .ifPresent(counted -> customer.setCountActivities(
                                counted.getQuantityActivity() == null ? ConstantsCustomers.LONG_VALUE_0L
                                        : Long.valueOf(counted.getQuantityActivity())));
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_COUNT_ACTIVITY_BY_CUSTOMERS, e.getLocalizedMessage()));
        }

    }

    /**
     * Count business cards by customers
     * 
     * @param listCountRelations - list to save data
     * @param customerIds - list id to get data
     */
    private void countBusinessByCustomers(List<CountRelationCustomerOutDTO> listCountRelations,
            List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        CountBusinessCardsByCustomerRequest countBusinessRequest = new CountBusinessCardsByCustomerRequest();
        countBusinessRequest.setCustomerIds(customerIds);

        try {
            CountBusinessCardsByCustomerResponse countBusinessResponse = restOperationUtils.executeCallApi(
                    PathEnum.BUSINESSCARDS, ConstantsCustomers.API_COUNT_BUSINESS_CARDS_BY_CUSTOMER, HttpMethod.POST,
                    countBusinessRequest, CountBusinessCardsByCustomerResponse.class, token, tenantName);
            if (countBusinessResponse == null
                    || StringUtils.isBlank(countBusinessResponse.getBusinessCardsByCustomer())) {
                return;
            }
            TypeReference<Map<Long, Long>> mapType = new TypeReference<Map<Long, Long>>() {};
            Map<Long, Long> mapCount = objectMapper.readValue(countBusinessResponse.getBusinessCardsByCustomer(),
                    mapType);

            for (CountRelationCustomerOutDTO customer : listCountRelations) {
                if (mapCount.get(customer.getCustomerId()) != null) {
                    customer.setCountBusinessCard(mapCount.get(customer.getCustomerId()));
                }
            }

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_COUNT_BUSINESS_CARDS_BY_CUSTOMER, e.getLocalizedMessage()));
        }
    }

    /**
     * validate parameter api countCustomers
     *
     * @param customerIds list of the customerId
     */
    private void countRelationCustomerValidateParameter(List<Long> customerIds) {
        // 1.1 validate internal
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException("Param[employeeIds] is null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // 1.2 validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_IDS, customerIds);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomersTab(java.lang.Integer,
     *      java.lang.Integer, java.lang.Integer, java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomersTabOutDTO getCustomersTab(Integer tabBelong, Integer currentPage, Integer limit,
            List<GetCustomersTabSubType1DTO> searchConditions, String languageCode) {
        GetCustomersTabOutDTO response = new GetCustomersTabOutDTO();
        GetCustomersTabSubType2DTO data = new GetCustomersTabSubType2DTO();
        // 1. validate parameter
        getCustomersTabValidateParameter(tabBelong, currentPage, limit);
        // 2. get information customers
        List<GetCustomersTabSubType3DTO> customers = customersRepositoryCustom.getInfoCustomers(limit, currentPage,
                searchConditions);
        data.setCustomers(getInfoCustomersFromData(customers));
        // 3. get more information tab info
        // call getFieldInfoTabs
        data.setFieldInfo(this.callGetFieldInfoTabs(tabBelong));
        response.setData(data);
        return response;
    }

    /**
     * get info customers from data
     *
     * @param customers data
     * @return the entity of GetCustomersTabSubType3DTO
     */
    private List<GetCustomersTabSubType3DTO> getInfoCustomersFromData(List<GetCustomersTabSubType3DTO> customers) {
        List<GetCustomersTabSubType3DTO> customersReponse = new ArrayList<>();
        if (customers != null && !customers.isEmpty()) {
            for (GetCustomersTabSubType3DTO item : customers) {
                GetCustomersTabSubType3DTO dto = new GetCustomersTabSubType3DTO();
                dto.setCustomerId(item.getCustomerId());
                dto.setCustomerName(item.getCustomerName());
                dto.setPhoneNumber(item.getPhoneNumber());
                dto.setBuilding(item.getBuilding());
                dto.setAddress(item.getAddress());
                dto.setBusinessMainName(item.getBusinessMainName());
                dto.setBusinessSubName(item.getBusinessSubName());
                dto.setCreatedDate(item.getCreatedDate());
                dto.setUpdatedDate(item.getUpdatedDate());
                customersReponse.add(dto);
            }
        }
        return customersReponse;
    }

    /**
     * get info customers
     * 
     * @param tabBelong tabBelong
     * @param languageCode languageCode
     * @return the list entity of GetCustomersTabSubType4DTO
     */
    private FieldInfosTabDTO callGetFieldInfoTabs(Integer tabBelong) {
        GetFieldInfoTabsRequest request = new GetFieldInfoTabsRequest();
        request.setTabId(4);
        request.setTabBelong(tabBelong);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        GetFieldInfoTabsResponseDTO fieldInfoTabResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_TABS_INFO, HttpMethod.POST, request, GetFieldInfoTabsResponseDTO.class,
                token, tenantName);
        FieldInfosTabDTO fieldInfosTabDTO = new FieldInfosTabDTO();
        if (fieldInfoTabResponse == null) {
            return fieldInfosTabDTO;
        }
        fieldInfosTabDTO.setData(fieldInfoTabResponse.getData());
        fieldInfosTabDTO.setFields(fieldInfoTabResponse.getFields());
        return fieldInfosTabDTO;
    }

    /**
     * validate parameter api getCustomersTab
     * 
     * @param tabBelong id function
     * @param currentPage current page
     * @param limit limit
     */
    private void getCustomersTabValidateParameter(Integer tabBelong, Integer currentPage, Integer limit) {
        // 1. validate internal
        if (tabBelong == null) {
            throw new CustomRestException("Param[tabBelong] is null",
                    CommonUtils.putError(ConstantsCustomers.TAB_BELONG, Constants.RIQUIRED_CODE));
        }
        // 2. validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.TAB_BELONG, tabBelong);
        fixedParams.put(ConstantsCustomers.CURRENT_PAGE, currentPage);
        fixedParams.put(ConstantsCustomers.LIMIT, limit);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#deleteCustomers(java.util.List)
     */
    @Override
    @Transactional
    public DeleteCustomersOutDTO deleteCustomers(List<Long> customerIds) {
        // 1. validate parameters
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // get session info
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (tenant == null) {
            tenant = TenantContextHolder.getTenant();
        }
        final String tenantName = tenant;

        // delete data of customer
        customerIds = customerIds.stream().distinct().collect(Collectors.toList());
        DeleteCustomersOutDTO outDto = new DeleteCustomersOutDTO();
        outDto.getCustomerIdsDeleteSuccess().addAll(customerIds);

        Map<Long, String> mapIdAndName = new LinkedHashMap<>();

        customerIds.stream().forEach(id -> {
            CustomersDTO dto = this.findOne(id).orElse(null);
            List<String> errorCodes = new ArrayList<>();
            if (dto == null) {
                errorCodes.add(Constants.EXCLUSIVE_CODE);
            }
            try {
                // deleteBusinessCard
                errorCodes.addAll(
                        CustomersCommonUtil.deleteBusinessCardByCustomers(id, restOperationUtils, token, tenantName));
                // deleteSchedules
                errorCodes.addAll(CustomersCommonUtil.deleteSchedulesByCustomers(Arrays.asList(id), restOperationUtils,
                        token, tenantName));
                // deleteActivities
                errorCodes.addAll(CustomersCommonUtil.deleteActivitiesByCustomers(Arrays.asList(id), restOperationUtils,
                        token, tenantName));
                // deleteTask
                errorCodes.addAll(CustomersCommonUtil.deleteTaskByCustomers(Arrays.asList(id), restOperationUtils,
                        token, tenantName));
                // deleteTimeline
                errorCodes.addAll(CustomersCommonUtil.deleteTimelineByCustomers(Arrays.asList(id), restOperationUtils,
                        token, tenantName));
                // deleteProductTrading
                errorCodes.addAll(CustomersCommonUtil.deleteProductTradingsByCustomers(Arrays.asList(id),
                        restOperationUtils, token, tenantName));
                // TODO: delete mail
            } catch (Exception e) {
                log.debug("Can not delete relation data");
            }

            if (!errorCodes.isEmpty()) {
                outDto.getCustomerIdsDeleteSuccess().remove(id);
                DeleteCustomersOutSubTypeDTO deleteError = new DeleteCustomersOutSubTypeDTO();
                deleteError.setCustomerId(id);
                deleteError.setErrorCodes(errorCodes);
                outDto.getCustomerDeleteFails().add(deleteError);
                return;
            }
            mapIdAndName.put(id, dto.getCustomerName());
        });


        if (outDto.getCustomerIdsDeleteSuccess().isEmpty()) {
            return outDto;
        }
        // delete Customer
        List<Long> listIdToDelete = outDto.getCustomerIdsDeleteSuccess();

        // get child customer before delete
        List<Long> listIdChildsUpdated = new ArrayList<>();

        List<Customers> childList = customersRepository.findAllByParentIdIn(listIdToDelete);
        if (!childList.isEmpty()) {
            // update list child
            for (Customers child : childList) {
                listIdChildsUpdated.add(child.getCustomerId());
                mapIdAndName.put(child.getCustomerId(), child.getCustomerName());
                child.setParentId(null);
                child.setUpdatedUser(userId);
            }
            customersRepository.saveAll(childList);
            // get distinct list customer child
            listIdChildsUpdated.removeIf(listIdToDelete::contains);
        }

        // 3.3 Delete history of customer
        customersHistoriesRepository.deleteByCustomerIdIn(listIdToDelete);
        // Delete customers in customers_list_members
        customersListMembersRepository.deleteByCustomerIdIn(listIdToDelete);
        // delete customer
        customersRepository.deleteByCustomerIdIn(listIdToDelete);

        // 6. Call API createNotification
        List<Long> listIdNotification = new ArrayList<>();
        listIdNotification.addAll(listIdToDelete);
        listIdNotification.addAll(listIdChildsUpdated);

        CreateNotificationRequest notificationReq = new CreateNotificationRequest();
        notificationReq.setDataNotification(new CreateNotificationInSubType1DTO(userId, 4, 1));

        ReceiverDTO receiverDTO = new ReceiverDTO();
        receiverDTO.setReceiverName(jwtTokenUtil.getEmployeeNameFromToken());
        List<ReceiverDTO> receiverList = new ArrayList<>();
        receiverList.add(receiverDTO);

        List<CreateNotificationInSubType6DTO> customerList = new ArrayList<>();
        for (Long idDeleted : listIdNotification) {
            CreateNotificationInSubType6DTO customerDTO = new CreateNotificationInSubType6DTO();
            customerDTO.setCustomerId(idDeleted);
            customerDTO.setReceivers(receiverList);
            customerDTO.setCustomerName(mapIdAndName.get(idDeleted));
            customerDTO.setCustomerMode(2);
            customerList.add(customerDTO);
        }
        notificationReq.setCustomer(customerList);

        try {
            restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, ConstantsCustomers.API_CREATE_NOTIFICATION,
                    HttpMethod.POST, notificationReq, CreateNotificationResponse.class,
                    SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_CREATE_NOTIFICATION,
                    e.getLocalizedMessage()));
        }

        // 5. sync data on ElasticSearch
        // sync data child list
        if (!listIdChildsUpdated.isEmpty()) {
            customersCommonService.syncDataElasticSearch(null, listIdChildsUpdated,
                    Constants.ChangeAction.UPDATE.getValue());
        }

        // sync data
        if (Boolean.FALSE.equals(customersCommonService.syncDataElasticSearch(null,
                listIdToDelete, Constants.ChangeAction.DELETE.getValue()))) {
            throw new CustomRestException(ConstantsCustomers.INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return outDto;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#updateGeocodingCustomer(java.lang.Long,
     *      java.math.BigDecimal, java.math.BigDecimal)
     */
    @Override
    @Transactional
    public Long updateGeocodingCustomer(Long customerId, BigDecimal latitude, BigDecimal longitude,
            Instant updatedDate) {
        List<Map<String, Object>> listValidate = new ArrayList<>();
        // validate require parameter
        if (customerId == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        if (longitude == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.PARAM_LONGITUDE, Constants.RIQUIRED_CODE));
        }
        if (latitude == null) {
            listValidate.add(CommonUtils.putError(ConstantsCustomers.PARAM_LATITUDE, Constants.RIQUIRED_CODE));
        }
        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> customParams = new HashMap<>();
        customParams.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        customParams.put(ConstantsCustomers.PARAM_LATITUDE, latitude);
        customParams.put(ConstantsCustomers.PARAM_LONGITUDE, longitude);
        String validateJson = jsonBuilder.build(FieldBelongEnum.CUSTOMER.getCode(), (Map<String, Object>) null,
                customParams);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        listValidate.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!listValidate.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, listValidate);
        }
        // update data customers
        CustomersDTO dto = this.findOne(customerId).orElse(null);
        if (dto == null) {
            throw new CustomRestException(ConstantsCustomers.MSG_CUSTOMER_NOT_EXISTED,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.EXCLUSIVE_CODE));
        }

        dto.setLongitude(longitude);
        dto.setLatitude(latitude);
        return this.save(dto).getCustomerId();
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerAddresses(java.util.List)
     */
    @Override
    @Transactional(readOnly = true)
    public CustomerAddressesOutDTO getCustomerAddresses(List<Long> customerIds) {
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        CustomerAddressesOutDTO outDto = new CustomerAddressesOutDTO();
        List<CustomersDTO> listDto = customersMapper.toDto(customersRepository.findAllById(customerIds));
        if (listDto == null || listDto.isEmpty()) {
            return outDto;
        }
        // initialize for listAddress
        List<CustomerAddressesOutSubTypeDTO> listAddresses = new ArrayList<>();
        CustomerAddressesOutSubTypeDTO add = new CustomerAddressesOutSubTypeDTO();
        add.setLatitude(listDto.get(0).getLatitude());
        add.setLongitude(listDto.get(0).getLongitude());
        listAddresses.add(add);
        // loop in listDto and add address for listAddresses
        listDto.stream().forEach(dto -> {
            for (int index = 0; index < listAddresses.size(); ++index) {
                if (listAddresses.get(index).getLongitude().equals(dto.getLongitude())
                        && listAddresses.get(index).getLatitude().equals(dto.getLatitude())) {
                    listAddresses.get(index).getCustomerIds().add(dto.getCustomerId());
                    return;
                }
            }
            CustomerAddressesOutSubTypeDTO address = new CustomerAddressesOutSubTypeDTO();
            address.getCustomerIds().add(dto.getCustomerId());
            address.setLatitude(dto.getLatitude());
            address.setLongitude(dto.getLongitude());
            listAddresses.add(address);
        });
        outDto.setCustomerAddresses(listAddresses);
        return outDto;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getScenario(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetScenarioOutDTO getScenario(Long customerId) {
        // 1. validate parameter
        if (customerId == null) {
            throw new CustomRestException(ConstantsCustomers.MSG_PARAMETER_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }

        // common validate
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!CollectionUtils.isEmpty(errors)) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // 2. Get scenario info
        return customersCommonService.getScenario(customerId);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerLayout()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CustomerLayoutCustomResponseDTO getCustomerLayout() {
        CustomerLayoutCustomResponseDTO response = new CustomerLayoutCustomResponseDTO();

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        // get custom field Info
        GetCustomFieldsInfoRequest fieldInforequest = new GetCustomFieldsInfoRequest();
        fieldInforequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInforequest,
                CommonFieldInfoResponse.class, token, tenantName);
        List<CustomFieldsInfoOutDTO> fieldInfoList = fieldInfoResponse.getCustomFieldsInfo();

        response.getFields().addAll(processingGetCustomFieldInfo(fieldInfoList));
        return response;
    }

    /**
     * processing API get customFieldInfo
     * 
     * @param fieldInfoList
     * @return list mapped
     */
    private List<CustomerLayoutCustomFieldInfoDTO> processingGetCustomFieldInfo(
            List<CustomFieldsInfoOutDTO> fieldInfoList) {
        List<CustomerLayoutCustomFieldInfoDTO> listMapped = new ArrayList<>();
        
        if (CollectionUtils.isEmpty(fieldInfoList)) {
            return listMapped;
        }
        // get response

        List<CustomersBusinessDTO> listBusiness = customersBusinessService.findAll().stream()
                .sorted(Comparator.comparing(CustomersBusinessDTO::getCustomerBusinessId)).collect(Collectors.toList());
        listMapped.addAll(customerLayoutMapper.toDto(fieldInfoList));
        List<CustomerLayoutFieldItemDTO> listBusinessItem = listBusiness.stream().map(b -> {
            CustomerLayoutFieldItemDTO businessFieldItem = new CustomerLayoutFieldItemDTO();
            businessFieldItem.setIsAvailable(true);
            businessFieldItem.setIsDefault(true);
            businessFieldItem.setItemId(b.getCustomerBusinessId());
            businessFieldItem.setItemLabel(b.getCustomerBusinessName());
            businessFieldItem.setItemParentId(b.getCustomerBusinessParent());
            return businessFieldItem;
        }).collect(Collectors.toList());
        // build listItem tree
        List<CustomerLayoutFieldItemDTO> listItemTree = buildListItemTree(listBusinessItem);

        listMapped.stream().forEach(field -> {
            field.setListFieldsItem(
                    customerLayoutMapper.fromCustomFieldsItemToLayoutFieldsItem(field.getFieldItems()));
            if (field.getFieldName().equals(ConstantsCustomers.COLUMN_BUSINESS)) {
                field.setListFieldsItem(listItemTree);
            }
            if (field.getFieldName().equals(ConstantsCustomers.FIELD_BUSINESS_MAIN_ID)) {
                field.setListFieldsItem(listItemTree.stream().filter(item -> item.getItemParentId() == null)
                        .collect(Collectors.toList()));
            }
            if (field.getFieldName().equals(ConstantsCustomers.FIELD_BUSINESS_SUB_ID)) {
                field.setListFieldsItem(listBusinessItem.stream().filter(item -> item.getItemParentId() != null)
                        .collect(Collectors.toList()));
            }
        });
        return listMapped;
    }

    /**
     * build list Tree item
     * 
     * @param listBusinessItem
     * @return
     */
    private List<CustomerLayoutFieldItemDTO> buildListItemTree(
            List<CustomerLayoutFieldItemDTO> listBusinessItem) {
        if (listBusinessItem == null || listBusinessItem.isEmpty()) {
            return listBusinessItem;
        }
        Map<Long, CustomerLayoutFieldItemDTO> fiedItemMap = new HashMap<>();
        for (CustomerLayoutFieldItemDTO item : listBusinessItem) {
            fiedItemMap.put(item.getItemId(), item);
        }

        List<CustomerLayoutFieldItemDTO> itemTree = new ArrayList<>();
        for (CustomerLayoutFieldItemDTO item : listBusinessItem) {
            if (item.getItemParentId() != null) {
                CustomerLayoutFieldItemDTO pItem = fiedItemMap.get(item.getItemParentId());
                if (pItem != null) {
                    List<CustomerLayoutFieldItemDTO> childList = pItem.getFieldItemChilds();
                    if (childList == null) {
                        childList = new ArrayList<>();
                    }
                    childList.add(item);
                    pItem.setFieldItemChilds(childList);
                } else {
                    itemTree.add(item);
                }
            } else {
                itemTree.add(item);
            }
        }
        return itemTree;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerLayoutPersonal(jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalRequestDTO)
     */
    @Override
    public CustomerLayoutPersonalResponseDTO getCustomerLayoutPersonal(CustomerLayoutPersonalRequestDTO request) {
        CustomerLayoutPersonalResponseDTO response = new CustomerLayoutPersonalResponseDTO();

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        // get fieldInfo personal
        FieldInfoPersonalsInputDTO fieldInfoRequest = new FieldInfoPersonalsInputDTO();
        fieldInfoRequest.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        fieldInfoRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        fieldInfoRequest.setExtensionBelong(request.getExtensionBelong());
        fieldInfoRequest.setSelectedTargetType(request.getSelectedTargetType());
        fieldInfoRequest.setSelectedTargetId(request.getSelectedTargetId());

        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_FIELDS_INFO_PERSONALS, HttpMethod.POST, fieldInfoRequest,
                CommonFieldInfoResponse.class, token, tenantName);
        if (fieldInfoResponse == null || CollectionUtils.isEmpty(fieldInfoResponse.getFieldInfoPersonals())) {
            return response;
        }
        List<FieldInfoPersonalsOutDTO> fieldInfoPersonalList = fieldInfoResponse.getFieldInfoPersonals();

        response.getFields().addAll(processingGetFieldInfoPersonal(fieldInfoPersonalList));
        return response;
    }

    /**
     * @param fieldInfoPersonalList
     * @return
     */
    private List<CustomerLayoutPersonalFieldInfo> processingGetFieldInfoPersonal(
            List<FieldInfoPersonalsOutDTO> fieldInfoPersonalList) {
        List<CustomerLayoutPersonalFieldInfo> listMapped = new ArrayList<>();

        if (CollectionUtils.isEmpty(fieldInfoPersonalList)) {
            return listMapped;
        }
        // get response

        List<CustomersBusinessDTO> listBusiness = customersBusinessService.findAll().stream()
                .sorted(Comparator.comparing(CustomersBusinessDTO::getCustomerBusinessId)).collect(Collectors.toList());
        List<CustomerLayoutFieldItemDTO> listFieldItem = listBusiness.stream().map(b -> {
            CustomerLayoutFieldItemDTO businessFieldItem = new CustomerLayoutFieldItemDTO();
            businessFieldItem.setIsAvailable(true);
            businessFieldItem.setIsDefault(true);
            businessFieldItem.setItemId(b.getCustomerBusinessId());
            businessFieldItem.setItemLabel(b.getCustomerBusinessName());
            businessFieldItem.setItemParentId(b.getCustomerBusinessParent());
            return businessFieldItem;
        }).collect(Collectors.toList());

        // build listItem tree
        List<CustomerLayoutFieldItemDTO> listItemTree = buildListItemTree(listFieldItem);

        listMapped.addAll(customerLayoutMapper.toFieldInfoPersonalCustomer(fieldInfoPersonalList));

        listMapped.stream().forEach(field -> {
            field.setListFieldsItem(customerLayoutMapper.toFieldItemPersonalCustomer(field.getFieldItems()));
            if (field.getFieldName().equals(ConstantsCustomers.COLUMN_BUSINESS)) {
                field.setListFieldsItem(listItemTree);
            }
            if (field.getFieldName().equals(ConstantsCustomers.FIELD_BUSINESS_MAIN_ID)) {
                field.setListFieldsItem(listItemTree.stream().filter(item -> item.getItemParentId() == null)
                        .collect(Collectors.toList()));
            }
            if (field.getFieldName().equals(ConstantsCustomers.FIELD_BUSINESS_SUB_ID)) {
                field.setListFieldsItem(listFieldItem.stream().filter(item -> item.getItemParentId() != null)
                        .collect(Collectors.toList()));
            }
        });
        return listMapped;
    }

    /**
     * update MasterMotivations :
     *
     * @param masterMotivationInDTO : DTO for update
     * @param iconPathForDelete :List icon path file for delete
     * @param updateMasterMotivations : List id for update
     * @param imagePath : image path for update
     */
    private void updateMasterMotivations(MasterMotivationInDTO masterMotivationInDTO, List<String> iconPathForDelete,
            List<Long> updateMasterMotivations, String imagePath, String iconName) {
        if (iconName == null) {
            iconName = "";
        }
        if (!INTEGER_ZERO.equals(masterMotivationInDTO.getIconType())
                && !iconName.equals(masterMotivationInDTO.getIconName())) {
            // 6.2.1 get path file of icon master motivation for
            // update
            iconPathForDelete.add(
                    mastersMotivationsRepository.findIconPathForDelete(masterMotivationInDTO.getMasterMotivationId()));
        }
        // 6.2.2 update masterMotivations
        String finalImagePath = imagePath;
        this.mastersMotivationsService.findOne(masterMotivationInDTO.getMasterMotivationId())
                .ifPresentOrElse(dto -> {
                    MastersMotivationsDTO mastersMotivationsDTO = this
                            .insertOrUpdateMasterMotivations(masterMotivationInDTO, dto, finalImagePath);
                    updateMasterMotivations.add(mastersMotivationsDTO.getMasterMotivationId());
                }, () -> {
                    throw new CustomRestException("error-exclusive",
                            CommonUtils.putError(UPDATE_MASTER_MOTIVATIONS, Constants.EXCLUSIVE_CODE));
                });
    }

    /**
     * handleInsertOrUpdateMasterStands
     * 
     * @param masterStands
     * @param insertMasterStands
     * @param updateMasterStands
     */
    private void handleInsertOrUpdateMasterStands(List<MasterStandsInDTO> masterStands, List<Long> insertMasterStands,
            List<Long> updateMasterStands) {
        if (masterStands == null || masterStands.isEmpty()) {
            return;
        }
        for (MasterStandsInDTO masterStandsInDTO : masterStands) {
            if (masterStandsInDTO.getMasterStandId() == null
                    || NUMBER_ZERO.equals(masterStandsInDTO.getMasterStandId())) {
                // 7.1 insert master stands
                MastersStandsDTO mastersStandsDTO = this.insertOrUpdateMastersStand(masterStandsInDTO, null);
                insertMasterStands.add(mastersStandsDTO.getMasterStandId());
            } else {
                // 7.2 update master stands
                this.mastersStandsService.findOne(masterStandsInDTO.getMasterStandId())
                        .ifPresentOrElse(dto -> {
                            MastersStandsDTO mastersStandsDTO = this.insertOrUpdateMastersStand(masterStandsInDTO, dto);
                            updateMasterStands.add(mastersStandsDTO.getMasterStandId());
                        }, () -> {
                            throw new CustomRestException("error-exclusive",
                                    CommonUtils.putError(UPDATE_MASTER_STANDS, Constants.EXCLUSIVE_CODE));
                        });
            }
        }
    }

    /**
     * insert Or Update Master Motivations
     *
     * @param masterMotivationInDTO : DTO for update
     * @param mastersMotivationsDTODB : master motivations in DB
     * @param imagePath : pathFile for update
     * @return MastersMotivationsDTO : DTO out of method
     */
    private MastersMotivationsDTO insertOrUpdateMasterMotivations(MasterMotivationInDTO masterMotivationInDTO,
            MastersMotivationsDTO mastersMotivationsDTODB, String imagePath) {
        MastersMotivationsDTO mastersMotivationsDTOInsertOrUpdate = mastersMotivationsMapper
                .toMastersMotivationsDTO(masterMotivationInDTO);
        if (masterMotivationInDTO.getMasterMotivationId() == null
                || NUMBER_ZERO.equals(masterMotivationInDTO.getMasterMotivationId())) {
            mastersMotivationsDTOInsertOrUpdate.setMasterMotivationId(null);
            mastersMotivationsDTOInsertOrUpdate.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        }
        if (mastersMotivationsDTODB != null && mastersMotivationsDTODB.getMasterMotivationId() != null) {
            mastersMotivationsDTOInsertOrUpdate.setCreatedDate(mastersMotivationsDTODB.getCreatedDate());
            mastersMotivationsDTOInsertOrUpdate.setCreatedUser(mastersMotivationsDTODB.getCreatedUser());
        }
        mastersMotivationsDTOInsertOrUpdate.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        if (masterMotivationInDTO.getBackgroundColor() != null) {
            mastersMotivationsDTOInsertOrUpdate
                    .setBackgroundColor(Integer.parseInt(masterMotivationInDTO.getBackgroundColor()));
        }
        mastersMotivationsDTOInsertOrUpdate.setIconPath(imagePath);
        mastersMotivationsDTOInsertOrUpdate = mastersMotivationsService.save(mastersMotivationsDTOInsertOrUpdate);
        return mastersMotivationsDTOInsertOrUpdate;
    }


    /**
     * insert Or Update Masters Stand
     *
     * @param masterStandsInDTO : master stands dto for update
     * @param mastersStandsDTODB : master stands dto in DB
     * @return MastersStandsDTO : dto out of method insertOrUpdateMastersStand
     */
    private MastersStandsDTO insertOrUpdateMastersStand(MasterStandsInDTO masterStandsInDTO,
            MastersStandsDTO mastersStandsDTODB) {
        MastersStandsDTO mastersStandsDTO = mastersStandsMapper.toMastersStandsDTO(masterStandsInDTO);
        if (mastersStandsDTODB == null) {
            mastersStandsDTO.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        } else {
            mastersStandsDTO.setCreatedDate(mastersStandsDTODB.getCreatedDate());
            mastersStandsDTO.setCreatedUser(mastersStandsDTODB.getCreatedUser());
        }
        mastersStandsDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        return this.mastersStandsService.save(mastersStandsDTO);
    }

    /**
     * Delete files to S3
     *
     * @param filePaths file paths delete
     * @return file paths delete
     */
    public void deleteFiles(List<String> filePaths) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        String bucketName = applicationProperties.getUploadBucket();

        // Delete file
        for (String filePath : filePaths) {
            if (!S3CloudStorageClient.deleteObject(bucketName, String.format("%s/%s", tenantId, filePath))) {
                throw new CustomRestException(DELETE_FILE_FAILED,
                        CommonUtils.putError(filePath, Constants.FILE_DELETE_FAILED));
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomersByIds(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetCustomersByIdsInfoCustomerDTO> getCustomersByIds(List<Long> customerIds) {
        if (CollectionUtils.isEmpty(customerIds)) {
            return new ArrayList<>();
        }
        Set<Long> disticntIds = new HashSet<>();
        customerIds.removeIf(id -> !disticntIds.add(id));
        List<InformationDetailsCustomerDTO> listCustomerDetails = customersRepositoryCustom
                .getInformationDetailCustomer(customerIds);
        if (CollectionUtils.isEmpty(listCustomerDetails) || listCustomerDetails.size() != customerIds.size()) {
            throw new CustomRestException(ConstantsCustomers.DATA_HAS_BEEN_CHANGED,
                    CommonUtils.putError(customerIds + "", ConstantsCustomers.ERR_COM_0050));
        }

        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        List<GetCustomersByIdsInfoCustomerDTO> listCustomers = informationDetailsCustomerMapper
                .toCustomersByIdsOut(listCustomerDetails).stream()
                .sorted(Comparator.comparing(cus -> customerIds.indexOf(cus.getCustomerId())))
                .collect(Collectors.toList());

        // get custom field info
        GetCustomFieldsInfoRequest fieldInforequest = new GetCustomFieldsInfoRequest();
        fieldInforequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInforequest,
                CommonFieldInfoResponse.class, token, tenantName);
        List<CustomFieldsInfoOutDTO> fieldInfoList = fieldInfoResponse.getCustomFieldsInfo();

        // get list all person incharge
        List<PersonsInChargeDTO> listAllPersonIncharge = listCustomers.stream()
                .map(GetCustomersByIdsInfoCustomerDTO::getPersonInCharge).filter(Objects::nonNull)
                .collect(Collectors.toList());

        getPersonInchargeInfoForCustomers(listAllPersonIncharge);

        // get list all Parent in Tree
        List<String> listPathTree = listCustomers.stream()
                .filter(customer -> StringUtils.isNotBlank(customer.getParentTree())
                        && !ConstantsCustomers.STRING_ARRAY_EMPTY.equals(customer.getParentTree()))
                .map(GetCustomersByIdsInfoCustomerDTO::getParentTree).collect(Collectors.toList());
        List<CustomerNameDTO> listAllParentTree = createListParentTree(listPathTree);

        // call API get Tasks and schedules by customerIds
        List<RelationsWithCustomersDTO> listTaskAndSchedule = getTaskAndScheduleByCustomer(customerIds);

        listCustomers.forEach(customer -> {

            // build customer data
            customer.setCustomerData(
                    CustomersCommonUtil.parseJsonCustomerData(customer.getCustomerDataString(), fieldInfoList));

            // build customer photo
            customer.getCustomerLogo().setPhotoFilePath(customer.getPhotoFilePath());
            customer.getCustomerLogo().setFileUrl(buildFileUrl(customer.getCustomerLogo().getPhotoFilePath()));

            // build modify user' photo
            customer.setUpdatedUserPhoto(buildFileUrl(customer.getUpdatedUserPhoto()));
            customer.setCreatedUserPhoto(buildFileUrl(customer.getCreatedUserPhoto()));

            // build customer Address
            if (customer.getCustomerAddressObject() != null) {
                String address = StringUtil.getFullName(customer.getCustomerAddressObject().getZipCode(),
                        customer.getCustomerAddressObject().getAddressName());
                address = StringUtil.getFullName(address, customer.getCustomerAddressObject().getBuildingName());
                customer.getCustomerAddressObject().setAddress(address);

                customer.setCustomerAddress(gson.toJson(customer.getCustomerAddressObject()));
            }

            // build parent tree
            if (StringUtils.isNotBlank(customer.getParentTree())
                    && !ConstantsCustomers.STRING_ARRAY_EMPTY.equals(customer.getParentTree())) {

                List<Long> listTreeId = Arrays
                        .asList(customer.getParentTree().replace("[", "").replace("]", "").replace("\"", "")
                                .split(ConstantsCustomers.COMMA_SYMBOY))
                        .stream().map(idc -> Long.valueOf(idc.trim())).collect(Collectors.toList());

                List<String> listTreeName = new ArrayList<>();
                listTreeName.addAll(listAllParentTree.stream().filter(pt -> listTreeId.contains(pt.getCustomerId()))
                        .sorted(Comparator.comparing(pt -> listTreeId.indexOf(pt.getCustomerId())))
                        .map(CustomerNameDTO::getCustomerName).collect(Collectors.toList()));

                customer.setParthTreeId(listTreeId);
                customer.setPathTreeName(listTreeName);
            }
            // build list next schedule and list next action for customer
            listTaskAndSchedule.stream().filter(action -> action.getCustomerId().equals(customer.getCustomerId()))
                    .findAny().ifPresent(action -> {
                        customer.setNextActions(buildNextActionForeachCustomer(customer.getCustomerId(), action));
                        customer.setNextSchedules(buildNextScheduleForeachCustomer(customer.getCustomerId(), action));
                    });

        });
        return listCustomers;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomer(jp.co.softbrain.esales.customers.service.dto.GetCustomerRequestDTO)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerOutDTO getCustomer(GetCustomerRequestDTO request) {
        // validate paramter
        validateGetCustomer(request);
        // get detail data
        GetCustomerOutDTO response = new GetCustomerOutDTO();

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        // get custom field info
        GetCustomFieldsInfoRequest fieldInforequest = new GetCustomFieldsInfoRequest();
        fieldInforequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInforequest,
                CommonFieldInfoResponse.class, token, tenantName);
        List<CustomFieldsInfoOutDTO> fieldInfoList = fieldInfoResponse.getCustomFieldsInfo();

        response.setFields(processingGetCustomFieldInfo(fieldInfoList));
        // get data from DB
        Long customerId = request.getCustomerId();
        List<InformationDetailsCustomerDTO> listInfoCustomer = customersRepositoryCustom
                .getInformationDetailCustomer(Arrays.asList(customerId));
        if (CollectionUtils.isEmpty(listInfoCustomer)) {
            throw new CustomRestException(ConstantsCustomers.DATA_HAS_BEEN_CHANGED,
                    CommonUtils.putError(customerId + "", ConstantsCustomers.ERR_COM_0050));
        }

        GetCustomerOutDetailsDTO customer = informationDetailsCustomerMapper
                .toDetailsResonse(listInfoCustomer.get(0));

        // get data all Business
        response.setBusiness(customersBusinessService.findAll());

        // get person incharge
        List<PersonsInChargeDTO> personIncharges = getPersonInchargeInfoForCustomers(
                Arrays.asList(customer.getPersonInCharge()));
        customer.setPersonInCharge(personIncharges.get(0));

        customer.getCustomerLogo().setFileUrl(buildFileUrl(customer.getCustomerLogo().getPhotoFilePath()));

        // build modify user

        if (customer.getCreatedUser().getEmployeePhoto() != null) {
            customer.getCreatedUser().setFileUrl(buildFileUrl(customer.getCreatedUser().getEmployeePhoto()));
        }

        if (customer.getUpdatedUser().getEmployeePhoto() != null) {
            customer.getUpdatedUser().setFileUrl(buildFileUrl(customer.getUpdatedUser().getEmployeePhoto()));

        }

        // build customer Parent
        if (StringUtils.isNotBlank(customer.getParentTree())
                && !ConstantsCustomers.STRING_ARRAY_EMPTY.equals(customer.getParentTree())) {
            List<CustomerNameDTO> listParentTree = createListParentTree(Arrays.asList(customer.getParentTree()));
            customer.setCustomerParent(buildCustomerParentForCustomer(customer.getParentTree(), listParentTree));
        }

        // build customer data
        List<CustomerDataTypeDTO> customerData = CustomersCommonUtil
                .parseJsonCustomerData(customer.getCustomerDataString(), fieldInfoList);
        customer.setCustomerData(customerData);

        // call API get Tasks and schedules by customerIds
        List<RelationsWithCustomersDTO> listTaskAndSchedule = getTaskAndScheduleByCustomer(
                Arrays.asList(request.getCustomerId()));

        // build list next schedule and list next action for customer
        listTaskAndSchedule.stream().filter(action -> action.getCustomerId().equals(customer.getCustomerId())).findAny()
                .ifPresent(action -> {
                    customer.setNextActions(buildNextActionForeachCustomer(customer.getCustomerId(), action));
                    customer.setNextSchedules(buildNextScheduleForeachCustomer(customer.getCustomerId(), action));
                });
        // get tab info
        GetTabsInfoRequest tabInfoRequest = new GetTabsInfoRequest();
        tabInfoRequest.setTabBelong(Constants.TabBelong.CUSTOMER.getValue());
        GetTabsInfoResponse tabInfoResponse = null;
        try {
            tabInfoResponse = restOperationUtils.executeCallApi(PathEnum.COMMONS,
                    ConstantsCustomers.API_GET_TABS_INFO, HttpMethod.POST, tabInfoRequest, GetTabsInfoResponse.class,
                    token, tenantName);
            response.setTabsInfo(tabInfoResponse.getTabsInfo());

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_TABS_INFO,
                    e.getLocalizedMessage()));
        }
        if (tabInfoResponse == null || CollectionUtils.isEmpty(tabInfoResponse.getTabsInfo())) {
            return response;

        }
        List<CustomersDataTabsDTO> dataTabs = processingDataForTab(request, tabInfoResponse);
        response.setDataTabs(dataTabs);

        // get data scenario
        CustomersDataTabsDTO scenarioTab = new CustomersDataTabsDTO();
        scenarioTab.setTabId(ConstantsCustomers.TAB_SCENARIO);
        scenarioTab.setData(this.getScenario(request.getCustomerId()));

        response.getDataTabs().add(scenarioTab);
        response.setCustomer(customer);

        return response;
    }

    /**
     * get data for each tab
     * 
     * @param request
     * @param tabInfoResponse
     * @return
     */
    private List<CustomersDataTabsDTO> processingDataForTab(GetCustomerRequestDTO request, GetTabsInfoResponse tabInfoResponse) {

        List<CustomersDataTabsDTO> tabDataList = new ArrayList<>();

        tabInfoResponse.getTabsInfo().forEach(tabInfo -> {
            CustomersDataTabsDTO tabData = new CustomersDataTabsDTO();
            tabData.setTabId(tabInfo.getTabId());

            if (!Boolean.TRUE.equals(tabInfo.getIsDisplaySummary())) {
                tabData.setData(null);
            } else {
                switch (tabInfo.getTabId()) {
                case ConstantsCustomers.TAB_TASK:
                    // call api get tasks
                    tabData.setData(getTabDataByGetTasksTab(tabInfo, request));
                    break;
                case ConstantsCustomers.TAB_SALES:
                    // get product trading tab
                    tabData.setData(getTabDataByGetProductTradingsTab(tabInfo, request));
                    break;
                case ConstantsCustomers.TAB_ACTIVITIES:
                    // get activities
                    tabData.setData(getTabDataByGetActivities(tabInfo, request));
                    break;
                case ConstantsCustomers.TAB_CHANGE_HISTORY:
                    // get change history
                    tabData.setData(getTabDataChangeHistory(tabInfo, request));
                    break;
                default:
                    break;
                }
            }
            tabDataList.add(tabData);
        });
        return tabDataList;
    }

    /**
     * getTabDataChangeHistory.
     * 
     * @param tabInfo
     * @param request
     * @return
     */
    private GetCustomerHistoryResponse getTabDataChangeHistory(TabsInfoDTO tabInfo, GetCustomerRequestDTO request) {
        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsCustomers.DEFAULT_LIMIT_FOR_TAB;
        return getCustomerHistory(request.getCustomerId(), 1, limit);
    }

    /**
     * @param tabInfo
     * @param request
     * @return
     */
    private GetActivitiesResponse getTabDataByGetActivities(TabsInfoDTO tabInfo, GetCustomerRequestDTO request) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (tenant == null) {
            tenant = TenantContextHolder.getTenant();
        }

        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsCustomers.DEFAULT_LIMIT_FOR_TAB;

        // create request
        GetActivitiesRequest activityRequest = new GetActivitiesRequest();
        activityRequest.setSearchConditions(new ArrayList<>());
        activityRequest.setFilterConditions(new ArrayList<>());
        activityRequest.setOffset(INTEGER_ZERO);
        activityRequest.setLimit(limit);
        activityRequest.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        activityRequest.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        activityRequest.setHasTimeline(true);
        activityRequest.setListBusinessCardId(new ArrayList<>());
        activityRequest.setListProductTradingId(new ArrayList<>());
        activityRequest.setOrderBy(new ArrayList<>());
        activityRequest.setSearchLocal("");
        List<Long> customerIds = new ArrayList<>();
        customerIds.add(request.getCustomerId());
        if (!CollectionUtils.isEmpty(request.getChildCustomerIds())) {
            customerIds.addAll(request.getChildCustomerIds());
        }
        activityRequest.setListCustomerId(customerIds);

        // get data for employees
        if (Boolean.TRUE.equals(request.getIsGetDataOfEmployee())) {
            List<SearchItem> searchConditions = new ArrayList<>();
            SearchItem empSearch = new SearchItem();
            empSearch.setFieldName("employee_id");
            empSearch.setFieldType(Integer.parseInt(FieldTypeEnum.RADIO.getCode()));
            empSearch.setFieldValue("[\"" + jwtTokenUtil.getTenantIdFromToken() + "\"]");
            empSearch.setIsDefault(ConstantsCustomers.STRING_VALUE_TRUE);
            empSearch.setSearchType(ConstantsCustomers.OR_CONDITION);
            searchConditions.add(empSearch);
            activityRequest.setSearchConditions(searchConditions);
        } else {
            activityRequest.setSearchConditions(new ArrayList<>());
        }

        GetActivitiesResponse activityResponse = null;
       try {
            activityResponse = restOperationUtils.executeCallApi(PathEnum.ACTIVITIES,
                    ConstantsCustomers.API_GET_ACTIVITIES, HttpMethod.POST, activityRequest,
                    GetActivitiesResponse.class, token, tenant);

       } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_ACTIVITIES,
                    e.getLocalizedMessage()));
        }

        return activityResponse;
    }

    /**
     * get data for tab by get product trading tab
     * 
     * @param tabInfo - info of tab
     * @param request - request of API
     * @return - tab data
     */
    private GetProductTradingTabOutDTO getTabDataByGetProductTradingsTab(
            TabsInfoDTO tabInfo,
            GetCustomerRequestDTO request) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (tenant == null) {
            tenant = TenantContextHolder.getTenant();
        }

        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsCustomers.DEFAULT_LIMIT_FOR_TAB;

        GetProductTradingTabRequest productTradingRequest = new GetProductTradingTabRequest();

        // set data for request
        List<Long> customerIds = new ArrayList<>();
        customerIds.add(request.getCustomerId());
        if (!CollectionUtils.isEmpty(request.getChildCustomerIds())) {
            customerIds.addAll(request.getChildCustomerIds());
        }
        productTradingRequest.setCustomerIds(customerIds);
        if (Boolean.TRUE.equals(request.getIsGetDataOfEmployee())) {
            productTradingRequest.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        }
        productTradingRequest.setLoginFlag(Boolean.FALSE);
        productTradingRequest.setFilterConditions(new LinkedList<>());
        productTradingRequest.setOrderBy(new LinkedList<>());
        productTradingRequest.setIsFinish(null);
        productTradingRequest.setLimit(limit);
        productTradingRequest.setOffset(INTEGER_ZERO);

        return channelUtils.callAPIGetProductTradingTab(productTradingRequest, token, tenant);
    }

    /**
     * get tab data by get task
     * 
     * @param tabInfo - info
     * @param request - request
     * @return
     */
    private GetTaskTabOutDTO getTabDataByGetTasksTab(TabsInfoDTO tabInfo, GetCustomerRequestDTO request) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenant = jwtTokenUtil.getTenantIdFromToken();
        if (tenant == null) {
            tenant = TenantContextHolder.getTenant();
        }

        Long limit = tabInfo.getMaxRecord() != null ? Long.valueOf(tabInfo.getMaxRecord())
                : Long.valueOf(ConstantsCustomers.DEFAULT_LIMIT_FOR_TAB);

        GetTasksTabRequest getTasksTabReq = new GetTasksTabRequest();
        // set data for request
        List<Long> customerIds = new ArrayList<>();
        customerIds.add(request.getCustomerId());
        if (!CollectionUtils.isEmpty(request.getChildCustomerIds())) {
            customerIds.addAll(request.getChildCustomerIds());
        }
        getTasksTabReq.setCustomerIds(customerIds);
        getTasksTabReq.setFilterByUserLoginFlg(0);
        if (Boolean.TRUE.equals(request.getIsGetDataOfEmployee())) {
            getTasksTabReq.setFilterByUserLoginFlg(1);
        }
        getTasksTabReq.setFilterConditions(new ArrayList<>());
        getTasksTabReq.setOrderBy(getOrderByTabData(tabInfo.getTabId()));
        getTasksTabReq.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        getTasksTabReq.setLimit(limit);

        return channelUtils.callAPIGetTasksTab(getTasksTabReq, token, tenant);

    }

    /**
     * Get order by for Tab data by tab id
     * 
     * @param tabId tabId
     * @return
     */
    private List<OrderValue> getOrderByTabData(Integer tabId) {
        List<OrderValue> orderByList = new ArrayList<>();

        switch (tabId) {
        case ConstantsCustomers.TAB_TASK:
            OrderValue orderValue = new OrderValue();
            orderValue.setKey("finish_date");
            orderValue.setValue(ConstantsCustomers.SORT_TYPE_DESC);
            orderValue.setFieldType(Integer.parseInt(FieldTypeEnum.DATETIME.getCode()));
            orderByList.add(orderValue);
            break;
        case ConstantsCustomers.TAB_SALES:
            break;
        default:
            break;
        }
        return orderByList;
    }

    /**
     * @param asList
     * @return
     */
    private List<PersonsInChargeDTO> getPersonInchargeInfoForCustomers(List<PersonsInChargeDTO> listPersonIncharge) {
        if (CollectionUtils.isEmpty(listPersonIncharge)) {
            return new ArrayList<>();
        }

        Set<Long> departmentIds = new HashSet<>();
        Set<Long> groupIds = new HashSet<>();

        listPersonIncharge.stream().forEach(charge -> {
                departmentIds.add(charge.getDepartmentId());
                groupIds.add(charge.getGroupId());
        });
        departmentIds.removeIf(id -> id == null || id == 0);
        groupIds.removeIf(id -> id == null || id == 0);
        Map<Long, String> mapDepartment = new HashMap<>();
        Map<Long, String> mapGroup = new HashMap<>();

        getDepartmentIdAndName(mapDepartment, new ArrayList<>(departmentIds));
        getgroupIdAndName(mapGroup, new ArrayList<>(groupIds));

        listPersonIncharge.forEach(personIncharge -> {
            if (personIncharge.getEmployeeId() != null) {
                personIncharge.setEmployeePhoto(buildFileUrl(personIncharge.getEmployeePhoto()));

            }

            if (personIncharge.getDepartmentId() != null
                    && mapDepartment.containsKey(personIncharge.getDepartmentId())) {
                personIncharge.setDepartmentName(mapDepartment.get(personIncharge.getDepartmentId()));
                return;
            }
            if (personIncharge.getGroupId() != null && mapGroup.containsKey(personIncharge.getGroupId())) {
                personIncharge.setGroupName(mapGroup.get(personIncharge.getGroupId()));
            }
        });

        return listPersonIncharge;
    }

    /**
     * @param mapGroup
     * @param groupIds
     */
    private void getgroupIdAndName(Map<Long, String> mapGroup, List<Long> groupIds) {
        if (CollectionUtils.isEmpty(groupIds)) {
            return;
        }
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        GetGroupsRequest groupsRequest = new GetGroupsRequest();
        groupsRequest.setGroupIds(groupIds);
        groupsRequest.setGetEmployeesFlg(false);
        GetGroupsOutDTO groupsResponse = null;
        try {
            groupsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES, ConstantsCustomers.API_GET_GROUPS,
                    HttpMethod.POST, groupsRequest, GetGroupsOutDTO.class, token, tenantName);
            groupsResponse.getGroups().forEach(group -> mapGroup.put(group.getGroupId(), group.getGroupName()));
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_GROUPS,
                    e.getLocalizedMessage()));
        }

    }

    /**
     * @param mapDepartment
     * @param departmentIds
     */
    private void getDepartmentIdAndName(Map<Long, String> mapDepartment, List<Long> departmentIds) {

        if (CollectionUtils.isEmpty(departmentIds)) {
            return;
        }

        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        GetDepartmentRequest departmentsRequest = new GetDepartmentRequest();
        departmentsRequest.setDepartmentIds(departmentIds);
        departmentsRequest.setGetEmployeesFlg(false);

        GetDepartmentsOutDTO departmentsResponse = null;
        try {
            departmentsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                    ConstantsCustomers.API_GET_DEPARTMENTS, HttpMethod.POST, departmentsRequest,
                    GetDepartmentsOutDTO.class, token, tenantName);
            departmentsResponse.getDepartments().forEach(
                    department -> mapDepartment.put(department.getDepartmentId(), department.getDepartmentName()));

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.API_GET_DEPARTMENTS, ConstantsCustomers.API_GET_GROUPS,
                    e.getLocalizedMessage()));
        }
    }

    /**
     * Validate parameter for API getCustomer
     * 
     * @param request - request contains fields to validate
     */
    private void validateGetCustomer(GetCustomerRequestDTO request) {
        List<Map<String, Object>> errors = new ArrayList<>();
        // 1.1.Validate parameters
        if (request.getMode() == null) {
            errors.add(CommonUtils.putError(MODE, Constants.RIQUIRED_CODE));
        }
        if (request.getCustomerId() == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.MSG_REQUIRE_PARAMERTER, errors);
        }
        // 1.2.Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_ID, request.getCustomerId());
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        errors.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomers(jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersRequest)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomersOutDTO getCustomers(CustomersSearchConditionsDTO input) {
        GetCustomersOutDTO response = new GetCustomersOutDTO();
        // 1 validate Parameter
        validateGetcustomers(input);

        // get common data(sesion info,..)
        getCommonDataForSearchCustomers(input);

        // prepare params
        List<OrderValue> orderBys = input.getOrderBy();
        Integer selectedTargetType = input.getSelectedTargetType();
        Long selectedTargetId = input.getSelectedTargetId();
        String localSearchKeyword = input.getLocalSearchKeyword();
        
        // 2 update listView setting
        if (Boolean.TRUE.equals(input.getIsUpdateListView())) {
            updateListViewSetting(Constants.FieldBelong.CUSTOMER.getValue(), selectedTargetType, selectedTargetId,
                    input.getFilterConditions(), orderBys, null);
        }

        // 3.1 get list person incharge by user login
        if (ConstantsCustomers.SELECTED_TARGET_TYPE_1.equals(selectedTargetType)) {
            if (selectedTargetId == 0) {
                input.getEmployeeIds().add(input.getUserId());
            } else {
                input.getEmployeeIds().add(selectedTargetId);
            }
            // get Groups and department by userId
            callApiGetGroupAndDepartmentByEmployeesIds(input, input.getEmployeeIds());
        }

        // update parameter for list conditions search
        updateParamListConditions(input.getSearchConditions(), input);
        updateParamListConditions(input.getFilterConditions(), input);

        // get id from elastic search
        List<Long> idFromElasticSearch = getIdFromElasticSearch(input);
        if (CollectionUtils.isEmpty(idFromElasticSearch)) {
            response.setTotalRecords(0);
            response.setCustomers(new ArrayList<>());
            return response;
        }

        // get data from local search
        if (StringUtils.isNotBlank(localSearchKeyword)) {
            List<Long> idFromSearchLocal = getIdCustomerFromSearchLocal(localSearchKeyword);
            idFromElasticSearch.removeIf(id -> !idFromSearchLocal.contains(id));
        }

        input.getElasticSearchResultIds().addAll(idFromElasticSearch);

        // prepare data before query
        prepareInputBeforQuery(input);

        response.setTotalRecords(customersRepositoryCustom.getCountTotalCustomers(input));
        if (response.getTotalRecords() == 0) {
            response.setCustomers(new ArrayList<>());
            return response;
        }
        List<SelectCustomersDTO> listSelectedData = customersRepositoryCustom.getCustomers(input);
        List<GetCustomersOutDataInfosDTO> listCustomers = informationDetailsCustomerMapper
                .toCustomersOut(listSelectedData);

        // get custom field info
        GetCustomFieldsInfoRequest fieldInforequest = new GetCustomFieldsInfoRequest();
        fieldInforequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInforequest,
                CommonFieldInfoResponse.class, SecurityUtils.getTokenValue().orElse(null), input.getTenantName());
        List<CustomFieldsInfoOutDTO> fieldInfoList = fieldInfoResponse.getCustomFieldsInfo();

        getListCustomersToResponse(listCustomers, input, fieldInfoList);
        response.setCustomers(listCustomers);

        // get last updated date for list customer
        getLastUpdatedDateForListCustomer(input, response);
        return response;

    }

    /**
     * prepareInputBeforQuery
     * 
     * @param input
     */
    private void prepareInputBeforQuery(CustomersSearchConditionsDTO input) {
        // calculate working days
        try {
            // Calculated by the number of working days
            calculatedWorkingDays(input.getFilterConditions());
            calculatedWorkingDays(input.getSearchConditions());
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        List<CalculatorFormularDTO> calculatorFormular = customersCommonService
                .getCalculatorFormular(FieldBelongEnum.CUSTOMER.getCode());
        input.setCalculatorFormular(calculatorFormular);

        Map<String, String> formularMap = getFomularMap(input.getCalculatorFormular());
        input.setOptionMap(getOptionMap(input, input.getLanguageCode(), formularMap));


        // prepare conditions
        input.getEmployeeIds().removeIf(Objects::isNull);
        input.getDepartmentIds().removeIf(Objects::isNull);
        input.getGroupIds().removeIf(Objects::isNull);
        input.getEmployeesCreated().removeIf(Objects::isNull);
        input.getEmployeesUpdated().removeIf(Objects::isNull);

        if (input.isSearchSchedule()) {
            input.getElasticSearchResultIds().removeIf(id -> !input.getCustomerIdsBySchedules().contains(id));
        }
        if (input.isSearchTask()) {
            input.getElasticSearchResultIds().removeIf(id -> !input.getCustomerIdsByTasks().contains(id));
        }
        if (input.isSearchLastContactDate()) {
            input.getElasticSearchResultIds().removeIf(id -> !input.getCustomerIdsByLastContactDate().contains(id));
        }
        if (input.getSearchConditions() != null) {
            // Remove link type search from search condition since the search was
            // done in elastic search
            input.setSearchConditions(input.getSearchConditions().stream()
                    .filter(s -> !FieldTypeEnum.LINK.getCode().equals(String.valueOf(s.getFieldType())))
                    .collect(Collectors.toList()));
        }
        if (input.getFilterConditions() != null) {
            // Remove link type search from filter condition since the search was
            // done in elastic search
            input.setFilterConditions(input.getFilterConditions().stream()
                    .filter(s -> !FieldTypeEnum.LINK.getCode().equals(String.valueOf(s.getFieldType())))
                    .collect(Collectors.toList()));
        }
    }
    /**
     * getIdFromElasticSearch for API getCustomers
     * 
     * @param input - input to save data
     * @return - list id
     */
    private List<Long> getIdFromElasticSearch(CustomersSearchConditionsDTO input) {
        // get conditions for elastic search
        GetDetailElasticSearchRequest requestElasticSearch = new GetDetailElasticSearchRequest();
        requestElasticSearch.setIndex(String.format(ConstantsCustomers.INDEX_CUSTOMER, input.getTenantName()));
        requestElasticSearch.setColumnId(ConstantsCustomers.CUSTOMER_COLUMN_ID);

        // update parameter for search conditions
        List<SearchConditionDTO> listSearchCondtitionsGrpc = getListSearchConditionsGrpc(input.getSearchConditions(),
                Constants.Elasticsearch.Operator.AND.getValue());
        input.getSearchConditions().removeIf(cond -> CommonUtils.isTextType(cond.getFieldType()));

        // update parameter for filter conditions
        List<SearchConditionDTO> listFilterConditiosnsGrpc = getListSearchConditionsGrpc(input.getFilterConditions(),
                Constants.Elasticsearch.Operator.AND.getValue());
        input.getFilterConditions().removeIf(cond -> CommonUtils.isTextType(cond.getFieldType()));

        requestElasticSearch.setFilterConditions(listFilterConditiosnsGrpc);
        requestElasticSearch.setSearchConditions(listSearchCondtitionsGrpc);

        SelectDetailElasticSearchResponse elasticSearchResponse = customersCommonService
                .getDetailDataFromElasticSearch(requestElasticSearch);
        // return if find data with no record from elastic search
        if (elasticSearchResponse == null || CollectionUtils.isEmpty(elasticSearchResponse.getDataElasticSearch())) {
            return new ArrayList<>();
        }

        // build search null organization
        buildSearchNullOrganization(input, elasticSearchResponse);

        input.getSearchConditions().addAll(elasticSearchResponse.getOrganizationSearchConditions());
        input.getSearchConditions().addAll(elasticSearchResponse.getRelationSearchConditions());

        input.getFilterConditions().addAll(elasticSearchResponse.getOrganizationFilterConditions());
        input.getFilterConditions().addAll(elasticSearchResponse.getRelationFilterConditions());

        List<Long> idFromElasticSearch = new ArrayList<>();
        // get data from elastic search
        elasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
            if (ConstantsCustomers.CUSTOMER_COLUMN_ID.equals(item.getKey())) {
                idFromElasticSearch.add(Double.valueOf(item.getValue()).longValue());
            }
        }));
        return idFromElasticSearch;
    }

    /**
     * prepareInputForGetCustomers
     * 
     * @param input
     */
    private void getCommonDataForSearchCustomers(CustomersSearchConditionsDTO input) {
        if (input.getSearchConditions() == null) {
            input.setSearchConditions(new ArrayList<>());
        }
        if (input.getFilterConditions() == null) {
            input.setFilterConditions(new ArrayList<>());
        }
        if (input.getOrderBy() == null) {
            input.setOrderBy(new ArrayList<>());
        }
        if (input.getSelectedTargetType() == null) {
            input.setSelectedTargetType(ConstantsCustomers.NUMBER_ZERO);
        }
        if (input.getSelectedTargetId() == null) {
            input.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        }
        // get session info
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (StringUtils.isBlank(tenantName)) {
            tenantName = TenantContextHolder.getTenant();
        }
        input.setLanguageCode(languageCode);
        input.setToken(token);
        input.setTenantName(tenantName);
        input.setUserId(userId);
    }

    /**
     * get customerId by search local
     * 
     * @param localSearchKeyword
     * @return
     */
    private List<Long> getIdCustomerFromSearchLocal(String localSearchKeyword) {
        // get data customer from elastic search
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (StringUtils.isBlank(tenantName)) {
            tenantName = TenantContextHolder.getTenant();
        }
        // get id by customer
        List<Long> customerIds = new ArrayList<>();
        customerIds.addAll(getSearchIdsBySearchLocalWithParentAliasName(localSearchKeyword));
        // get id by customer parent alias name

        GetDetailElasticSearchRequest requestElasticSearch = new GetDetailElasticSearchRequest();
        requestElasticSearch.setIndex(String.format(ConstantsCustomers.INDEX_CUSTOMER, tenantName));
        requestElasticSearch.setColumnId(ConstantsCustomers.CUSTOMER_COLUMN_ID);

        List<SearchConditionDTO> listSearchCondtitionsGrpc = new ArrayList<>();
        List<SearchConditionDTO> searchOrConditions = buildConditionsSearchList(localSearchKeyword,
                Arrays.asList(ConstantsCustomers.COLUMN_NAME_CUSTOMER_NAME,
                        ConstantsCustomers.COLUMN_CUSTOMER_ALIAS_NAME, ConstantsCustomers.COLUMN_CUSTOMER_PARENT),
                Integer.parseInt(FieldTypeEnum.FULLTEXT.getCode()), Constants.Elasticsearch.TRUE_VALUE,
                Constants.Elasticsearch.Operator.OR.getValue(), null, null);
        listSearchCondtitionsGrpc.addAll(searchOrConditions);

        requestElasticSearch.setSearchConditions(listSearchCondtitionsGrpc);
        requestElasticSearch.setFilterConditions(new ArrayList<>());

        SelectDetailElasticSearchResponse elasticSearchResponse = customersCommonService
                .getDetailDataFromElasticSearch(requestElasticSearch);
        // return if find data with no record from elastic search
        if (elasticSearchResponse == null || CollectionUtils.isEmpty(elasticSearchResponse.getDataElasticSearch())) {
            return customerIds;
        }

        elasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
            if (ConstantsCustomers.CUSTOMER_COLUMN_ID.equals(item.getKey())) {
                customerIds.add(Double.valueOf(item.getValue()).longValue());
            }
        }));

        return customerIds;
    }

    /**
     * get customer parent id by local search key word
     * 
     * @param localSearchKeyword - local search key word
     */
    private List<Long> getSearchIdsBySearchLocalWithParentAliasName(String localSearchKeyword) {
        if(StringUtils.isBlank(localSearchKeyword)) {
            return new ArrayList<>();
        }
        // get session info
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (StringUtils.isBlank(tenantName)) {
            tenantName = TenantContextHolder.getTenant();
        }
        // create elastic search condition
        List<SearchConditionDTO> listSearchCondtitionsGrpc = buildConditionsSearchList(localSearchKeyword,
                Arrays.asList(ConstantsCustomers.COLUMN_CUSTOMER_ALIAS_NAME),
                Integer.parseInt(FieldTypeEnum.FULLTEXT.getCode()), Constants.Elasticsearch.TRUE_VALUE,
                Constants.Elasticsearch.Operator.AND.getValue(), null, null);

        GetDetailElasticSearchRequest requestElasticSearch = new GetDetailElasticSearchRequest();
        requestElasticSearch.setIndex(String.format(ConstantsCustomers.INDEX_CUSTOMER, tenantName));
        requestElasticSearch.setColumnId(ConstantsCustomers.CUSTOMER_COLUMN_ID);
        requestElasticSearch.setSearchConditions(listSearchCondtitionsGrpc);
        requestElasticSearch.setFilterConditions(new ArrayList<>());

        SelectDetailElasticSearchResponse elasticSearchResponse = customersCommonService
                .getDetailDataFromElasticSearch(requestElasticSearch);
        // return if find data with no record from elastic search
        if (elasticSearchResponse == null || CollectionUtils.isEmpty(elasticSearchResponse.getDataElasticSearch())) {
            return new ArrayList<>();
        }

        // get data from elastic search
        List<Long> parentIds = new ArrayList<>();
        elasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
            if (ConstantsCustomers.CUSTOMER_COLUMN_ID.equals(item.getKey())) {
                parentIds.add(Double.valueOf(item.getValue()).longValue());
            }
        }));
        // find id child with parentIds
        return customersRepository.findCustomerIdByParentIdIn(parentIds);
    }

    /**
     * build search null organization
     */
    private void buildSearchNullOrganization(CustomersSearchConditionsDTO input,
            SelectDetailElasticSearchResponse elasticSearchResponse) {
        // search null organization
        input.getSearchConditions().stream()
                .filter(cond -> FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(String.valueOf(cond.getFieldType()))
                        && StringUtils.isNotBlank(cond.getFieldValue()))
                .findAny().ifPresent(cond -> {
                    if (elasticSearchResponse.getOrganizationSearchConditions().isEmpty()
                            && elasticSearchResponse.getOrganizationFilterConditions().isEmpty()) {
                        input.setElasticSearchResultIds(new ArrayList<>());
                    }
                });
        input.getFilterConditions().stream()
                .filter(cond -> FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(String.valueOf(cond.getFieldType()))
                        && StringUtils.isNotBlank(cond.getFieldValue()))
                .findAny().ifPresent(cond -> {
                    if (elasticSearchResponse.getOrganizationSearchConditions().isEmpty()
                            && elasticSearchResponse.getOrganizationFilterConditions().isEmpty()) {
                        input.setElasticSearchResultIds(new ArrayList<>());
                    }
                });

    }

    /**
     * get last uddated date for list customer
     * 
     * @param input - input contains selected target type
     * @param response - response to set last updated date
     */
    private void getLastUpdatedDateForListCustomer(CustomersSearchConditionsDTO input, GetCustomersOutDTO response) {

        // get all list updated date
        Instant lastUpdatedDate = customersListRepository.getLastUpdatedDateByListId(input.getSelectedTargetId());

        // set list updated_date
        if (ConstantsCustomers.SELECTED_TARGET_TYPE_2.equals(input.getSelectedTargetType())
                || ConstantsCustomers.SELECTED_TARGET_TYPE_3.equals(input.getSelectedTargetType())
                || ConstantsCustomers.SELECTED_TARGET_TYPE_4.equals(input.getSelectedTargetType())) {
            response.setLastUpdatedDate(lastUpdatedDate);
        }
    }

    /**
     * @param listSelectedData
     * @param listCustomers
     * @param input
     * @param fielInfoList
     */
    private void getListCustomersToResponse(List<GetCustomersOutDataInfosDTO> listCustomers,
            CustomersSearchConditionsDTO input, List<CustomFieldsInfoOutDTO> fieldInfoList) {
        if (CollectionUtils.isEmpty(listCustomers)) {
            return;
        }
        List<Long> customerIds = listCustomers.stream().map(GetCustomersOutDataInfosDTO::getCustomerId)
                .collect(Collectors.toList());
        // get all parent
        List<GetCustomersOutCustomerRelations> listAllDirectParents = customersRepository
                .findParentsByChilds(customerIds);
        // get all child
        List<GetCustomersOutCustomerRelations> listAllChilds = customersRepository.findChildsByParents(customerIds);

        // get all parent tree
        List<String> listPathTree = listCustomers.stream()
                .filter(customer -> StringUtils.isNotBlank(customer.getParentTree())
                        && !ConstantsCustomers.STRING_ARRAY_EMPTY.equals(customer.getParentTree()))
                .map(GetCustomersOutDataInfosDTO::getParentTree).collect(Collectors.toList());
        List<CustomerNameDTO> listAllParentTree = createListParentTree(listPathTree);

        // get all person incharge
        List<Long> empIdIncharge = new ArrayList<>();
        List<Long> depIdIncharge = new ArrayList<>();
        List<Long> groupIdIncharge = new ArrayList<>();

        listCustomers.stream().forEach(customer -> {
            PersonsInChargeDTO pInCharge = customer.getPersonInCharge();
            empIdIncharge.add(pInCharge.getEmployeeId());
            depIdIncharge.add(pInCharge.getDepartmentId());
            groupIdIncharge.add(pInCharge.getGroupId());
        });

        empIdIncharge.removeIf(id -> id == null || id == 0);
        depIdIncharge.removeIf(id -> id == null || id == 0);
        groupIdIncharge.removeIf(id -> id == null || id == 0);

        getListAllPersonIncharge(input, empIdIncharge, depIdIncharge, groupIdIncharge);

        // call API get Tasks and schedules by customerIds
        input.getListTaskAndSchedules().addAll(getTaskAndScheduleByCustomer(customerIds));

        listCustomers.stream().forEach(customer -> buildDataForeachCustomer(input, customer, listAllDirectParents,
                listAllChilds, listAllParentTree, fieldInfoList));

        if (input.isSearchNonSchedule()) {
            listCustomers.removeIf(customer -> isNotBlankListSchedule(customer.getNextSchedules()));
        }
        if (input.isSearchNonTask()) {
            listCustomers.removeIf(customer -> isNotBlankListActions(customer.getNextActions()));
        }

    }

    /**
     * Check the list next action is blank for search
     * 
     * @param listNextActions - list to check
     * @return - result check
     */
    private boolean isNotBlankListActions(List<NextActionsDTO> listNextActions) {
        if (CollectionUtils.isEmpty(listNextActions)) {
            return false;
        }
        return listNextActions.stream().anyMatch(task -> !StringUtils.isBlank(task.getTaskName()));
    }

    /**
     * Check the list next schedule is blank for search
     * 
     * @param listNextSchedules - list to check
     * @return - result check
     */
    private boolean isNotBlankListSchedule(List<NextSchedulesDTO> listNextSchedules) {
        if (CollectionUtils.isEmpty(listNextSchedules)) {
            return false;
        }
        return listNextSchedules.stream().anyMatch(schedule -> !StringUtils.isBlank(schedule.getSchedulesName()));
    }

    /**
     * Get task and Schedule by customers
     * 
     * @param customerIds - list id customers
     * @return - list task and schedule
     */
    private List<RelationsWithCustomersDTO> getTaskAndScheduleByCustomer(List<Long> customerIds) {
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        // call API
        TaskAndScheduleByCustomerRequest taskScheduleRequest = new TaskAndScheduleByCustomerRequest();
        taskScheduleRequest.setCustomerIds(customerIds);
        try {
            TaskAndScheduleByCustomerOutDTO taskScheduleResponse = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_GET_TASKS_AND_SCHEDULES_BY_CUSTOMER_IDS, HttpMethod.POST,
                    taskScheduleRequest, TaskAndScheduleByCustomerOutDTO.class, token, tenantName);
            return taskScheduleResponse.getCustomerRelations() == null ? new ArrayList<>()
                    : taskScheduleResponse.getCustomerRelations();
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_TASKS_AND_SCHEDULES_BY_CUSTOMER_IDS, e.getLocalizedMessage()));
            return new ArrayList<>();
        }
    }

    /**
     * get list all person incharge for customer
     * 
     * @param input
     * @param empIdIncharge
     * @param depIdIncharge
     * @param groupIdIncharge
     */
    private void getListAllPersonIncharge(CustomersSearchConditionsDTO input, List<Long> empIdIncharge,
            List<Long> depIdIncharge, List<Long> groupIdIncharge) {
        DataSyncElasticSearchRequest employeesByIdsRequest = new DataSyncElasticSearchRequest();
        employeesByIdsRequest.setEmployeeIds(empIdIncharge);

        List<PersonsInChargeDTO> allPersonIncharge = new ArrayList<>();
        try {
            // get employee
            GetEmployeesByIdsResponse employeesResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                    ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS, HttpMethod.POST, employeesByIdsRequest,
                    GetEmployeesByIdsResponse.class, input.getToken(), input.getTenantName());

            employeesResponse.getEmployees().stream().forEach(emp -> {
                PersonsInChargeDTO empInCharge = new PersonsInChargeDTO();
                empInCharge.setEmployeeId(emp.getEmployeeId());
                empInCharge.setEmployeeName(StringUtil.getFullName(emp.getEmployeeName(), emp.getEmployeeSurname()));
                if (emp.getEmployeeIcon() != null) {
                    empInCharge.setEmployeePhoto(emp.getEmployeeIcon().getFilePath());
                }
                allPersonIncharge.add(empInCharge);
            });

        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS,
                    e.getLocalizedMessage()));
        }

        try {
            // get department
            GetDepartmentRequest depRequest = new GetDepartmentRequest();
            depRequest.setDepartmentIds(depIdIncharge);
            depRequest.setGetEmployeesFlg(false);

            GetDepartmentsOutDTO depResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                    ConstantsCustomers.API_GET_DEPARTMENTS, HttpMethod.POST, depRequest, GetDepartmentsOutDTO.class,
                    input.getToken(), input.getTenantName());

            depResponse.getDepartments().stream().forEach(dep -> {
                PersonsInChargeDTO depInCharge = new PersonsInChargeDTO();
                depInCharge.setDepartmentId(dep.getDepartmentId());
                depInCharge.setDepartmentName(dep.getDepartmentName());
                allPersonIncharge.add(depInCharge);
            });
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_DEPARTMENTS,
                    e.getLocalizedMessage()));
        }

        try {
            // get group
            GetGroupsRequest groupRequest = new GetGroupsRequest();
            groupRequest.setGroupIds(groupIdIncharge);
            groupRequest.setGetEmployeesFlg(false);

            GetGroupsOutDTO groupResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                    ConstantsCustomers.API_GET_GROUPS, HttpMethod.POST, groupRequest, GetGroupsOutDTO.class,
                    input.getToken(), input.getTenantName());

            groupResponse.getGroups().stream().forEach(group -> {
                PersonsInChargeDTO groupInCharge = new PersonsInChargeDTO();
                groupInCharge.setGroupId(group.getGroupId());
                groupInCharge.setGroupName(group.getGroupName());
                allPersonIncharge.add(groupInCharge);
            });
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_DEPARTMENTS,
                    e.getLocalizedMessage()));
        }

        input.getListAllPersonInCharge().addAll(allPersonIncharge);
    }

    /**
     * build details data foreach customer
     * 
     * @param input
     * @param customer
     * @param listAllDirectParents
     * @param listAllChilds
     * @param listAllParentTree
     * @param fieldInfoList
     */
    private void buildDataForeachCustomer(CustomersSearchConditionsDTO input, GetCustomersOutDataInfosDTO customer,
            List<GetCustomersOutCustomerRelations> listAllDirectParents,
            List<GetCustomersOutCustomerRelations> listAllChilds, List<CustomerNameDTO> listAllParentTree,
            List<CustomFieldsInfoOutDTO> fieldInfoList) {
        // get parent info
        listAllDirectParents.stream().filter(p -> p.getCustomerId().equals(customer.getParentId())).findAny()
                .ifPresent(customer::setDirectParent);

        // get list child
        List<GetCustomersOutCustomerRelations> listChilds = listAllChilds.stream()
                .filter(child -> child.getParentId().equals(customer.getCustomerId())).collect(Collectors.toList());
        customer.setCustomerChildList(listChilds);

        // build customerData
        List<CustomerDataTypeDTO> customerData = CustomersCommonUtil
                .parseJsonCustomerData(customer.getCustomerDataString(), fieldInfoList);
        customer.setCustomerData(customerData);

        // build customer parent
        customer.setCustomerParent(buildCustomerParentForCustomer(customer.getParentTree(), listAllParentTree));

        // build photo for create user and update user
        customer.getCreatedUser().setEmployeePhoto(buildFileUrl(customer.getCreatedUser().getEmployeePhoto()));

        customer.getUpdatedUser().setEmployeePhoto(buildFileUrl(customer.getUpdatedUser().getEmployeePhoto()));

        // format customer logo
        customer.getCustomerLogo().setFileUrl(customer.getCustomerLogo().getPhotoFilePath());

        // build customerAdress
        if (customer.getCustomerAddressObject() != null) {
            String address = StringUtil.getFullName(customer.getCustomerAddressObject().getZipCode(),
                    customer.getCustomerAddressObject().getAddressName());
            address = StringUtil.getFullName(address, customer.getCustomerAddressObject().getBuildingName());
            customer.getCustomerAddressObject().setAddress(address);
        }

        try {
            customer.setCustomerAddress(objectMapper.writeValueAsString(customer.getCustomerAddressObject()));
        } catch (Exception e) {
            customer.setCustomerAddress("");
        }

        // build person incharge
        buildPersonInChargeForCustomer(customer.getPersonInCharge(), input.getListAllPersonInCharge());

        input.getListTaskAndSchedules().stream()
                .filter(action -> action.getCustomerId().equals(customer.getCustomerId())).findAny()
                .ifPresent(action -> {
                    customer.setNextActions(buildNextActionForeachCustomer(customer.getCustomerId(), action));
                    customer.setNextSchedules(buildNextScheduleForeachCustomer(customer.getCustomerId(), action));
                });
    }

    /**
     * build customer parent for customer
     * 
     * @param parentTree - parent tree from DB
     * @param listAllParentTree
     * @return
     */
    private GetCustomersOutParentTreeDTO buildCustomerParentForCustomer(String parentTree,
            List<CustomerNameDTO> listAllParentTree) {
        // build parent tree
        GetCustomersOutParentTreeDTO customerParent = new GetCustomersOutParentTreeDTO();

        if (StringUtils.isBlank(parentTree) || ConstantsCustomers.STRING_ARRAY_EMPTY.equals(parentTree)) {
            return customerParent;
        }

        List<Long> listTreeId = Arrays
                .asList(parentTree.replace("[", "").replace("]", "").replace("\"", "")
                        .split(ConstantsCustomers.COMMA_SYMBOY))
                .stream().map(idc -> Long.valueOf(idc.trim())).collect(Collectors.toList());

        List<String> listTreeName = new ArrayList<>();
        listTreeName.addAll(listAllParentTree.stream().filter(pt -> listTreeId.contains(pt.getCustomerId()))
                .sorted(Comparator.comparing(pt -> listTreeId.indexOf(pt.getCustomerId())))
                .map(CustomerNameDTO::getCustomerName).collect(Collectors.toList()));
        // get list tree id
        List<Long> treeIds = new ArrayList<>();
        if (!listTreeId.isEmpty()) {
            IntStream.range(1, listTreeId.size())
                    .forEach(index -> treeIds.add(listTreeId.get(listTreeId.size() - index - 1)));
        }

        // get list tree name
        List<String> treeNames = new ArrayList<>();
        if (!listTreeName.isEmpty()) {
            IntStream.range(1, listTreeName.size())
                    .forEach(index -> treeNames.add(listTreeName.get(listTreeName.size() - index - 1)));
        }
        customerParent.setPathTreeId(treeIds);
        customerParent.setPathTreeName(treeNames);
        return customerParent;
    }

    /**
     * Get list next action for customer
     * 
     * @param customer - customer to save data
     * @param action - list raw schedule and task
     */
    private List<NextActionsDTO> buildNextActionForeachCustomer(Long customerId, RelationsWithCustomersDTO action) {
        // get list action nex
        return action.getListTasks().stream()
                .filter(task -> task.getStartDate() != null
                        && task.getStartDate().compareTo(Instant.now().atZone(ZoneId.of("Z")).toInstant()) > 0)
                .sorted(Comparator.comparing(TasksByCustomerDTO::getStartDate)).map(task -> {
                    NextActionsDTO nextAction = new NextActionsDTO();
                    nextAction.setTaskId(task.getTaskId());
                    nextAction.setTaskName(task.getTaskName());
                    nextAction.setCustomerId(customerId);
                    return nextAction;
                }).collect(Collectors.toList());
    }

    /**
     * Get list next schedule for customer
     * 
     * @param customer - customer to save data
     * @param action - list raw schedule and task
     */
    private List<NextSchedulesDTO> buildNextScheduleForeachCustomer(Long customerId, RelationsWithCustomersDTO action) {
        // get list schedules next
        return action.getListSchedules().stream()
                .filter(schedule -> schedule.getStartDate() != null
                        && schedule.getStartDate().compareTo(Instant.now().atZone(ZoneId.of("Z")).toInstant()) > 0)
                .sorted(Comparator.comparing(SchedulesByCustomerDTO::getStartDate)).map(schedule -> {
                    NextSchedulesDTO nextSchedule = new NextSchedulesDTO();
                    nextSchedule.setSchedulesId(schedule.getScheduleId());
                    nextSchedule.setSchedulesName(schedule.getScheduleName());
                    nextSchedule.setCustomerId(customerId);
                    return nextSchedule;
                }).collect(Collectors.toList());

    }

    /**
     * build data person incharge for customer
     * 
     * @param personInCharge
     * @param listAllPersonInCharge
     */
    private void buildPersonInChargeForCustomer(PersonsInChargeDTO personInCharge,
            List<PersonsInChargeDTO> listAllPersonInCharge) {
        if (personInCharge == null) {
            return;
        }
        if (personInCharge.getEmployeeId() != null) {
            listAllPersonInCharge.stream().filter(p -> personInCharge.getEmployeeId().equals(p.getEmployeeId()))
                    .findAny().ifPresent(p -> {
                        personInCharge.setEmployeeName(p.getEmployeeName());
                        personInCharge.setEmployeePhoto(buildFileUrl(p.getEmployeePhoto()));
                    });
        }
        if (personInCharge.getDepartmentId() != null) {
            listAllPersonInCharge.stream().filter(p -> personInCharge.getDepartmentId().equals(p.getDepartmentId()))
                    .findAny().ifPresent(p -> personInCharge.setDepartmentName(p.getDepartmentName()));
        }
        if (personInCharge.getGroupId() != null) {
            listAllPersonInCharge.stream().filter(p -> personInCharge.getGroupId().equals(p.getGroupId())).findAny()
                    .ifPresent(p -> personInCharge.setGroupName(p.getGroupName()));
        }
    }

    /**
     * @param listPathTree
     * @return
     */
    private List<CustomerNameDTO> createListParentTree(List<String> listPathTree) {
        if(CollectionUtils.isEmpty(listPathTree)) {
            return new ArrayList<>();
        }
        List<Long> customerIds = new ArrayList<>();

        for (String arrStr : listPathTree) {
            customerIds.addAll(
                    Arrays.asList(arrStr.replace("[", "").replace("]", "").replace("\"", "")
                            .split(ConstantsCustomers.COMMA_SYMBOY))
                            .stream().map(idc -> Long.valueOf(idc.trim()))
                    .collect(Collectors.toList()));
        }
        if (customerIds.isEmpty()) {
            return new ArrayList<>();
        }
        customerIds = customerIds.stream().distinct().collect(Collectors.toList());
        return customersRepository.getCustomersNameByCustomerIds(customerIds);
    }

    /**
     * Get list conditionDTO from list searchItems
     * 
     * @param listCondtitionItems - list searchItems
     * @param fieldOperator
     * @return list conditionsDTO
     */
    private List<SearchConditionDTO> getListSearchConditionsGrpc(List<SearchItem> listCondtitionItems,
            int fieldOperator) {
        if (CollectionUtils.isEmpty(listCondtitionItems)) {
            return new ArrayList<>();
        }
        List<SearchConditionDTO> listElasticSearchConditions = searchConditionsItemsMapper
                .searchItemToSearchCondition(listCondtitionItems.stream()
                        .filter(item -> CustomersCommonUtil.isElasticSearchSearchType(item.getFieldType()))
                        .collect(Collectors.toList()));
        listElasticSearchConditions.forEach(cond -> cond.setFieldOperator(fieldOperator));
        return listElasticSearchConditions;
    }

    /**
     * update Params for each item of list item search
     * 
     * @param listCondtitionItems - list item search
     */
    private void updateParamListConditions( List<SearchItem> listCondtitionItems, CustomersSearchConditionsDTO input) {
        listCondtitionItems.removeIf(item -> item.getFieldType() == null || StringUtils.isEmpty(item.getFieldName()));

        List<Long> idsToRemove = new ArrayList<>();
        for (SearchItem cond : listCondtitionItems) {
            updateForeachConditionItem(cond, idsToRemove, input);

            if (CommonUtils.isRangeType(cond.getFieldType()) && StringUtils.isNotBlank(cond.getFieldValue())
                    && !ConstantsCustomers.STRING_ARRAY_EMPTY.equals(cond.getFieldValue())) {
                buildValueForRangeField(cond);
            }
            if (CommonUtils.isTextType(cond.getFieldType())
                    && !ConstantsCustomers.STRING_VALUE_TRUE.equalsIgnoreCase(cond.getIsDefault())) {
                cond.setFieldName(cond.getFieldName().replace(ConstantsCustomers.DOT_KEYWORD, ""));
            }
        }
        if (input.isSearchPersonInCharge()) {
            listCondtitionItems.stream()
                    .filter(item -> ConstantsCustomers.COLUMN_PERSON_IN_CHARGE.equals(item.getFieldName())
                            || ConstantsCustomers.CUSTOMER_DATA_PERSON_IN_CHARGE.equals(item.getFieldName()))
                    .findAny()
                    .ifPresent(item -> getIdPersonInCharge(input, item));
        }
        listCondtitionItems.removeIf(item -> idsToRemove.contains(item.getFieldId()));
    }

    /**
     * update list param with each condition
     * 
     * @param cond - condition
     * @param idsToRemove - list id to remove from list condition
     * @param input - input
     */
    private void updateForeachConditionItem(SearchItem cond, List<Long> idsToRemove,
            CustomersSearchConditionsDTO input) {
        boolean isNonValue = StringUtils.isEmpty(cond.getFieldValue())
                || ConstantsCustomers.STRING_ARRAY_EMPTY.equals(cond.getFieldValue());
        String fieldName = cond.getFieldName().replace(ConstantsCustomers.DOT_KEYWORD, "");
        switch (fieldName) {
        // for normal fieldName
        case ConstantsCustomers.COLUMN_NAME_CUSTOMER_NAME:
        case ConstantsCustomers.COLUMN_CUSTOMER_ALIAS_NAME:
        case ConstantsCustomers.COLUMN_NAME_PHONE_NUMBER:
        case ConstantsCustomers.COLUMN_CUSTOMER_PARENT:
        case ConstantsCustomers.COLUMN_CUSTOMER_ADDRESS:
            cond.setFieldName(String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, fieldName));
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            break;
        case ConstantsCustomers.COLUMN_NAME_MEMO:
            cond.setFieldName(String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, fieldName));
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXTAREA.getCode()));
            break;
        case ConstantsCustomers.COLUMN_CREATED_USER:
            idsToRemove.add(cond.getFieldId());
            input.setSearchCreatedUser(true);
            // search by created user name/surname
            SearchConditionDTO empCreatedSearch = searchConditionsItemsMapper.searchItemToSearchCondition(cond);
            empCreatedSearch.setFieldName(
                    String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, ConstantsCustomers.FIELD_EMPLOYEE_FULL_NAME));
            empCreatedSearch.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            empCreatedSearch.setFieldOperator(Constants.Elasticsearch.Operator.AND.getValue());

            List<String> idsStringCreateUser = getListIdsFromElasticSearch(
                    Arrays.asList(empCreatedSearch),
                    String.format(ConstantsCustomers.INDEX_EMPLOYEE, input.getTenantName()),
                    ConstantsCustomers.EMPLOYEE_COLUMN_ID);
            input.getEmployeesCreated()
                    .addAll(idsStringCreateUser.stream().map(Long::valueOf).collect(Collectors.toList()));
            break;
        case ConstantsCustomers.COLUMN_UPDATED_USER:
            idsToRemove.add(cond.getFieldId());
            input.setSearchUpdatedUser(true);
            // search by updated user name/surname
            SearchConditionDTO empUpdatedSearch = searchConditionsItemsMapper.searchItemToSearchCondition(cond);
            empUpdatedSearch.setFieldName(
                    String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, ConstantsCustomers.FIELD_EMPLOYEE_FULL_NAME));
            empUpdatedSearch.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            empUpdatedSearch.setFieldOperator(Constants.Elasticsearch.Operator.AND.getValue());

            List<String> idsStringUpdatedUser = getListIdsFromElasticSearch(
                    Arrays.asList(empUpdatedSearch),
                    String.format(ConstantsCustomers.INDEX_EMPLOYEE, input.getTenantName()),
                    ConstantsCustomers.EMPLOYEE_COLUMN_ID);
            input.getEmployeesUpdated()
                    .addAll(idsStringUpdatedUser.stream().map(Long::valueOf).collect(Collectors.toList()));
            break;
        case ConstantsCustomers.COLUMN_BUSINESS:
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonBussiness(true);
                break;
            }
            input.setBusinessIds(Arrays
                    .asList(cond.getFieldValue().replace("[", "").replace("]", "").replace("\"", "")
                            .split(ConstantsCustomers.COMMA_SYMBOY))
                    .stream().map(Long::valueOf).collect(Collectors.toList()));
            break;
        case ConstantsCustomers.FIELD_BUSINESS_MAIN_ID:
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonBusinessMain(true);
                break;
            }
            input.setSearchBusinessMain(cond.getFieldValue().replace("[", "").replace("]", "").replace("\"", ""));
            break;
        case ConstantsCustomers.FIELD_BUSINESS_SUB_ID:
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonBusinessSub(true);
                break;
            }
            input.setSearchBusinessSub(cond.getFieldValue().replace("[", "").replace("]", "").replace("\"", ""));
            break;
        default:
            updateParamsSpecial(cond, idsToRemove, input);
            break;
        }

    }

    /**
     * update params for special items
     * 
     * @param cond - condition item
     * @param idsToRemove - id to remove from list
     * @param input - large input
     */
    private void updateParamsSpecial(SearchItem cond, List<Long> idsToRemove, CustomersSearchConditionsDTO input) {
        boolean isNonValue = StringUtils.isEmpty(cond.getFieldValue())
                || ConstantsCustomers.STRING_ARRAY_EMPTY.equals(cond.getFieldValue());
        String fieldName = cond.getFieldName().replace(ConstantsCustomers.DOT_KEYWORD, "");
        switch (fieldName) {
        case ConstantsCustomers.COLUMN_PERSON_IN_CHARGE:
        case ConstantsCustomers.CUSTOMER_DATA_PERSON_IN_CHARGE:
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonPersonInCharge(true);
                break;
            }
            input.setSearchPersonInCharge(true);
            break;
        case ConstantsCustomers.COLUMN_IS_DISPLAY_CHILD_CUSTOMERS:
            idsToRemove.add(cond.getFieldId());
            if (ConstantsCustomers.STRING_VALUE_TRUE.equalsIgnoreCase(cond.getFieldValue())) {
                input.setDisplayCutomerChilds(true);
            }
            break;
        case ConstantsCustomers.COLUMN_SCENARIO_ID:
            if (isNonValue) {
                idsToRemove.add(cond.getFieldId());
                input.setSearchNullScenarioId(true);
                break;
            }
            cond.setFieldType(Integer.parseInt(FieldTypeEnum.PULLDOWN.getCode()));
            break;
        case ConstantsCustomers.COLUMN_SCHEDULE_NEXT:
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonSchedule(true);
                break;
            }
            input.setSearchSchedule(true);
            // elastic search by schedules_name
            SearchConditionDTO scheduleSearch = searchConditionsItemsMapper.searchItemToSearchCondition(cond);
            scheduleSearch.setFieldName(
                    String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, ConstantsCustomers.COLUMN_SCHEDULE_NAME));
            scheduleSearch.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            scheduleSearch.setFieldOperator(Constants.Elasticsearch.Operator.AND.getValue());

            List<String> idsScheduleString = getListIdsFromElasticSearch(Arrays.asList(scheduleSearch),
                    String.format(ConstantsCustomers.INDEX_CALENDAR, input.getTenantName()),
                    ConstantsCustomers.COLUMN_SCHEDULE_ID);

            idsScheduleString.removeIf(StringUtils::isBlank);
            if (idsScheduleString.isEmpty()) {
                input.setTrueCondition(false);
                break;
            }
            // find customerId by schedules id

            List<Long> scheduleIds = idsScheduleString.stream().map(id -> Long.valueOf(id.trim()))
                    .collect(Collectors.toList());

            List<Long> customerIdBySchedule = schedulesRepository.findCustomerIdByNextScheduleId(scheduleIds);
            customerIdBySchedule.removeIf(Objects::isNull);

            input.getCustomerIdsBySchedules().addAll(customerIdBySchedule);
            break;
        case ConstantsCustomers.COLUMN_ACTION_NEXT:
            idsToRemove.add(cond.getFieldId());
            if (isNonValue) {
                input.setSearchNonTask(true);
                break;
            }
            // elastic search by task_name
            input.setSearchTask(true);
            SearchConditionDTO taskSearch = searchConditionsItemsMapper.searchItemToSearchCondition(cond);
            taskSearch.setFieldName(
                    String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, ConstantsCustomers.COLUMN_TASK_NAME));
            taskSearch.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
            taskSearch.setFieldOperator(Constants.Elasticsearch.Operator.AND.getValue());

            List<String> idsTaskString = getListIdsFromElasticSearch(Arrays.asList(taskSearch),
                    String.format(ConstantsCustomers.INDEX_CALENDAR, input.getTenantName()),
                    ConstantsCustomers.COLUMN_TASK_ID);

            idsTaskString.removeIf(StringUtils::isBlank);
            if (idsTaskString.isEmpty()) {
                input.setTrueCondition(false);
                break;
            }
            // find customerId by schedules id

            List<Long> taskIds = idsTaskString.stream().map(id -> Long.valueOf(id.trim())).collect(Collectors.toList());

            List<Long> customerIdByTask = tasksRepository.findCustomerIdByNextTaskId(taskIds);
            customerIdByTask.removeIf(Objects::isNull);

            input.getCustomerIdsByTasks().addAll(customerIdByTask);
            break;
        case ConstantsCustomers.COLUMN_LAST_CONTACT_DATE:
            idsToRemove.add(cond.getFieldId());
            input.setSearchLastContactDate(true);
            // get customerIds by last contact date
            getCustomerIdsByLastContactDateSearch(input, cond);
            break;
        default:
            break;
        }
    }

    /**
     * Get customerIds by last contact date search
     * 
     * @param input - input to save data searched
     * @param condition - item seach by last contact date
     */
    private void getCustomerIdsByLastContactDateSearch(CustomersSearchConditionsDTO input, SearchItem condition) {
        condition.setFieldType(Integer.parseInt(FieldTypeEnum.DATE.getCode()));

        // call API get business card
        GetBusinessCardsRequest businessCardReq = new GetBusinessCardsRequest();
        businessCardReq.setFilterConditions(new ArrayList<>());
        businessCardReq.setIsFirstLoad(true);
        businessCardReq.setLimit(ConstantsCustomers.DEFAULT_LIMIT_VALUE);
        businessCardReq.setOffset(ConstantsCustomers.LONG_VALUE_0L);
        businessCardReq.setOrderBy(new ArrayList<>());
        businessCardReq.setSearchLocal("");
        businessCardReq.setSelectedTargetId(ConstantsCustomers.LONG_VALUE_0L);
        businessCardReq.setSelectedTargetType(INTEGER_ZERO);
        businessCardReq.setSearchConditions(Arrays.asList(condition));

        GetBusinessCardsResponse businessCardRes = null;
        try {
            businessCardRes = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                    ConstantsCustomers.API_GET_BUSINESS_CARDS, HttpMethod.POST, businessCardReq,
                    GetBusinessCardsResponse.class, input.getToken(), input.getTenantName());
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_BUSINESS_CARDS,
                    e.getLocalizedMessage()));
        }

        if (businessCardRes == null || CollectionUtils.isEmpty(businessCardRes.getBusinessCards())) {
            input.setTrueCondition(false);
            return;
        }

        Map<Long, Instant> mapContactDate = new HashMap<>();
        businessCardRes.getBusinessCards().stream().filter(business -> business.getCustomerId() != null)
                .forEach(business -> {
                    mapContactDate.put(business.getCustomerId(), business.getLastContactDate());
                    input.getCustomerIdsByLastContactDate().add(business.getCustomerId());
                });
        if (input.getCustomerIdsByLastContactDate().isEmpty()) {
            input.setTrueCondition(false);
        }
        input.setMapContactDate(mapContactDate);
    }

    /**
     * getIdPersonInCharge
     * 
     * @param input
     * @param item
     * @return
     */
    private void getIdPersonInCharge(CustomersSearchConditionsDTO input, SearchItem item) {

        // find employee
        SearchConditionDTO empployeeSearch = searchConditionsItemsMapper.searchItemToSearchCondition(item);
        empployeeSearch.setFieldType(Integer.parseInt(FieldTypeEnum.TEXT.getCode()));
        empployeeSearch.setFieldName(
                String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, ConstantsCustomers.FIELD_EMPLOYEE_FULL_NAME));
        empployeeSearch.setFieldOperator(Constants.Elasticsearch.Operator.AND.getValue());

        List<String> idsStringEmployee = getListIdsFromElasticSearch(Arrays.asList(empployeeSearch),
                String.format(ConstantsCustomers.INDEX_EMPLOYEE, input.getTenantName()),
                ConstantsCustomers.EMPLOYEE_COLUMN_ID);

        List<Long> employeeIds = idsStringEmployee.stream().map(Long::valueOf).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(employeeIds)) {
            input.setTrueCondition(false);
            return;
        }
        input.getEmployeeIds().addAll(employeeIds);
        // find department and group by employee id
        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        GetGroupAndDepartmentByEmployeeIdsRequest groupDepRequest = new GetGroupAndDepartmentByEmployeeIdsRequest();
        groupDepRequest.setEmployeeIds(employeeIds);

        GetGroupAndDepartmentByEmployeeIdsOutDTO groupDepOut = null;
        try {
            groupDepOut = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                    ConstantsCustomers.API_GET_GROUP_AND_DEPARTMENT_BY_EMPLOYEE_IDS, HttpMethod.POST, groupDepRequest,
                    GetGroupAndDepartmentByEmployeeIdsOutDTO.class, token, tenantName);
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_GROUP_AND_DEPARTMENT_BY_EMPLOYEE_IDS, e.getLocalizedMessage()));
            return;
        }

        if (groupDepOut == null || CollectionUtils.isEmpty(groupDepOut.getEmployees())) {
            return;
        }
        groupDepOut.getEmployees().forEach(emp -> {
            if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                input.getDepartmentIds().addAll(emp.getDepartmentIds());
            }
            if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                input.getGroupIds().addAll(emp.getGroupIds());
            }
        });

        Set<Long> setId = new HashSet<>();
        input.getDepartmentIds().removeIf(id -> id == null || !setId.add(id));
        setId.clear();
        input.getGroupIds().removeIf(id -> id == null || !setId.add(id));

        if (input.isSearchPersonInCharge() && input.getEmployeeIds().isEmpty() && input.getDepartmentIds().isEmpty()
                && input.getGroupIds().isEmpty()) {
            input.setTrueCondition(false);
        }

    }

    /**
     * Build value for range field
     * 
     * @param searchItem - item
     */
    private void buildValueForRangeField(SearchItem searchItem) {
        Map<String, Object> dateMap = null;
        try {
            TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {};
            dateMap = objectMapper.readValue(searchItem.getFieldValue(), mapTypeRef);
            searchItem.setFieldValue(objectMapper.writeValueAsString(dateMap));
        } catch (IOException e) {
            log.warn(e.getLocalizedMessage());
        }
        if (dateMap == null) {
            try {
                TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {};
                List<Map<String, Object>> dateList = objectMapper.readValue(searchItem.getFieldValue(), listTypeRef);
                if (dateList != null) {
                    dateMap = dateList.get(0);
                }
                searchItem.setFieldValue(objectMapper.writeValueAsString(dateMap));
            } catch (IOException e) {
                log.warn(e.getLocalizedMessage());
            }
        }
    }

    /**
     * call APi get-group-and-department-by-employee-id
     * 
     * @param input
     * @param employeeIds - list id employee
     * @return - response from API
     */
    private void callApiGetGroupAndDepartmentByEmployeesIds(CustomersSearchConditionsDTO input,
            List<Long> employeeIds) {
        if (CollectionUtils.isEmpty(employeeIds)) {
            return;
        }
        GetGroupAndDepartmentByEmployeeIdsOutDTO outDto = channelUtils.getGroupAndDepartmentByEmployeeIds(employeeIds);
        if (outDto == null || CollectionUtils.isEmpty(outDto.getEmployees())) {
            return;
        }

        outDto.getEmployees().stream().forEach(emp -> {
            // add employee id
            input.getEmployeeIds().add(emp.getEmployeeId());

            input.getDepartmentIds().addAll(emp.getDepartmentIds());

            input.getGroupIds().addAll(emp.getGroupIds());
        });
        // get distinct list id
        input.setSearchPersonInCharge(true);
        input.setEmployeeIds(input.getEmployeeIds().stream().distinct().collect(Collectors.toList()));
        input.setDepartmentIds(input.getDepartmentIds().stream().distinct().collect(Collectors.toList()));
        input.setGroupIds(input.getGroupIds().stream().distinct().collect(Collectors.toList()));
    }

    /**
     * @param employeeLocalSeachConditions
     * @param format
     * @param employeeColumnId
     * @return
     */
    private List<String> getListIdsFromElasticSearch(List<SearchConditionDTO> listCondititonsElasticSearch,
            String index,
            String columnId) {
        GetDetailElasticSearchRequest elasticSearchRequest = new GetDetailElasticSearchRequest();
        elasticSearchRequest.setSearchConditions(listCondititonsElasticSearch);
        elasticSearchRequest.setIndex(index);
        elasticSearchRequest.setColumnId(columnId);

        SelectDetailElasticSearchResponse elasticSearchResponse = null;
        try {
            elasticSearchResponse = customersCommonService.getDetailDataFromElasticSearch(elasticSearchRequest);

        } catch (Exception e) {
            String mess = String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_DETAIL_ELASTIC_SEARCH, e.getLocalizedMessage());
            log.warn(mess);
            throw new CustomRestException(e.getMessage(),
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        List<String> listValue = new ArrayList<>();
        if (!elasticSearchResponse.getDataElasticSearch().isEmpty()) {
            elasticSearchResponse.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                if (columnId.equals(item.getKey())) {
                    listValue.add(item.getValue());
                }
            }));
        }
        return listValue;
    }

    /**
     * Build list conditions with same value for each item
     * 
     * @param valueSearch - value for each item
     * @param listFieldName - list fieldName
     * @param fieldType - fieldType for all item
     * @param isDefault - isDefault for all item
     * @param fieldOperator - operator search between items
     * @param searchType - 1: LIKE, 2: MATCH FIRST, 3: not match)
     * @param searchOption - The SearchItem searchOption (1: OR, 2: AND, 3: as
     *        ONE WORD, 4: NOT OR, 5: NOT AND )
     *        1, 2, 3: use TEXT. 1, 2, 4, 5: use checkbox, multi pulldown
     * @return list conditions
     */
    private List<SearchConditionDTO> buildConditionsSearchList(String valueSearch, List<String> listFieldName,
            Integer fieldType, String isDefault, int fieldOperator, String searchType, String searchOption) {
        List<SearchConditionDTO> listConditions = new ArrayList<>();
        listFieldName.forEach(field -> {
            SearchConditionDTO cond = new SearchConditionDTO();
            cond.setFieldName(field);
            cond.setFieldValue(valueSearch);
            cond.setFieldType(fieldType);
            cond.setIsDefault(isDefault);
            cond.setFieldOperator(fieldOperator);
            if (StringUtils.isNotEmpty(searchType)) {
                cond.setSearchType(searchType);
            }
            if (StringUtils.isNotEmpty(searchOption)) {
                cond.setSearchOption(searchOption);
            }
            listConditions.add(cond);
        });
        return listConditions;
    }

    /**
     * validate parameter for APi getCustomers
     * 
     * @param request - contains item to validate
     */
    private void validateGetcustomers(CustomersSearchConditionsDTO request) {
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.LIMIT, request.getLimit());
        fixedParams.put(ConstantsCustomers.OFFSET, request.getLimit());

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        List<Map<String, Object>> errors = new ArrayList<>();
        errors.addAll(CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token, tenantName));

        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * Call API updateListViewSetting
     * 
     * @param fieldBelong - fieldBelong
     * @param selectedTargetType - type of item
     * @param selectedTargetId - id of item selected
     * @param filterConditions - filter conditions list
     * @param orderBy - list orderBy
     * @param extraSettings - extrasetting
     */
    private void updateListViewSetting(int fieldBelong, Integer selectedTargetType, Long selectedTargetId,
            List<SearchItem> filterConditions, List<OrderValue> orderBy, List<KeyValue> extraSettings) {
        UpdateListViewSettingRequest updateListViewSettingRequest = new UpdateListViewSettingRequest();

        updateListViewSettingRequest.setFieldBelong(fieldBelong);
        updateListViewSettingRequest.setSelectedTargetType(selectedTargetType);
        updateListViewSettingRequest.setSelectedTargetId(selectedTargetId);
        if (filterConditions != null) {
            updateListViewSettingRequest.setFilterConditions(filterConditions);
        }
        if (orderBy != null) {
            updateListViewSettingRequest.setOrderBy(orderBy);
        }
        if (extraSettings != null) {
            updateListViewSettingRequest.setExtraSettings(extraSettings);
        }
        String token = SecurityUtils.getTokenValue().orElse(null);
        restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_UPDATE_LIST_VIEW_SETTING, HttpMethod.POST, updateListViewSettingRequest,
                String.class, token, jwtTokenUtil.getTenantIdFromToken());

    }

    /**
     * Calculated by the number of working days
     * 
     * @param filterConditions
     * @return
     */
    private void calculatedWorkingDays(List<SearchItem> listConditions) {
        if (CollectionUtils.isEmpty(listConditions)) {
            return;
        }
        listConditions.forEach(filter -> {
            if (!FieldTypeEnum.DATE.getCode().equals(filter.getFieldType().toString())
                    && !FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                    || StringUtils.isBlank(filter.getFieldValue())) {
                return;
            }
            Map<String, Object> dateMap = null;
            try {
                TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {};
                dateMap = objectMapper.readValue(filter.getFieldValue(), mapTypeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            if (dateMap == null) {
                try {
                    TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {};
                    List<Map<String, Object>> dateList = objectMapper.readValue(filter.getFieldValue(), listTypeRef);
                    if (dateList != null && !dateList.isEmpty()) {
                        dateMap = dateList.get(0);
                    } else {
                        return;
                    }
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
            }

            String fromKey = Query.SEARCH_FIELDS.FROM.toString().toLowerCase();
            String toKey = Query.SEARCH_FIELDS.TO.toString().toLowerCase();
            String filterModeDateKey = ConstantsCustomers.FILTER_MODE_DATE;

            Object fromValue = dateMap.get(fromKey);
            Object toValue = dateMap.get(toKey);
            Object filterModeDateValue = dateMap.get(filterModeDateKey);

            FilterWorkingDaysInDTO request = new FilterWorkingDaysInDTO();
            if (filterModeDateValue != null && StringUtils.isNotBlank(filterModeDateValue.toString())) {
                request.setFilterModeDate(String.valueOf(filterModeDateValue));
            } else {
                return;
            }

            if (fromValue != null && StringUtils.isNotBlank((String) fromValue)) {
                request.setCountFrom(String.valueOf(fromValue));
            }

            if (toValue != null && StringUtils.isNotBlank((String) toValue)) {
                request.setCountTo(String.valueOf(toValue));
            }

            FilterWorkingDaysOutDTO filterWorkingDayResponse;
            try {
                // Calculated by the number of working days
                String token = SecurityUtils.getTokenValue().orElse(null);
                filterWorkingDayResponse = restOperationUtils.executeCallApi(Constants.PathEnum.SCHEDULES,
                        "get-filter-working-days", HttpMethod.POST, request, FilterWorkingDaysOutDTO.class, token,
                        jwtTokenUtil.getTenantIdFromToken());
            } catch (Exception e) {
                log.error(e.getMessage());
                return;
            }

            Map<String, Object> fieldValue = new HashMap<>();
            if (StringUtils.isNotBlank(filterWorkingDayResponse.getDateFrom())) {
                String dateFrom = FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                        ? String.format(ConstantsCustomers.DATE_MINTIME, filterWorkingDayResponse.getDateFrom())
                        : filterWorkingDayResponse.getDateFrom();
                fieldValue.put(Query.SEARCH_FIELDS.FROM.toString().toLowerCase(), dateFrom);
            }
            if (StringUtils.isNotBlank(filterWorkingDayResponse.getDateTo())) {
                String dateTo = FieldTypeEnum.DATETIME.getCode().equals(filter.getFieldType().toString())
                        ? String.format(ConstantsCustomers.DATE_MAXTIME, filterWorkingDayResponse.getDateTo())
                        : filterWorkingDayResponse.getDateTo();
                fieldValue.put(Query.SEARCH_FIELDS.TO.toString().toLowerCase(), dateTo);
            }

            try {
                filter.setFieldValue(objectMapper.writeValueAsString(fieldValue));
            } catch (JsonProcessingException e) {
                log.error(e.getLocalizedMessage());
            }
        });

    }

    /**
     * @param calculatorFormular
     * @return
     */
    private Map<String, String> getFomularMap(List<CalculatorFormularDTO> calculatorFormularList) {
        Map<String, String> formularMap = new HashMap<>();
        if (calculatorFormularList != null) {
            calculatorFormularList.forEach(field -> formularMap.put(field.getFieldName(), field.getConfigValue()));
        }
        return formularMap;
    }
    

    /**
     * @param input
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getOptionMap(CustomersSearchConditionsDTO input, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        orderByOptionMap.putAll(getCalculationOptionMap(input.getSearchConditions(), languageCode, formularMap));
        orderByOptionMap.putAll(getCalculationOptionMap(input.getFilterConditions(), languageCode, formularMap));
        orderByOptionMap.putAll(getOrderCalculationOptionMap(input.getListOrders(), languageCode, formularMap));
        return orderByOptionMap;
    }

    /**
     * get calculation option map
     * 
     * @param selectItemList
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getCalculationOptionMap(List<SearchItem> selectItemList, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        if (selectItemList == null) {
            return orderByOptionMap;
        }
        for (SearchItem searchItem : selectItemList) {
            String fieldName = searchItem.getFieldName().substring(
                    searchItem.getFieldName().replace(ConstantsCustomers.DOT_KEYWORD, "").indexOf(Constants.PERIOD)
                            + 1);
            if (!fieldName.contains("relation_")) {
                OrderByOption orderByOption = new OrderByOption();
                orderByOption.setLanguageCode(languageCode);
                orderByOption.setFormular(formularMap.get(fieldName));
                orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setColumnPK(
                        "customers." + Constants.Elasticsearch.getColumnPrimary(FieldBelong.CUSTOMER.getValue()));
                orderByOptionMap.put(fieldName, orderByOption);
            }
        }
        return orderByOptionMap;
    }

    /**
     * get calculation option map
     * 
     * @param orderByList
     * @param languageCode
     * @param formularMap
     * @return
     */
    private Map<String, OrderByOption> getOrderCalculationOptionMap(List<KeyValue> orderByList, String languageCode,
            Map<String, String> formularMap) {
        Map<String, OrderByOption> orderByOptionMap = new HashMap<>();
        if (orderByList == null) {
            return orderByOptionMap;
        }

        FieldInfo relationData = null;
        for (KeyValue order : orderByList) {
            String fieldName = order.getKey().substring(
                    order.getKey().replace(ConstantsCustomers.DOT_KEYWORD, "").indexOf(Constants.PERIOD) + 1);
            OrderByOption orderByOption = new OrderByOption();
            orderByOption.setLanguageCode(languageCode);
            orderByOption.setFormular(formularMap.get(fieldName));
            if (!fieldName.contains("relation_")) {
                orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(FieldBelong.CUSTOMER.getValue()));
                orderByOption.setColumnPK(
                        "tmp_customers_all." + Constants.Elasticsearch.getColumnPrimary(FieldBelong.CUSTOMER.getValue()));
                orderByOptionMap.put(fieldName, orderByOption);
            } else {
                if (relationData == null) {
                    List<FieldInfo> relationList = getRealationData(fieldName);
                    if (!CollectionUtils.isEmpty(relationList)) {
                        relationData = relationList.get(0);
                    }
                }
                if (relationData != null) {
                    orderByOption.setRelationTable(Constants.Elasticsearch.getTableMain(relationData.getFieldBelong()));
                    orderByOption.setColumnData(Constants.Elasticsearch.getColumnData(relationData.getFieldBelong()));
                    orderByOption.setRelationPK(Constants.Elasticsearch.getColumnPrimary(relationData.getFieldBelong()));
                    orderByOption.setColumnPK(Constants.Elasticsearch.getColumnPrimary(relationData.getFieldBelong()));
                }
            }
            orderByOptionMap.put(fieldName, orderByOption);
        }
        return orderByOptionMap;
    }

    /**
     * get relationdata
     * 
     * @param fieldName
     * @return
     */
    private List<FieldInfo> getRealationData(String fieldName) {
        return fieldInfoRepository.getRealationData(fieldName);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerId(java.lang.String)
     * @param customerName - customerName
     * @return GetCustomerIdOutDTO the entity response
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetCustomerIdOutDTO getCustomerId(String customerName) {
        if (customerName == null) {
            throw new CustomRestException("Param[customer_name] is null",
                    CommonUtils.putError(CUSTOMER_NAME, Constants.RIQUIRED_CODE));
        }
        // 1. Get customerId
        GetCustomerIdOutDTO response = null;
        List<CustomerIdOutDTO> listCustomerIdOutDTOs = new ArrayList<>();
        List<Customers> customers = customersRepository.findAllByCustomerName(customerName);
        if (customers == null || customers.isEmpty()) {
            return response;
        }
        // 2. Create response
        response = new GetCustomerIdOutDTO();
        for (Customers item : customers) {
            CustomerIdOutDTO customerIdOutDTO = new CustomerIdOutDTO();
            customerIdOutDTO.setCustomerId(item.getCustomerId());
            customerIdOutDTO.setCustomerName(item.getCustomerName());
            listCustomerIdOutDTOs.add(customerIdOutDTO);
        }
        response.setCustomerNames(listCustomerIdOutDTOs);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getUrlQuicksight(Long)
     */
    @Override
    public GetUrlQuicksightResponse getUrlQuicksight(Long customerId) {
        GetUrlQuicksightResponse getUrlQuicksightResponse = new GetUrlQuicksightResponse();
        // 1. Validate input parameter
        if (customerId == null) {
            throw new CustomRestException("Param[customerId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        // 2. Get UrlQuicksight information

        // get session info
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }

        // 2.1. Call API retrieves the schedule information of the transaction
        // product
        GetProgressesRequest getProgressesRequest = new GetProgressesRequest();
        getProgressesRequest.setIsOnlyUsableData(true);
        List<Long> productTradingProgressIds = new ArrayList<>();
        productTradingProgressIds.add(1L);
        getProgressesRequest.setProductTradingProgressIds(productTradingProgressIds);

        GetProgressesOutDTO getProgressesResponse = null;
        try {
            getProgressesResponse = restOperationUtils.executeCallApi(PathEnum.SALES,
                    ConstantsCustomers.API_GET_PROGRESSES, HttpMethod.POST, getProgressesRequest,
                    GetProgressesOutDTO.class, token, tenantName);
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_PROGRESSES,
                    e.getLocalizedMessage()));
        }

        StringBuilder getProgressesResult = new StringBuilder();

        if (getProgressesResponse != null && getProgressesResponse.getProgresses() != null) {
            getProgressesResponse.getProgresses().forEach(item -> {
                if (item.getProductTradingProgressId() != null) {
                    getProgressesResult.append(ConstantsCustomers.AMPERSAND_PROCESS_EQUAL)
                            .append(item.getProductTradingProgressId());
                }
            });
        }

        // 2.2. Call API get dashbroadId information
        GetReportsRequest getReportsRequest = new GetReportsRequest();
        getReportsRequest.setServiceId(5L);
        getReportsRequest.setLimit(1);
        getReportsRequest.setOffset(0);
        GetReportsResponse getReportsResponse = null;
        try {
            getReportsResponse = restOperationUtils.executeCallApi(PathEnum.ANALYSIS,
                    ConstantsCustomers.API_GET_REPORTS, HttpMethod.POST, getReportsRequest, GetReportsResponse.class,
                    token, tenantName);
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_REPORTS,
                    e.getLocalizedMessage()));
        }

        if (getReportsResponse == null || getReportsResponse.getReports() == null
                || getReportsResponse.getReports().size() != 1) {
            return null;
        }
        String dashboardId = getReportsResponse.getReports().get(0).getDashboardId();

        // 2.3. Call API get URL quick sight
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("dashboardId", dashboardId);

        DashboardEmbedUrlResponse dashboardEmbedUrlResponse = null;
        try {
            dashboardEmbedUrlResponse = restOperationUtils.executeCallApiWithQueryParam(PathEnum.ANALYSIS,
                    ConstantsCustomers.API_GET_DASHBOARD_EMBED_URL, HttpMethod.POST, queryParams, null,
                    DashboardEmbedUrlResponse.class, token, tenantName);
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_DASHBOARD_EMBED_URL, e.getLocalizedMessage()));
        }
        if (dashboardEmbedUrlResponse == null) {
            return null;
        }
        String embedUrl = dashboardEmbedUrlResponse.getEmbedUrl();
        getUrlQuicksightResponse.setUrlQuickSight(embedUrl + getProgressesResult.toString());
        return getUrlQuicksightResponse;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersService#getCustomerHistory(Long,Integer,Integer)
     */
    @Override
    public GetCustomerHistoryResponse getCustomerHistory(Long customerId, Integer currentPage, Integer limit) {
        GetCustomerHistoryResponse getCustomerHistoryResponse = new GetCustomerHistoryResponse();
        List<GetCustomerHistorySubType1DTO> customersHistory = new ArrayList<>();

        // 1. Validate the input parameters
        if (customerId == null) {
            throw new CustomRestException("Param[customerId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2 validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CURRENT_PAGE, currentPage);
        fixedParams.put(ConstantsCustomers.LIMIT, limit);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        List<CustomersHistories> customersHistoriesList = customersHistoriesRepository.findAllByCustomerId(customerId,
                PageRequest.of(currentPage - 1, limit, Sort.by(Sort.Direction.DESC, "createdDate")));

        List<Long> customersHistoriesIdList = new ArrayList<>();

        if (!CollectionUtils.isEmpty(customersHistoriesList)) {
            customersHistoriesList.forEach(customersHistories -> {
                // 2. Get the change history information
                GetCustomerHistorySubType1DTO getCustomerHistorySubType1DTO = new GetCustomerHistorySubType1DTO();
                getCustomerHistorySubType1DTO.setCreatedDate(customersHistories.getCreatedDate());
                getCustomerHistorySubType1DTO.setCreatedUserId(customersHistories.getCreatedUser());
                getCustomerHistorySubType1DTO.setContentChange(customersHistories.getContentChange());
                getCustomerHistorySubType1DTO.setMergedCustomerId(customersHistories.getMergedCustomerId());
                customersHistory.add(getCustomerHistorySubType1DTO);

                customersHistoriesIdList.add(customersHistories.getCreatedUser());
            });
        }

        // 5. Call API getEmployeesByIds
        DataSyncElasticSearchRequest employeesByIdsRequest = new DataSyncElasticSearchRequest();
        employeesByIdsRequest.setEmployeeIds(customersHistoriesIdList);

        GetEmployeesByIdsResponse employeesByIdsResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS, HttpMethod.POST, employeesByIdsRequest,
                GetEmployeesByIdsResponse.class, token, tenantName);
        if (employeesByIdsResponse != null && !CollectionUtils.isEmpty(employeesByIdsResponse.getEmployees())) {
            List<EmployeeInfoDTO> employees = employeesByIdsResponse.getEmployees();

            customersHistory.forEach(item -> employees.stream()
                    .filter(emp -> item.getCreatedUserId().equals(emp.getEmployeeId())).findAny().ifPresent(emp -> {
                        item.setCreatedUserName(
                                StringUtil.getFullName(emp.getEmployeeSurname(), emp.getEmployeeName()));
                        String createdUserImage = null;
                        if (emp.getEmployeeIcon() != null) {
                            createdUserImage = emp.getEmployeeIcon().getFileUrl();
                        }
                        item.setCreatedUserImage(createdUserImage);
                    }));
        }

        // 6. Create response data for the API
        getCustomerHistoryResponse.setCustomersHistory(customersHistory);

        return getCustomerHistoryResponse;
    }

    /**
     * Get full path from path
     * 
     * @param filePath - file path
     * @return full url
     */
    private String buildFileUrl(String filePath) {
        if (StringUtils.isBlank(filePath)) {
            return "";
        }

        if (filePath.startsWith(ConstantsCustomers.URL_START)) {
            return filePath;
        }
        return S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(), filePath,
                applicationProperties.getExpiredSeconds());
    }

}
