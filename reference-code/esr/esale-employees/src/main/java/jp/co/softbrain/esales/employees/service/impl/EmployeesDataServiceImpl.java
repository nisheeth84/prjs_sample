package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jp.co.softbrain.esales.employees.service.dto.timelines.GetFollowedForm;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetFollowedsOutDTO;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesPackages;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.AuthenticationService;
import jp.co.softbrain.esales.employees.service.EmployeesDataService;
import jp.co.softbrain.esales.employees.service.EmployeesHistoriesService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDataDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDataType;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeIconDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeLayoutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSubordinatesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSummaryDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeDataTabDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeHistoryOutDTO;
import jp.co.softbrain.esales.employees.service.dto.businesscards.GetBusinessCardsTabRequest;
import jp.co.softbrain.esales.employees.service.dto.businesscards.GetBusinessCardsTabResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetTabsInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.TabsInfoSubTypeDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.dto.customers.GetCustomersOutDTO;
import jp.co.softbrain.esales.employees.service.dto.customers.GetCustomersRequest;
import jp.co.softbrain.esales.employees.service.dto.sales.GetProductTradingTabOutDTO;
import jp.co.softbrain.esales.employees.service.dto.sales.GetProductTradingTabRequest;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetTaskTabOutDTO;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetTasksTabRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetPackagesDataDTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetPackagesNameRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetPackagesNameResponse;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesMapper;
import jp.co.softbrain.esales.employees.service.mapper.KeyValueTypeMapper;
import jp.co.softbrain.esales.employees.service.mapper.SearchConditionsItemsMapper;
import jp.co.softbrain.esales.employees.tenant.util.EmployeesCommonUtil;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.util.ChannelUtils;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service Implementation from
 * {@link jp.co.softbrain.esales.employees.service.EmployeesDataService}
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesDataServiceImpl implements EmployeesDataService {
    private final Logger log = LoggerFactory.getLogger(EmployeesDataServiceImpl.class);

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    EmployeesHistoriesService employeesHistoriesService;

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private EmployeesMapper employeesMapper;

    @Autowired
    private KeyValueTypeMapper keyValueTypeMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SearchConditionsItemsMapper searchConditionsItemsMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private ChannelUtils channelUtils;

    @Autowired
    private AuthenticationService authenticationService;

    private final TypeReference<Map<String, Object>> typeRefMap = new TypeReference<>() {};

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployee(java.lang.Long,
     *      java.lang.String)
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    @Override
    public EmployeeResponseDTO getEmployee(Long employeeId, String mode) {
        // validate parameter
        validateGetEmployeeParameter(employeeId, mode);

        // create response
        EmployeeResponseDTO responseAPI = new EmployeeResponseDTO();

        // get data for node data.fields
        List<EmployeeLayoutDTO> employeeLayouts = employeesService.getEmployeeLayout();
        responseAPI.setFields(employeeLayouts);

        // get data for node data.data
        responseAPI.setData(buildEmployeeDatailInfo(employeeId));

        // get data for tab info
        responseAPI.setTabsInfo(buildTabsInfoToResponse());
        if (CollectionUtils.isEmpty(responseAPI.getTabsInfo())) {
            return responseAPI;
        }
        // get data tab
        List<GetEmployeeDataTabDTO> dataTabs = processingDataForTab(employeeId, responseAPI.getTabsInfo());
        responseAPI.setDataTabs(dataTabs);

        // get data watch
        responseAPI.setDataWatchs(getDataWatchForEmployee(employeeId));
        return responseAPI;
    }

    /**
     * getDataWatchForEmployee
     * @param employeeId id employee
     * @return - data watch
     */
    private GetFollowedsOutDTO getDataWatchForEmployee(Long employeeId) {
        // create request to call API
        GetFollowedForm getFollowRequest = new GetFollowedForm();
        getFollowRequest.setFollowTargetId(employeeId);
        getFollowRequest.setFollowTargetType(ConstantsEmployees.FOLLOW_TARGET_TYPE_EMPLOYEE);
        // get response
       return channelUtils.callAPIGetFollowed(getFollowRequest);
    }

    /**
     * @param employeeId
     * @param tabsInfo
     * @return
     */
    private List<GetEmployeeDataTabDTO> processingDataForTab(Long employeeId, List<TabsInfoSubTypeDTO> tabsInfo) {
        List<GetEmployeeDataTabDTO> tabDataList = new ArrayList<>();

        tabsInfo.forEach(tabInfo -> {
            GetEmployeeDataTabDTO tabData = new GetEmployeeDataTabDTO();
            tabData.setTabId(tabInfo.getTabId());

            if (Boolean.TRUE.equals(tabInfo.getIsDisplaySummary())) {
                switch (tabInfo.getTabId()) {
                case ConstantsEmployees.TAB_SALES:
                    // get product trading tab
                    tabData.setData(getTabDataByGetProductTradingsTab(tabInfo, employeeId));
                    break;
                case ConstantsEmployees.TAB_CHANGE_HISTORY:
                    // get change history
                    tabData.setData(getTabDataChangeHistory(tabInfo, employeeId));
                    break;
                case ConstantsEmployees.TAB_BUSINESS_CARDS:
                    // get activities
                    tabData.setData(getTabDataByGetBusinessCardsTab(tabInfo, employeeId));
                    break;
                case ConstantsEmployees.TAB_CUSTOMERS:
                    // get activities
                    tabData.setData(getTabDataByGetCustomers(tabInfo, employeeId));
                    break;
                case ConstantsEmployees.TAB_TASKS:
                    // call api get tasks
                    tabData.setData(getTabDataByGetTasksTab(tabInfo, employeeId));
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
     * getTabDataByGetProductTradingsTab
     *
     * @param tabInfo
     * @param employeeId
     * @return
     */
    private GetProductTradingTabOutDTO getTabDataByGetProductTradingsTab(TabsInfoSubTypeDTO tabInfo, Long employeeId) {
        // create limit
        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsEmployees.DEFAULT_LIMIT_FOR_TAB;
        // create request
        GetProductTradingTabRequest productTradingRequest = new GetProductTradingTabRequest();
        // set data for request
        productTradingRequest.setEmployeeId(employeeId);
        productTradingRequest.setCustomerIds(new ArrayList<>());
        productTradingRequest.setLoginFlag(Boolean.FALSE);
        productTradingRequest.setFilterConditions(
                searchConditionsItemsMapper.summaryFilterValueToSearchItem(tabInfo.getSummaryFilterValue()));
        productTradingRequest.setOrderBy(keyValueTypeMapper.summaryOrderByToOrderValue(tabInfo.getSummaryOrderBy()));
        productTradingRequest.setLimit(limit);
        productTradingRequest.setOffset(ConstantsEmployees.NUMBER_ZERO);

        // get response
        return channelUtils.callAPIGetProductTradingTab(productTradingRequest);
    }

    /**
     * getTabDataChangeHistory
     *
     * @param tabInfo
     * @param employeeId
     * @return
     */
    private GetEmployeeHistoryOutDTO getTabDataChangeHistory(TabsInfoSubTypeDTO tabInfo, Long employeeId) {
        // set limit
        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsEmployees.DEFAULT_LIMIT_FOR_TAB;
        return employeesHistoriesService.getEmployeeHistory(employeeId, ConstantsEmployees.NUMBER_ZERO, limit);
    }

    /**
     * getTabDataByGetBusinessCardsTab
     *
     * @param tabInfo
     * @param employeeId
     * @return
     */
    private GetBusinessCardsTabResponse getTabDataByGetBusinessCardsTab(TabsInfoSubTypeDTO tabInfo, Long employeeId) {
        // set limit
        Long limit = tabInfo.getMaxRecord() != null ? Long.valueOf(tabInfo.getMaxRecord())
                : Long.valueOf(ConstantsEmployees.DEFAULT_LIMIT_FOR_TAB);
        // create request
        GetBusinessCardsTabRequest businessCardTabReq = new GetBusinessCardsTabRequest();
        businessCardTabReq.setEmployeeId(employeeId);
        businessCardTabReq.setFilterConditions(
                searchConditionsItemsMapper.summaryFilterValueToSearchItem(tabInfo.getSummaryFilterValue()));
        businessCardTabReq.setOrderBy(keyValueTypeMapper.summaryOrderByToOrderValue(tabInfo.getSummaryOrderBy()));
        businessCardTabReq.setLimit(limit);
        businessCardTabReq.setOffset(ConstantsEmployees.LONG_VALUE_0L);

        // get response
        return channelUtils.callAPIGetBusinessCardsTab(businessCardTabReq);
    }

    /**
     * getTabDataByGetCustomersTab
     *
     * @param tabInfo
     * @param employeeId
     * @return
     */
    private GetCustomersOutDTO getTabDataByGetCustomers(TabsInfoSubTypeDTO tabInfo, Long employeeId) {
        // set limit
        Integer limit = tabInfo.getMaxRecord() != null ? tabInfo.getMaxRecord()
                : ConstantsEmployees.DEFAULT_LIMIT_FOR_TAB;
        // create request
        GetCustomersRequest getCustomersRequest = new GetCustomersRequest();
        getCustomersRequest.setFilterConditions(
                searchConditionsItemsMapper.summaryFilterValueToSearchItem(tabInfo.getSummaryFilterValue()));
        getCustomersRequest.setIsUpdateListView(false);
        getCustomersRequest.setLimit(limit);
        getCustomersRequest.setLocalSearchKeyword(ConstantsEmployees.EMPTY);
        getCustomersRequest.setOffset(ConstantsEmployees.NUMBER_ZERO);
        getCustomersRequest.setOrderBy(keyValueTypeMapper.summaryOrderByToOrderValue(tabInfo.getSummaryOrderBy()));
        getCustomersRequest.setSearchConditions(new ArrayList<>());
        getCustomersRequest.setSelectedTargetId(employeeId);
        getCustomersRequest.setSelectedTargetType(1);

        return channelUtils.callAPIGetCustomers(getCustomersRequest);
    }

    /**
     * getTabDataByGetTasksTab
     *
     * @param tabInfo
     * @param employeeId
     * @return
     */
    private GetTaskTabOutDTO getTabDataByGetTasksTab(TabsInfoSubTypeDTO tabInfo, Long employeeId) {
        // set limit
        Long limit = tabInfo.getMaxRecord() != null ? Long.valueOf(tabInfo.getMaxRecord())
                : Long.valueOf(ConstantsEmployees.DEFAULT_LIMIT_FOR_TAB);

        GetTasksTabRequest getTasksTabReq = new GetTasksTabRequest();
        // set data for request
        getTasksTabReq.setEmployeeIds(Arrays.asList(employeeId));
        getTasksTabReq.setFilterByUserLoginFlg(0);
        getTasksTabReq.setCustomerIds(new ArrayList<>());
        getTasksTabReq.setFilterConditions(
                searchConditionsItemsMapper.summaryFilterValueToSearchItem(tabInfo.getSummaryFilterValue()));
        getTasksTabReq.setOrderBy(keyValueTypeMapper.summaryOrderByToOrderValue(tabInfo.getSummaryOrderBy()));

        getTasksTabReq.setOffset(ConstantsEmployees.LONG_VALUE_0L);
        getTasksTabReq.setLimit(limit);

        getTasksTabReq.setIsInProgress(true);

        return channelUtils.callAPIGetTasksTab(getTasksTabReq);
    }

    /**
     * get detail information of employee
     *
     * @param employeeId - id of employee
     * @param employeeLayouts - list layout fields
     * @return object has been filled data
     */
    private EmployeeDataDTO buildEmployeeDatailInfo(Long employeeId) {
        // get session info
        String langCode = jwtTokenUtil.getLanguageCodeFromToken();

        Employees employeeEntity = employeesRepository.findByEmployeeId(employeeId);
        if (employeeEntity == null) {
            return new EmployeeDataDTO();
        }
        EmployeeDataDTO employeeDetailOut = employeesMapper.toEmployeeData(employeeEntity);

        // build Employee icon
        employeeDetailOut.setEmployeeIcon(
                buildEmployeeIcon(employeeEntity.getPhotoFileName(), employeeEntity.getPhotoFilePath()));

        // build dynamic data field for employee
        employeeDetailOut.setEmployeeData(buildDynamicDataList(employeeEntity.getEmployeeData()));

        // get data for department of employee
        List<EmployeeDepartmentsDTO> empDepartments = departmentsRepositoryCustom
                .getEmployeeDepartmentPosition(employeeId);
        empDepartments.forEach(dep -> dep
                .setPositionName(StringUtil.getFieldLabel(dep.getPositionName(), langCode, objectMapper, typeRefMap)));
        employeeDetailOut.getEmployeeDepartments().addAll(empDepartments);

        // get data for manager of employee
        employeeDetailOut.setEmployeeManagers(buildManagerListForEmployee(employeeId));

        // get data for surbodinate of employee
        employeeDetailOut.getEmployeeSubordinates().addAll(buildSurbodinateForEmployee(employeeId));

        // get data for packages of employee
        employeeDetailOut.getEmployeePackages().addAll(buildPackagesForEmployee(employeeId));

        // get value of is access contact size

        employeeDetailOut.setIsAccessContractSite(
                getValueOfAccessContactSizeForEmployee(employeeDetailOut.getEmail()));

        return employeeDetailOut;
    }

    /**
     * getValueOfAccessContactSizeForEmployee
     *
     * @param employeeId
     * @param email
     * @return value
     */
    private Boolean getValueOfAccessContactSizeForEmployee(String email) {
        CognitoSettingInfoDTO cognitoSetting = authenticationService.getCognitoSetting();
        if (cognitoSetting == null) {
            cognitoSetting = new CognitoSettingInfoDTO();
        }
        try {
            String userPoolId = cognitoSetting.getUserPoolId();
            CognitoUserInfo userInfo = authenticationService.findUserByUserName(email, userPoolId);
            if (userInfo != null) {
                return Boolean.TRUE.equals(userInfo.getIsAccessContract());
            }
        } catch (Exception e) {
            log.error("Cannot find user, cause by: ", e);
        }

        return false;
    }

    /**
     * buildPackagesForEmployee
     *
     * @param employeeId - id of employee
     * @return - list package for employee
     */
    private List<EmployeesPackagesSubtypeDTO> buildPackagesForEmployee(Long employeeId) {
        List<EmployeesPackages> listPackages = employeesPackagesRepository.findByEmployeeId(employeeId);
        if (listPackages.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> packageIds = listPackages.stream().map(EmployeesPackages::getPackageId).sorted()
                .collect(Collectors.toList());
        List<GetPackagesDataDTO> listPackagesResponse = getPackageNamesByPackageIds(packageIds);
        return listPackagesResponse.stream().map(packResponse -> {
            EmployeesPackagesSubtypeDTO empPack = new EmployeesPackagesSubtypeDTO();
            empPack.setPackagesId(packResponse.getPackageId());
            empPack.setPackagesName(packResponse.getPackageName());
            return empPack;
        }).collect(Collectors.toList());

    }

    /**
     * Get list packageName by call API getPackageNames
     *
     * @param packageIds - list id package
     * @return list responses
     */
    private List<GetPackagesDataDTO> getPackageNamesByPackageIds(List<Long> packageIds) {
        // call API getPackageNames
        GetPackagesNameRequest packageNameRequest = new GetPackagesNameRequest();
        packageNameRequest.setPackageIds(packageIds);

        GetPackagesNameResponse packageNameResponse = channelUtils.callAPIGetPackageNames(packageNameRequest);
        if (packageNameResponse == null || CollectionUtils.isEmpty(packageNameResponse.getPackages())) {
            return new ArrayList<>();
        }
        return packageNameResponse.getPackages();
    }

    /**
     * buildSurbodinateForEmployee
     *
     * @param employeeId - id of employee
     * @return - list staff of employee
     */
    private List<EmployeeSubordinatesDTO> buildSurbodinateForEmployee(Long employeeId) {
        List<Employees> childsList = employeesRepository.getEmployeesByManagerId(employeeId);
        if (childsList.isEmpty()) {
            return new ArrayList<>();
        }
        List<EmployeeSubordinatesDTO> listStaff = new ArrayList<>();

        List<Long> listIDStaff = childsList.stream().map(Employees::getEmployeeId).collect(Collectors.toList());
        // get language key
        String langCode = jwtTokenUtil.getLanguageCodeFromToken();

        // get all department of Staff
        List<DepartmentPositionDTO> listAllDepartmentOfStaff = employeesRepositoryCustom
                .findDepartmentByEmployeeId(listIDStaff, employeeId);

        // build map of staff and department
        Map<Long, List<DepartmentPositionDTO>> mapStaffIdAndListDepartment = new HashMap<>();
        for (DepartmentPositionDTO depOfStaff : listAllDepartmentOfStaff) {
            depOfStaff.setPositionName(
                    StringUtil.getFieldLabel(depOfStaff.getPositionName(), langCode, objectMapper, typeRefMap));
            if (mapStaffIdAndListDepartment.get(depOfStaff.getEmployeeId()) == null) {
                List<DepartmentPositionDTO> listDepOfStaff = new ArrayList<>();
                listDepOfStaff.add(depOfStaff);
                mapStaffIdAndListDepartment.put(depOfStaff.getEmployeeId(), listDepOfStaff);
                continue;
            }
            mapStaffIdAndListDepartment.get(depOfStaff.getEmployeeId()).add(depOfStaff);
        }

        // build data for staff
        for (Employees surbodinate : childsList) {
            EmployeeSubordinatesDTO staff = new EmployeeSubordinatesDTO();
            staff.setEmployeeId(surbodinate.getEmployeeId());

            if (!StringUtils.isBlank(surbodinate.getPhotoFilePath())) {
                FileInfosDTO employeeIcon = new FileInfosDTO();
                employeeIcon.setFileName(surbodinate.getPhotoFileName());
                employeeIcon.setFilePath(surbodinate.getPhotoFilePath());
                employeeIcon
                        .setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                                surbodinate.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
                staff.setEmployeeIcon(employeeIcon);
            }
            staff.setEmployeeName(
                    StringUtil.getFullName(surbodinate.getEmployeeSurname(), surbodinate.getEmployeeName()));

            // get department Name and position name
            List<DepartmentPositionDTO> depPos = mapStaffIdAndListDepartment.get(staff.getEmployeeId());
            if (!CollectionUtils.isEmpty(depPos)) {
                staff.setDepartmentName(depPos.get(0).getDepartmentName());
                staff.setPositionName(depPos.get(0).getPositionName() == null ? "" : depPos.get(0).getPositionName());
            }
            listStaff.add(staff);
        }
        return listStaff;
    }

    /**
     * buildManagerListForEmployee
     *
     * @param employeeId
     * @return
     */
    private List<EmployeeSummaryDTO> buildManagerListForEmployee(Long employeeId) {
        List<EmployeeSummaryDTO> listManagers = employeesRepositoryCustom.getEmployeesManagers(employeeId);
        listManagers.forEach(manarger -> {
            manarger.setEmployeeName(
                    StringUtils.isNotBlank(manarger.getEmployeeName()) ? manarger.getEmployeeName().trim() : null);
            if (!StringUtils.isBlank(manarger.getEmployeeIconPath())) {
                FileInfosDTO fileInfo = new FileInfosDTO();
                fileInfo.setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        manarger.getEmployeeIconPath(), applicationProperties.getExpiredSeconds()));
                manarger.setEmployeeIcon(fileInfo);
            }
        });
        return listManagers;
    }

    /**
     * buildDynamicDataList
     *
     * @param employeeData - string dynamic data
     * @return - list dynamic data
     */
    private List<EmployeeDataType> buildDynamicDataList(String employeeDataString) {
        // get custom field info
        GetCustomFieldsInfoRequest fieldInfoRequest = new GetCustomFieldsInfoRequest();
        fieldInfoRequest.setFieldBelong(Constants.FieldBelong.EMPLOYEE.getValue());
        CommonFieldInfoResponse commonFieldInfoResponse = channelUtils.callAPIGetCustomFieldInfo(fieldInfoRequest);
        List<CustomFieldsInfoOutDTO> listFieldInfo = commonFieldInfoResponse.getCustomFieldsInfo();

        // get list Dynamic data
        return EmployeesCommonUtil.buildEmployeeDataFromStringJson(listFieldInfo, employeeDataString,
                applicationProperties);
    }

    /**
     * build employee icon
     *
     * @param photoFileName - photo file name of employee
     * @param photoFilePath - photo file path of employee
     * @return object represent icon of employee
     */
    private EmployeeIconDTO buildEmployeeIcon(String photoFileName, String photoFilePath) {
        if (StringUtils.isBlank(photoFilePath)) {
            return null;
        }

        EmployeeIconDTO employeeIcon = new EmployeeIconDTO();
        employeeIcon.setFileName(photoFileName);
        employeeIcon.setFilePath(photoFilePath);
        employeeIcon.setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                photoFilePath, applicationProperties.getExpiredSeconds()));
        return employeeIcon;
    }

    /**
     * buildTabsInfo to response API getEmployee
     *
     * @return list TabInfo
     */
    private List<TabsInfoSubTypeDTO> buildTabsInfoToResponse() {
        GetTabsInfoResponse tabInfoResponse = channelUtils.callAPIGetTabsInfo();
        if (tabInfoResponse == null || CollectionUtils.isEmpty(tabInfoResponse.getTabsInfo())) {
            return new ArrayList<>();
        }
        return tabInfoResponse.getTabsInfo();
    }

    /**
     * Validate input for getEmployee API
     *
     * @param employeeId
     * @param mode
     */
    private void validateGetEmployeeParameter(Long employeeId, String mode) {
        log.info("Get employee info by mode: {}", mode);
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            ValidateRequest validateRequest = new ValidateRequest(validateJson);
            ValidateResponse validateResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class,
                    token, jwtTokenUtil.getTenantIdFromToken());
            if (Constants.RESPONSE_FAILED == validateResponse.getStatus()) {
                throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, validateResponse.getErrors());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

}
