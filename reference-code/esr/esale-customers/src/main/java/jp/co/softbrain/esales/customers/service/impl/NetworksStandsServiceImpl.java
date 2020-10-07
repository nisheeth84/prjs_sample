package jp.co.softbrain.esales.customers.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ApplicationProperties;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.MastersStands;
import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom;
import jp.co.softbrain.esales.customers.repository.MastersStandsRepository;
import jp.co.softbrain.esales.customers.repository.NetworksStandsRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.MastersMotivationsService;
import jp.co.softbrain.esales.customers.service.NetworksStandsService;
import jp.co.softbrain.esales.customers.service.dto.GetProductTradingIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType11DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType12DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType13DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType14DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType3DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType7DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType8DTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType9DTO;
import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsType1DTO;
import jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO;
import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapInDTO;
import jp.co.softbrain.esales.customers.service.dto.RemoveBusinessCardsOutOfNetworkMapOutDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardDepartmentSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesType1DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardDepartmentsRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardDepartmentsResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsByIdsDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsByIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsByIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapResponse;
import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.employees.DataSyncElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.DepartmentPositionDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.customers.service.mapper.InitializeNetworkMapMapper;
import jp.co.softbrain.esales.customers.service.mapper.NetworksStandsMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveNetworkMapRequest;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * Service Implementation for managing {@link NetworksStands}
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class NetworksStandsServiceImpl implements NetworksStandsService {

    private static final String DEPARTMENTS = "departments";
    private static final String BUSINESS_CARD_IDS = "businessCardIds";

    @Autowired
    private NetworksStandsRepository networksStandsRepository;

    @Autowired
    private NetworksStandsMapper networksStandsMapper;

    @Autowired
    private MastersMotivationsService mastersMotivationsService;

    @Autowired
    private MastersStandsRepository mastersStandsRepository;

    @Autowired
    private CustomersRepositoryCustom customersRepositoryCustom;

    @Autowired
    private InitializeNetworkMapMapper initializeNetworkMapMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    Gson gson = new Gson();

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private ApplicationProperties applicationProperties;

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#save(jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO)
     */
    @Override
    public NetworksStandsDTO save(NetworksStandsDTO dto) {
        NetworksStands entity = networksStandsMapper.toEntity(dto);
        entity = networksStandsRepository.save(entity);
        return networksStandsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        networksStandsRepository.deleteByNetworkStandId(id);

    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<NetworksStandsDTO> findOne(Long id) {
        return networksStandsRepository.findByNetworkStandId(id).map(networksStandsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<NetworksStandsDTO> findAll(Pageable pageable) {
        return networksStandsRepository.findAll(pageable).map(networksStandsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<NetworksStandsDTO> findAll() {
        return networksStandsRepository.findAll().stream().map(networksStandsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#addNetworkStand(jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO)
     */
    @Override
    @Transactional
    public Long addNetworkStand(NetworksStandsDTO parameters) {
        // 0. Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameter
        List<Map<String, Object>> errors = new ArrayList<>();
        Long businessCardCompanyId = parameters.getBusinessCardCompanyId();
        if (businessCardCompanyId == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.BUSINESS_CARD_COMPANY_ID, Constants.RIQUIRED_CODE));
        }
        Long businessCardDepartmentId = parameters.getBusinessCardDepartmentId();
        if (businessCardDepartmentId == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.BUSINESS_CARD_DEPARTMENT_ID, Constants.RIQUIRED_CODE));
        }
        Long businessCardId = parameters.getBusinessCardId();
        if (businessCardId == null) {
            errors.add(CommonUtils.putError(ConstantsCustomers.BUSINESS_CARD_ID, Constants.RIQUIRED_CODE));
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // 2. Create data Network Stand
        NetworksStandsDTO networksStandsDTO = new NetworksStandsDTO();
        networksStandsDTO.setBusinessCardCompanyId(businessCardCompanyId);
        networksStandsDTO.setBusinessCardDepartmentId(businessCardDepartmentId);
        networksStandsDTO.setBusinessCardId(businessCardId);
        networksStandsDTO.setStandId(parameters.getStandId());
        networksStandsDTO.setMotivationId(parameters.getMotivationId());
        networksStandsDTO.setProductTradingId(parameters.getProductTradingId());
        networksStandsDTO.setComment(parameters.getComment());
        networksStandsDTO.setCreatedUser(employeeId);
        networksStandsDTO.setUpdatedUser(employeeId);
        NetworksStandsDTO networksStandsAdded = save(networksStandsDTO);

        return networksStandsAdded.getNetworkStandId();
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#updateNetworkStand(jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO)
     */
    @Override
    @Transactional
    public Long updateNetworkStand(NetworksStandsDTO updateParameters) {
        // 0. Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameter
        Long networkStandId = updateParameters.getNetworkStandId();
        if (networkStandId == null) {
            throw new CustomRestException(ConstantsCustomers.ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.NETWORK_STAND_ID, Constants.RIQUIRED_CODE));
        }

        // 2. Create data Network Stand
        Optional<NetworksStandsDTO> networksStands = this.findOne(networkStandId);
        if (networksStands.isPresent()) {
            NetworksStandsDTO networksStandsDTO = networksStands.get();
            networksStandsDTO.setStandId(updateParameters.getStandId());
            networksStandsDTO.setMotivationId(updateParameters.getMotivationId());
            networksStandsDTO.setProductTradingId(updateParameters.getProductTradingId());
            networksStandsDTO.setComment(updateParameters.getComment());
            networksStandsDTO.setUpdatedUser(employeeId);
            NetworksStandsDTO networksStandsUpdated = this.save(networksStandsDTO);
            networkStandId = networksStandsUpdated.getNetworkStandId();
        } else {
            throw new CustomRestException(ConstantsCustomers.ERROR_EXCLUSIVE,
                    CommonUtils.putError("updateNetworkStand", Constants.EXCLUSIVE_CODE));
        }

        return networkStandId;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#deleteNetworkStand(java.lang.Long)
     */
    @Override
    @Transactional
    public Long deleteNetworkStand(Long networkStandId) {
        // 1.validate parameters
        if (networkStandId == null) {
            throw new CustomRestException(ConstantsCustomers.ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.NETWORK_STAND_ID, Constants.RIQUIRED_CODE));
        }
        // 2. Delete NetworkStand
        delete(networkStandId);
        // 3. Response
        return networkStandId;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#removeBusinessCardsOutOfNetworkMap(java.lang.Long,
     *      java.util.List)
     */
    @Override
    @Transactional
    public RemoveBusinessCardsOutOfNetworkMapOutDTO removeBusinessCardsOutOfNetworkMap(Long businessCardCompanyId,
            List<RemoveBusinessCardsOutOfNetworkMapInDTO> departments) {
        // 1. Validate parameter
        if (businessCardCompanyId == null) {
            throw new CustomRestException("Param [businessCardCompanyId] must not be null ",
                    CommonUtils.putError(ConstantsCustomers.BUSINESS_CARD_COMPANY_ID, Constants.RIQUIRED_CODE));
        }
        if (departments == null || departments.isEmpty()) {
            throw new CustomRestException("Param [departments] must not be null or not empty ",
                    CommonUtils.putError(DEPARTMENTS, Constants.RIQUIRED_CODE));
        }
        for (RemoveBusinessCardsOutOfNetworkMapInDTO department : departments) {
            if (department.getBusinessCardDepartmentId() == null) {
                throw new CustomRestException("Param [businessCardCompanyId] must not be null ",
                        CommonUtils.putError(ConstantsCustomers.BUSINESS_CARD_DEPARTMENT_ID, Constants.RIQUIRED_CODE));
            }
            if (department.getBusinessCardIds() == null || department.getBusinessCardIds().isEmpty()) {
                throw new CustomRestException("Param [businessCardCompanyId] must not be null and not empty ",
                        CommonUtils.putError(BUSINESS_CARD_IDS, Constants.RIQUIRED_CODE));
            }
        }
        // 2.Delete information of position of business card
        for (RemoveBusinessCardsOutOfNetworkMapInDTO department : departments) {
            List<Long> listBusinessCardId = networksStandsRepository
                    .findAllByBusinessCardCompanyIdAndBusinessCardDepartmentId(businessCardCompanyId,
                            department.getBusinessCardDepartmentId());
            List<Long> businessCardIds = new ArrayList<>();
            for (Long businessCardId : listBusinessCardId) {
                if (department.getBusinessCardIds().contains(businessCardId)) {
                    businessCardIds.add(businessCardId);
                }
            }
            networksStandsRepository.deleteInformationOfBusinessCard(businessCardCompanyId,
                    department.getBusinessCardDepartmentId(), businessCardIds);
            department.setBusinessCardIds(businessCardIds);
        }

        // 3.Call API deleteDepartmentBusinessCards
        // 4.Make response
        RemoveBusinessCardsOutOfNetworkMapOutDTO response = new RemoveBusinessCardsOutOfNetworkMapOutDTO();
        response.setBusinessCardCompanyId(businessCardCompanyId);
        response.setDepartments(departments);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#findByBusinessCardId(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<NetworksStandsDTO> findByBusinessCardId(Long businessCardId) {
        return networksStandsMapper.toDto(networksStandsRepository.findByBusinessCardId(businessCardId));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#initializeNetworkMap(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public InitializeNetworkMapOutDTO initializeNetworkMap(Long customerId, String langKey) {
        InitializeNetworkMapOutDTO networkMapOutDTO = new InitializeNetworkMapOutDTO();
        // 0. Get from token
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        // 1. Validate parameter
        this.initializeNetworkMapValidateParameter(customerId);
        
        // 2. Get info Network Map
        //2.1 Call API getDepartmentBusinessCards
        GetBusinessCardDepartmentsRequest getBusCarDepRequest = new GetBusinessCardDepartmentsRequest();
        getBusCarDepRequest.setCustomerId(customerId);
        GetBusinessCardDepartmentsResponse busCardResponse = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                ConstantsCustomers.API_GET_BUSINESSCARD_DEPARTMENTS, HttpMethod.POST, getBusCarDepRequest,
                GetBusinessCardDepartmentsResponse.class, token, tenantName);
        List<Long> businessCardIds = new ArrayList<>();
        List<BusinessCardDepartmentSubType1DTO> departments = null;
        Map<Long, List<Long>> departmentIdMap = new HashMap<>();
        if (busCardResponse != null) {
            departments = busCardResponse.getDepartments();
            departments.forEach(dep -> {
                Long key = dep.getDepartmentId();
                List<Long> businessCardIdList = dep.getBusinessCardIds();
                if (departmentIdMap.containsKey(key)) {
                    departmentIdMap.get(key).addAll(businessCardIdList);
                } else {
                    departmentIdMap.put(key, businessCardIdList);
                }
            });
            departmentIdMap
                    .forEach((k, v) -> businessCardIds.addAll(v.stream().distinct().collect(Collectors.toList())));
        }
        // 2.2 Get info posistion and desire
        List<Long> businessCardIdsDistinct = businessCardIds.stream().distinct().collect(Collectors.toList());
        if (!businessCardIdsDistinct.isEmpty() && busCardResponse != null) {
            List<BusinessCardDepartmentSubType1DTO> deps = busCardResponse.getDepartments();
            List<NetworksStands> networkStandList = networksStandsRepository
                    .getInfoPosistionAndDesire(businessCardIdsDistinct);
            networkMapOutDTO.setDepartments(getDepartments(deps, networkStandList));
        }
        // 2.3 Get BusinessCard
        GetBusinessCardsByIdsRequest getBusCardRequest = new GetBusinessCardsByIdsRequest();
        getBusCardRequest.setBusinessCardIds(businessCardIdsDistinct);

        GetBusinessCardsByIdsResponse getBusinessCardsResponse = restOperationUtils.executeCallApi(
                PathEnum.BUSINESSCARDS, ConstantsCustomers.API_GET_BUSINESS_CARDS_BY_IDS, HttpMethod.POST,
                getBusCardRequest, GetBusinessCardsByIdsResponse.class, token, tenantName);
        if (getBusinessCardsResponse != null && departments != null) {
            
            Map<Long, Long> businessCardIdMap = new HashMap<>();
            departmentIdMap.forEach((k, v) -> v.forEach(businessCardId -> businessCardIdMap.put(businessCardId, k)));
            networkMapOutDTO.setBusinessCardDatas(getBusinessCardDatas(getBusinessCardsResponse, businessCardIdMap));
        }

        // 3. Call API get info of employees
        List<Long> employeeIds = getEmployeeIdBusinessCards(getBusinessCardsResponse);
        DataSyncElasticSearchRequest employeesRequest = new DataSyncElasticSearchRequest();
        employeesRequest.setEmployeeIds(employeeIds);
        GetEmployeesByIdsResponse employeesResponse = restOperationUtils.executeCallApi(PathEnum.EMPLOYEES,
                ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS, HttpMethod.POST, employeesRequest,
                GetEmployeesByIdsResponse.class, token, tenantName);
        if (employeesResponse != null) {
            List<InitializeNetworkMapSubType3DTO> employeeDataList = new ArrayList<>();
            List<EmployeeInfoDTO> employeesInfoList = employeesResponse.getEmployees();
            employeesInfoList.forEach(employeesInfo -> {
                InitializeNetworkMapSubType3DTO employee = getEmployee(employeesInfo);

                employeeDataList.add(employee);
            });
            networkMapOutDTO.setEmployeeDatas(employeeDataList);
        }
        // 4. Get list master stands
        List<MastersStands> listMastersStands = mastersStandsRepository
                .findByIsAvailable(Boolean.TRUE);
        List<MastersStandsType1DTO> standDatas = new ArrayList<>();
        listMastersStands.forEach(mastersStands -> {
            MastersStandsType1DTO mastersStandsDTO = new MastersStandsType1DTO();
            mastersStandsDTO.setMasterStandId(mastersStands.getMasterStandId());
            mastersStandsDTO.setMasterStandName(mastersStands.getMasterStandName());
            standDatas.add(mastersStandsDTO);
        });
        networkMapOutDTO.setStandDatas(standDatas);
        // 5. Get List master motivation
        List<MastersMotivationsDTO> motivationsDTOList = mastersMotivationsService.findByIsAvailable(Boolean.TRUE);
        if (motivationsDTOList != null) {
            List<InitializeNetworkMapSubType4DTO> motivationDatas = new ArrayList<>();
            motivationsDTOList.forEach(motivationDTO -> {
                InitializeNetworkMapSubType4DTO motivation = new InitializeNetworkMapSubType4DTO();
                motivation.setMotivationId(motivationDTO.getMasterMotivationId());
                motivation.setMotivationName(motivationDTO.getMasterMotivationName());
                InitializeNetworkMapSubType8DTO motivationIcon = getMotivationsIcon(motivationDTO.getIconName(),
                        motivationDTO.getIconPath(), motivationDTO.getBackgroundColor());
                motivation.setMotivationIcon(motivationIcon);
                motivationDatas.add(motivation);
            });
            networkMapOutDTO.setMotivationDatas(motivationDatas);
        }

        // 7. Get Customer Info
        List<InitializeNetworkMapCustomerDTO> customerInfoDTOList = customersRepositoryCustom
                .getCustomerInfo(customerId);
        if (customerInfoDTOList != null && !customerInfoDTOList.isEmpty()) {
            InitializeNetworkMapSubType9DTO customerInfo = new InitializeNetworkMapSubType9DTO();
            customerInfo.setCustomerId(customerInfoDTOList.get(0).getCustomerId());
            customerInfo.setCustomerName(customerInfoDTOList.get(0).getCustomerName());
            InitializeNetworkMapSubType9DTO parentCustomerInfo = new InitializeNetworkMapSubType9DTO();
            parentCustomerInfo.setCustomerId(customerInfoDTOList.get(0).getParentCustomerId());
            parentCustomerInfo.setCustomerName(customerInfoDTOList.get(0).getParentCustomerName());
            List<InitializeNetworkMapSubType9DTO> customerChilds = new ArrayList<>();
            customerInfoDTOList.forEach(customerInfoDTO -> {
                InitializeNetworkMapSubType9DTO childCustomerInfo = new InitializeNetworkMapSubType9DTO();
                childCustomerInfo.setCustomerId(customerInfoDTO.getChildCustomerId());
                childCustomerInfo.setCustomerName(customerInfoDTO.getChildCustomerName());
                customerChilds.add(childCustomerInfo);
            });
            networkMapOutDTO.setCustomerChilds(customerChilds);
            networkMapOutDTO.setCustomer(customerInfo);
            networkMapOutDTO.setCustomerParent(parentCustomerInfo);
        }
        // 8. Response
        return networkMapOutDTO;
    }


    /**
     * Get motivations Icon
     * 
     * @param iconName
     *            iconName
     * @param iconPath
     *            iconPath
     * @param backgroundColor
     *            backGroundColor
     * @return motivations icon dto
     */
    private InitializeNetworkMapSubType8DTO getMotivationsIcon(String iconName, String iconPath,
            Integer backgroundColor) {
        InitializeNetworkMapSubType8DTO iconDTO = new InitializeNetworkMapSubType8DTO();
        iconDTO.setIconName(iconName);
        if (!StringUtils.isBlank(iconPath)) {
            iconDTO.setIconPath(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                    iconPath, applicationProperties.getExpiredSeconds()));
        }
        iconDTO.setBackgroundColor(backgroundColor);
        return iconDTO;
    }

    /**
     * @param employeesInfo
     * @return
     */
    private InitializeNetworkMapSubType3DTO getEmployee(EmployeeInfoDTO employeesInfo) {
        InitializeNetworkMapSubType3DTO employee = new InitializeNetworkMapSubType3DTO();
        employee.setEmployeeId(employeesInfo.getEmployeeId());
        List<DepartmentPositionDTO> departmentList = employeesInfo.getEmployeeDepartments();
        if (departmentList != null) {
            departmentList.forEach(department -> {
                employee.setDepartmentName(department.getDepartmentName());
                employee.setPositionName(department.getPositionName());
            });
        }
        employee.setEmployeeSurname(employeesInfo.getEmployeeSurname());
        employee.setEmployeeName(employeesInfo.getEmployeeName());
        employee.setEmployeeSurnameKana(employeesInfo.getEmployeeSurnameKana());
        employee.setEmployeeNameKana(employeesInfo.getEmployeeNameKana());
        employee.setTelephoneNumber(employeesInfo.getTelephoneNumber());
        employee.setCellphoneNumber(employeesInfo.getCellphoneNumber());
        if (!CollectionUtils.isEmpty(employeesInfo.getEmployeeDepartments())) {
            employee.setDepartmentName(employeesInfo.getEmployeeDepartments().get(0).getDepartmentName());
            employee.setPositionName(employeesInfo.getEmployeeDepartments().get(0).getPositionName());
        }
        employee.setEmail(employeesInfo.getEmail());
        if (employeesInfo.getEmployeeIcon() != null) {
            InitializeNetworkMapSubType7DTO employeeImage = new InitializeNetworkMapSubType7DTO();
            employeeImage.setFileName(employeesInfo.getEmployeeIcon().getFileName());
            employeeImage
                    .setFilePath(S3CloudStorageClient.generatePresignedURL(applicationProperties
                            .getUploadBucket(),
                            employeesInfo.getEmployeeIcon().getFilePath(), applicationProperties.getExpiredSeconds()));
            employee.setEmployeePhoto(employeeImage);
        }
        return employee;
    }

    /**
     * Get departmnets
     * 
     * @param departmentIdMap
     * 
     * @param busCardResponse
     *            response
     * @param networkStandList
     * @return list department
     */
    private List<InitializeNetworkMapSubType12DTO> getDepartments(List<BusinessCardDepartmentSubType1DTO> deps,
            List<NetworksStands> networkStandList) {
        List<InitializeNetworkMapSubType12DTO> listDeparmtnet = new ArrayList<>();
        final Map<Long, NetworksStands> networkStandMap = Optional.ofNullable(networkStandList).map(Collection::stream)
                .orElse(Stream.empty())
                .collect(Collectors.toMap(NetworksStands::getBusinessCardId, network -> network));
        deps.forEach(dep -> {
            List<InitializeNetworkMapSubType11DTO> networkStands = new ArrayList<>();
            InitializeNetworkMapSubType12DTO dto = new InitializeNetworkMapSubType12DTO();
            dto.setDepartmentId(dep.getDepartmentId());
            dto.setDepartmentName(dep.getDepartmentName());
            dto.setParentId(dep.getParentId());
            List<Long> businessCardIds = dep.getBusinessCardIds();
            if (!CollectionUtils.isEmpty(businessCardIds)) {
                businessCardIds = businessCardIds.stream().distinct().collect(Collectors.toList());
                businessCardIds.forEach(businessCardId -> {
                    InitializeNetworkMapSubType11DTO stands = new InitializeNetworkMapSubType11DTO();
                    stands.setBusinessCardId(businessCardId);
                    NetworksStands networkStandDTO = networkStandMap.get(businessCardId);
                    if (networkStandDTO == null) {
                        return;
                    }
                    InitializeNetworkMapSubType14DTO standsDTO = new InitializeNetworkMapSubType14DTO();
                    standsDTO.setNetworkStandId(networkStandDTO.getNetworkStandId());
                    standsDTO.setMasterStandId(networkStandDTO.getStandId());
                    standsDTO.setMotivationId(networkStandDTO.getMotivationId());
                    standsDTO.setComment(networkStandDTO.getComment());
                    stands.setStands(standsDTO);
                    networkStands.add(stands);
                });
            }
            dto.setNetworkStands(networkStands.stream().distinct().collect(Collectors.toList()));
            listDeparmtnet.add(dto);
        });
        return listDeparmtnet.stream().distinct().collect(Collectors.toList());
    }

    /**
     * Get employee id business card
     * 
     * @param getBusinessCardsResponse
     * @return List<Long> employeeid
     */
    private List<Long> getEmployeeIdBusinessCards(GetBusinessCardsByIdsResponse getBusinessCardsResponse) {
        if (getBusinessCardsResponse != null) {
            List<GetBusinessCardsByIdsDTO> businessCards = getBusinessCardsResponse.getBusinessCards();
            List<BusinessCardReceivesDTO> businessCardsReceives = new ArrayList<>();
            businessCards.forEach(buCard -> businessCardsReceives.addAll(buCard.getBusinessCardsReceives()));
            return businessCardsReceives.stream().map(BusinessCardReceivesDTO::getEmployeeId)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();

    }

    /**
     * get data businesscard from response
     * 
     * @param getBusinessCardsResponse
     * @param businessCardIdMap
     * @return businessCardDatas
     */
    private List<InitializeNetworkMapSubType13DTO> getBusinessCardDatas(
            GetBusinessCardsByIdsResponse getBusinessCardsResponse, Map<Long, Long> businessCardIdMap) {
        List<GetBusinessCardsByIdsDTO> businessCardsResList = getBusinessCardsResponse.getBusinessCards();
        List<InitializeNetworkMapSubType13DTO> businessCards = new ArrayList<>();
        businessCardsResList.forEach(items -> {
            InitializeNetworkMapSubType13DTO businessCard = initializeNetworkMapMapper.toBusinessCardDatas(items);
            businessCard.setDepartmentId(businessCardIdMap.get(items.getBusinessCardId()));
            businessCard.setLastContactDate(
                    items.getLastContactDate() != null ? items.getLastContactDate().getDate() : null);
            businessCard.setIsWorking(items.getIsWorking() != null ? items.getIsWorking().getValue() : null);
            List<BusinessCardReceivesDTO> businessCardReceives = items.getBusinessCardsReceives();
            List<BusinessCardReceivesType1DTO> businessCardReceivesType1 = new ArrayList<>();
            for (BusinessCardReceivesDTO businessCardReceive : businessCardReceives) {
                BusinessCardReceivesType1DTO business = initializeNetworkMapMapper
                        .toBusinessCardReceivesType1DTO(businessCardReceive);
                businessCardReceivesType1.add(business);
            }
            businessCard.setBusinessCardReceives(businessCardReceivesType1);
            businessCards.add(businessCard);
        });
        return businessCards.stream().distinct().collect(Collectors.toList());
    }

    /**
     * Validate parameters api initializeNetworkMap
     * 
     * @param customerId
     *            the id of customer
     */
    private void initializeNetworkMapValidateParameter(Long customerId) {
        // 1.1 validate internal
        if (customerId == null) {
            throw new CustomRestException("Param[customerId] is null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }

        // 1.2 Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_ID, customerId);
        String validateJson = jsonBuilder.build(Constants.FieldBelong.CUSTOMER.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#saveNetworkMap(java.util.List)
     */
    @Override
    @Transactional
    public List<Long> saveNetworkMap(SaveNetworkMapRequest input) {
        // 1. Validate parameter
        if (input.getCustomerId() == null) {
            throw new CustomRestException("Param[customerId] is null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_ID, Constants.RIQUIRED_CODE));
        }

        // 2. CAll API saveNetworkMap
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        SaveNetWorkMapRequest request = initializeNetworkMapMapper.toSaveNetWorkMapReq(input);
        SaveNetWorkMapResponse saveNetworkResponse = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                ConstantsCustomers.API_SAVE_NET_WORK_MAP, HttpMethod.POST, request, SaveNetWorkMapResponse.class, token,
                tenantName);

        // 3.1 Delete old networks_stands
        List<SaveNetWorkMapSubType4DTO> businessCardList = Optional.ofNullable(saveNetworkResponse.getBusinessCards())
                .map(Collection::stream).orElse(Stream.empty()).collect(Collectors.toList());
        List<Long> companyIds = businessCardList.stream().map(SaveNetWorkMapSubType4DTO::getCompanyId)
                .collect(Collectors.toList());

        if (!CollectionUtils.isEmpty(companyIds)) {
            networksStandsRepository.deleteByBusinessCardCompanyId(companyIds);
        }
        List<Long> response = new ArrayList<>();
        // 3.2 make data networkStand
        Map<Long, NetworksStands> networkMap = new HashMap<>();
        businessCardList.forEach(businessCard -> {
            Long businessCardId = businessCard.getBusinessCardId();
            if (networkMap.containsKey(businessCardId)) {
                return;
            }
            NetworksStands entity = new NetworksStands();
            entity.setBusinessCardCompanyId(businessCard.getCompanyId());
            entity.setBusinessCardDepartmentId(businessCard.getDepartmentId());
            entity.setBusinessCardId(businessCardId);
            entity.setStandId(businessCard.getMasterStandId());
            entity.setMotivationId(businessCard.getMotivationId());
            entity.setProductTradingId(businessCard.getTradingProductId());
            entity.setComment(businessCard.getComment());
            entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            networkMap.put(businessCardId, entity);
        });
        List<NetworksStands> idCreatedList = networksStandsRepository
                .saveAll(networkMap.values().stream().collect(Collectors.toList()));
        if (!CollectionUtils.isEmpty(idCreatedList)) {
            response.addAll(idCreatedList.stream().map(NetworksStands::getNetworkStandId).collect(Collectors.toList()));
        }

        return response;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.NetworksStandsService#getProductTradingIds(java.util.List)
     * @param networkStandIs -networkStandIs
     * @return the entity response
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetProductTradingIdsOutDTO getProductTradingIds(List<Long> businessCardIds) {
        // 1. get list product trading id
        GetProductTradingIdsOutDTO response = null;
        if (businessCardIds.isEmpty()) {
            throw new CustomRestException("Param[business_card_id] is null",
                    CommonUtils.putError(BUSINESS_CARD_IDS, Constants.RIQUIRED_CODE));
        }
        List<Long> productTradingIds = networksStandsRepository.getProductTradingIdsByBusinessCardIds(businessCardIds);
        // 2. create response
        response = new GetProductTradingIdsOutDTO();
        response.setProductTradingIds(productTradingIds);
        return response;
    }
}
