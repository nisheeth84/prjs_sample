package jp.co.softbrain.esales.customers.service.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
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
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jodd.util.StringUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ApplicationProperties;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.repository.CustomersListFavouritesRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListMembersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListRepositoryCustom;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepositoryCustom;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.IndexElasticsearchService;
import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.customers.service.dto.CreateDataChangeElasticSearchInDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.DepartmentsOfTaskDTO;
import jp.co.softbrain.esales.customers.service.dto.EmployeesOfTaskDTO;
import jp.co.softbrain.esales.customers.service.dto.GetDataSyncElasticSearchSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.GetParentCustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeMilestonesDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeTasksDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutTaskOperatorsDTO;
import jp.co.softbrain.esales.customers.service.dto.GroupsOfTaskDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.GetDetailElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.DataSyncElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetSelectedOrganizationInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetMilestonesByCustomerRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetMilestonesByCustomerResponse;
import jp.co.softbrain.esales.customers.service.mapper.CommonsInfoMapper;
import jp.co.softbrain.esales.customers.service.mapper.CustomersMapper;
import jp.co.softbrain.esales.customers.service.mapper.GetScenarioMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerAddressDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerInfoDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerLabelDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerParentsDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerPhotoDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.DateFormatDTO;
import jp.co.softbrain.esales.elasticsearch.dto.customers.PersonInChargeDTO;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.dto.DynamicDataDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsRequest;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType1DTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType2DTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoOutDTO;

/**
 * Customers Common Service Implement
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersCommonServiceImpl implements CustomersCommonService {
    private final Logger log = LoggerFactory.getLogger(CustomersCommonServiceImpl.class);

    private static final String COPY_FILE_ERROR = "Copy file error";
    public static final String GET_FIELD_INFO_ITEM_API_METHOD = "getFieldInfoItemByFieldBelong";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";

    @Autowired
    private CustomersListFavouritesRepository customersListFavouritesRepository;

    @Autowired
    private CustomersListRepositoryCustom customersListRepositoryCustom;

    @Autowired
    private CustomersListMembersRepository customersListMembersRepository;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersMapper customersMapper;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private CustomersRepositoryCustom customersRepositoryCustom;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private IndexElasticsearchService indexElasticsearchService;

    @Autowired
    private GetScenarioMapper getScenarioMapper;

    @Autowired
    private CommonsInfoMapper commonsInfoMapper;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getMyList(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListOptionalsDTO> getMyList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode) {
        return customersListRepositoryCustom.getMyList(employeeId, depOfEmployee, groupOfEmployee, mode);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getSharedList(java.lang.Long,
     *      boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListOptionalsDTO> getSharedList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode) {
        return customersListRepositoryCustom.getSharedList(employeeId, depOfEmployee, groupOfEmployee, mode);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getFavouriteList(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListOptionalsDTO> getFavouriteList(Long employeeId, List<Long> departmentIds,
            List<Long> groupIds) {
        return customersListRepositoryCustom.getCustomerListFavoriteByEmployeeId(employeeId, departmentIds, groupIds);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getChildCustomers(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersDTO> getChildCustomers(Long customerId) {
        return customersMapper.toDto(customersRepository.findByParentId(customerId));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#removeFavouriteList(java.lang.Long,
     *      java.lang.Long)
     */
    @Override
    @Transactional
    public void removeFavouriteList(Long employeeId, Long customerListId) {
        customersListFavouritesRepository.deleteByCustomerListIdAndEmployeeId(customerListId, employeeId);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#removeFavouriteList(
     *      java.lang.Long)
     */
    @Override
    @Transactional
    public void deleteAllFavoriteListByCustomerListId(Long customerListId) {
        customersListFavouritesRepository.deleteByCustomerListId(customerListId);
    }

    /**
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#
     * copyFileToS3(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public String copyFileToS3(String fileName, String fileExtension, String content) {
        String bucketName = applicationProperties.getUploadBucket();
        String toDay = DateUtil.convertDateToString(new Date(), DateUtil.FORMAT_YYYYMMDD_HHMMSS).replace(" ", "_");
        String keyName = String.format("%s/%s/%s_%s.%s", jwtTokenUtil.getTenantIdFromToken(),
                FieldBelong.CUSTOMER.name().toLowerCase(), fileName, toDay,
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
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getCustomers(java.util.List,
     *      java.util.List)
     */
    @Override
    public List<CustomersDTO> getCustomers(List<Long> customerIds, List<KeyValue> orderBy) {
        return customersMapper.toDto(customersRepositoryCustom.findByCustomerIdsAndSort(customerIds, orderBy));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getColumnsName(java.lang.String)
     */
    @Override
    public List<String> getTableColumnName(String tableName) {
        return customersRepositoryCustom.getTableColumnName(tableName);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#syncDataElasticSearch(java.util.List,
     *      java.util.List, java.lang.Integer)
     */
    @Override
    @Transactional
    public Boolean syncDataElasticSearch(List<Long> customerListIds, List<Long> customerIds, int action) {

        if (action == Constants.ChangeAction.DELETE.getValue()) {
            if (CollectionUtils.isEmpty(customerIds)) {
                return false;
            }
            indexElasticsearchService.deleteIndexElasticsearch(
                    customerIds.stream().filter(Objects::nonNull).distinct().collect(Collectors.toList()));
            return true;
        }

        List<Long> dataIds = new ArrayList<>();

        if (!CollectionUtils.isEmpty(customerIds)) {
            dataIds.addAll(customerIds);
        }

        if (!CollectionUtils.isEmpty(customerListIds)) {
            // 1.4. delete customer list and 1.5. update customer list
            List<Long> listMember = customersListMembersRepository.getCustomerIdOfListMember(customerListIds);
            if (listMember != null && !listMember.isEmpty()) {
                dataIds.addAll(listMember);
            }
        }
        dataIds.removeIf(Objects::isNull);
        List<Long> dataIdsWithoutDuplicateElements = dataIds.stream().distinct().collect(Collectors.toList());

        if (dataIdsWithoutDuplicateElements.isEmpty()) {
            return false;
            // index Elasticsearch
        }
        indexElasticsearchService.putIndexElasticsearch(dataIdsWithoutDuplicateElements);
        return true;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getDataSyncElasticSearch(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomerInfoDTO> getDataSyncElasticSearch(List<Long> customerIds) {
        // 1. Get information of customer
        List<GetDataSyncElasticSearchSubType1DTO> listCustomersInput = customersRepository
                .getCustomersInListId(customerIds);
        List<CustomerInfoDTO> customers = new ArrayList<>();
        if (listCustomersInput == null || listCustomersInput.isEmpty()) {
            return customers;
        }
        long customerId = 0;
        Map<Long, List<CustomerLabelDTO>> mapCustomerList = new HashMap<>();
        List<CustomerLabelDTO> listCustomerList = new ArrayList<>();
        for (GetDataSyncElasticSearchSubType1DTO customerInput : listCustomersInput) {
            if (customerId != customerInput.getCustomerId()) {
                customerId = customerInput.getCustomerId();
                CustomerInfoDTO customer = new CustomerInfoDTO();
                customer.setCustomerId(customerInput.getCustomerId());
                customer.setCustomerLogo(new CustomerPhotoDTO(customerInput.getPhotoFileName(), customerInput.getPhotoFilePath()));
                customer.setCustomerName(customerInput.getCustomerName());
                customer.setCustomerAliasName(customerInput.getCustomerAliasName());
                customer.setCustomerParent(new CustomerParentsDTO(customerInput.getParentCustomerId(),
                        customerInput.getParentCustomerName()));
                customer.setPhoneNumber(customerInput.getPhoneNumber());
                customer.setCustomerAddress(new CustomerAddressDTO(customerInput.getZipCode(),
                        customerInput.getAddress(), customerInput.getBuilding(),
                        customerInput.getZipCode() + ConstantsCustomers.SPACE_SYMBOY + customerInput.getAddress()
                                + ConstantsCustomers.SPACE_SYMBOY + customerInput.getBuilding()));
                customer.setUrl(customerInput.getUrl());
                customer.setMemo(customerInput.getMemo());
                customer.setPersonInCharge(new PersonInChargeDTO(customerInput.getEmployeeId(),
                        customerInput.getGroupId(), customerInput.getDepartmentId()));

                // build format created date
                DateFormatDTO createdDate = new DateFormatDTO();
                createdDate.setDateTime(customerInput.getCreatedDate());
                createdDate.setMdFormat(
                        DateUtil.convertInstantToString(customerInput.getCreatedDate(), DateUtil.FORMAT_MMDD));
                createdDate.setHmFormat(
                        DateUtil.convertInstantToString(customerInput.getCreatedDate(), DateUtil.FORMAT_HHMM));
                customer.setCreatedDate(createdDate);

                // build format updated date
                DateFormatDTO updatedDate = new DateFormatDTO();
                updatedDate.setDateTime(customerInput.getCreatedDate());
                updatedDate.setMdFormat(
                        DateUtil.convertInstantToString(customerInput.getUpdatedDate(), DateUtil.FORMAT_MMDD));
                updatedDate.setHmFormat(
                        DateUtil.convertInstantToString(customerInput.getUpdatedDate(), DateUtil.FORMAT_HHMM));
                customer.setUpdatedDate(updatedDate);

                customer.setCreatedUser(customerInput.getCreatedUser());
                customer.setUpdatedUser(customerInput.getUpdatedUser());
                // 2. get information of createdUser and updateUser
                List<Long> employeeIds = new ArrayList<>();
                employeeIds.add(customerInput.getCreatedUser());
                employeeIds.add(customerInput.getUpdatedUser());
                // Call API Get Employee by ids
                String token = SecurityUtils.getTokenValue().orElse(null);
                String tenantName = jwtTokenUtil.getTenantIdFromToken();
                DataSyncElasticSearchRequest dataRequest = new DataSyncElasticSearchRequest();
                dataRequest.setEmployeeIds(employeeIds);
                GetEmployeesByIdsResponse employeesResponse = restOperationUtils.executeCallApi(
                        Constants.PathEnum.EMPLOYEES, ConstantsCustomers.API_GET_EMPLOYEES_BY_IDS,
                        HttpMethod.POST,
                        dataRequest, GetEmployeesByIdsResponse.class, token, tenantName);
                List<EmployeeInfoDTO> employeesInfoList = employeesResponse.getEmployees();
                for (EmployeeInfoDTO employeesInfo : employeesInfoList) {
                    if (employeesInfo.getEmployeeId().equals(customerInput.getCreatedUser())) {
                        customer.setCreatedUserName(employeesInfo.getEmployeeName());
                    }
                    if (employeesInfo.getEmployeeId().equals(customerInput.getUpdatedUser())) {
                        customer.setUpdatedUserName(employeesInfo.getEmployeeName());
                    }
                }

                // build customer data
                buildCustomerData(customerInput, customer);

                customers.add(customer);
                listCustomerList = new ArrayList<>();
                mapCustomerList.put(customerId, listCustomerList);
            }
            if (customerInput.getCustomerListId() != null) {
                CustomerLabelDTO customerList = new CustomerLabelDTO();
                customerList.setValue(customerInput.getCustomerListId());
                listCustomerList.add(customerList);
            }
        }

        for (Entry<Long, List<CustomerLabelDTO>> entry : mapCustomerList.entrySet()) {
            customers.forEach(customer -> {
                if (entry.getKey().equals(customer.getCustomerId())) {
                    customer.setCustomerList(entry.getValue());
                }
            });
        }

        return customers;
    }

    /**
     * get data for customer data
     * 
     * @param customerInput - DTO input
     * @param customer - DTO output
     */
    private void buildCustomerData(GetDataSyncElasticSearchSubType1DTO customerInput, CustomerInfoDTO customer) {
        // get data fieldInfo
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoRequest getCustomFieldsInfoRequest = new GetCustomFieldsInfoRequest();
        getCustomFieldsInfoRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse;
        List<CustomFieldsInfoOutDTO> fieldsList = null;
        try {
            fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "get-custom-fields-info",
                    HttpMethod.POST, getCustomFieldsInfoRequest, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null) {
                fieldsList = fieldInfoResponse.getCustomFieldsInfo();
            }
        } catch (RestClientException e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_FIELD_INFO_ITEM_API_METHOD, e.getMessage());
            log.error(msg);
        }
        final List<CustomFieldsInfoOutDTO> finalFieldsList = fieldsList;

        // get data for taskData
        if (StringUtils.isNotBlank(customerInput.getCustomerData())) {
            try {
                List<DynamicDataDTO> customerDataList = CustomersCommonUtil.convertCustomerDataFromString(objectMapper,
                        customerInput.getCustomerData(), null, finalFieldsList);
                customer.setCustomerData(customerDataList);
            } catch (Exception e) {
                log.warn(e.getLocalizedMessage());
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#createDataChangeElasticSearch(java.util.List)
     */
    @Override
    public Boolean createDataChangeElasticSearch(List<CreateDataChangeElasticSearchInDTO> parameterConditions) {
        // 1. validate param input
        List<Map<String, Object>> errors = validateParameter(parameterConditions);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2. get list customer
        // 2.2. get list task information
        List<Long> customerIds = new ArrayList<>();
        parameterConditions.forEach(param -> customerIds.addAll(
                customersRepositoryCustom.getCustomerIdsByFieldName(param.getFieldName(), param.getFieldValue())));
        // 3. Call API createDataChangeElasticSearch
        if (!CollectionUtils.isEmpty(customerIds)) {
            syncDataElasticSearch(null, customerIds, Constants.ChangeAction.UPDATE.getValue());
        }

        return true;
    }

    /**
     * validate parameter input
     *
     * @param parameterConditions
     *            - list param input
     * @return list error
     */
    private List<Map<String, Object>> validateParameter(List<CreateDataChangeElasticSearchInDTO> parameterConditions) {
        List<Map<String, Object>> errors = new ArrayList<>();
        int index = 0;
        if (parameterConditions == null || parameterConditions.isEmpty()) {
            errors.add(CommonUtils.putError("parameterConditions", Constants.RIQUIRED_CODE));
        } else {
            for (CreateDataChangeElasticSearchInDTO input : parameterConditions) {
                if (input.getFieldName() == null) {
                    errors.add(CommonUtils.putError("fieldName", Constants.RIQUIRED_CODE, index));
                }
                if (input.getFieldValue() == null || input.getFieldValue().isEmpty()) {
                    errors.add(CommonUtils.putError("fieldValue", Constants.RIQUIRED_CODE, index));
                }
                index++;
            }
        }
        return errors;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getParentCustomers(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetParentCustomersDTO> getParentCustomers(List<Long> customerIds) {
        return customersRepositoryCustom.getParentCustomers(customerIds);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getScenario(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetScenarioOutDTO getScenario(Long customerId) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        GetScenarioOutDTO outDTO = new GetScenarioOutDTO();

        // 1. call API getMilestoneByCustomer
        GetMilestonesByCustomerRequest getMileRequest = new GetMilestonesByCustomerRequest();
        getMileRequest.setCustomerId(customerId);
        GetMilestonesByCustomerResponse milestonesResponse = null;
        try {
            milestonesResponse = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_GET_MILESTONES_BY_CUSTOMER, HttpMethod.POST, getMileRequest,
                    GetMilestonesByCustomerResponse.class, token, tenantName);
        } catch (IllegalStateException e) {
            log.error(e.getMessage());
        }
        if (milestonesResponse == null || CollectionUtils.isEmpty(milestonesResponse.getMilestones())) {
            return outDTO;
        }

        // get data
        GetScenarioOutSubTypeDTO scenario = new GetScenarioOutSubTypeDTO();

        List<GetScenarioOutSubTypeMilestonesDTO> listMilestone = getScenarioMapper
                .toMilestoneOutDTO(milestonesResponse.getMilestones());

        // build task tree
        List<GetScenarioOutSubTypeTasksDTO> listAllTask = new ArrayList<>();

        for (GetScenarioOutSubTypeMilestonesDTO milestone : listMilestone) {
            if (!milestone.getTasks().isEmpty()) {
                listAllTask.addAll(milestone.getTasks());
            }
        }
        // build operator for each tasks
        buildOperatorForeachTask(listAllTask);

        List<GetScenarioOutSubTypeTasksDTO> treeTask = buildListTaskTree(listAllTask);

        for (GetScenarioOutSubTypeMilestonesDTO milestone : listMilestone) {
            milestone.setTasks(new ArrayList<>());
            milestone.getTasks().addAll(treeTask.stream()
                    .filter(task -> milestone.getTaskIds().contains(task.getTaskId())).collect(Collectors.toList()));
        }

        scenario.getMilestones().addAll(listMilestone);
        outDTO.setScenarios(scenario);
        return outDTO;
    }

    /**
     * build operator for each task
     * 
     * @param listAllTask
     */
    private void buildOperatorForeachTask(List<GetScenarioOutSubTypeTasksDTO> listAllTask) {
        listAllTask.stream().forEach(task -> {
            if (CollectionUtils.isEmpty(task.getNestedOperators())) {
                return;
            }
            // build operator
            GetScenarioOutTaskOperatorsDTO operator = new GetScenarioOutTaskOperatorsDTO();
            task.getNestedOperators().forEach(ope -> {
                // get employees
                if (ConstantsCustomers.OPERATOR_TYPE_1.equals(ope.getOperatorDivision())) {
                    EmployeesOfTaskDTO employee = new EmployeesOfTaskDTO();
                    employee.setEmployeeId(ope.getEmployeeId());
                    employee.setEmployeeName(ope.getEmployeeName());
                    employee.setPhotoFilePath(ope.getEmployeeImage());
                    employee.setFileUrl(buildFileUrl(ope.getEmployeeImage()));

                    employee.setCellphoneNumber(ope.getCellphoneNumber());
                    employee.setEmail(ope.getEmail());
                    employee.setEmployeeSurname(ope.getEmployeeSurname());
                    employee.setEmployeeSurnameKana(ope.getEmployeeSurnameKana());
                    employee.setEmployeeNameKana(ope.getEmployeeNameKana());
                    employee.setTelephoneNumber(ope.getTelephoneNumber());
                    employee.setDepartmentName(ope.getDepartmentOfEmployee());
                    employee.setPositionName(ope.getPositionName());

                    operator.getEmployees().add(employee);
                } else if (ConstantsCustomers.OPERATOR_TYPE_2.equals(ope.getOperatorDivision())) {
                    // get departments

                    DepartmentsOfTaskDTO department = new DepartmentsOfTaskDTO();
                    department.setDepartmentId(ope.getDepartmentId());
                    department.setDepartmentName(ope.getDepartmentName());
                    operator.getDepartments().add(department);
                } else {
                    // get groups

                    GroupsOfTaskDTO group = new GroupsOfTaskDTO();
                    group.setGroupId(ope.getGroupId());
                    group.setGroupName(ope.getGroupName());
                    operator.getGroups().add(group);
                }
            });

            task.getOperators().add(operator);
        });
    }

    /**
     * get full path from path
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

    /**
     * build list Tree item
     * 
     * @param listTask
     * @return
     */
    private List<GetScenarioOutSubTypeTasksDTO> buildListTaskTree(List<GetScenarioOutSubTypeTasksDTO> listTask) {
        if (listTask == null || listTask.isEmpty()) {
            return listTask;
        }
        Map<Long, GetScenarioOutSubTypeTasksDTO> taskMap = new HashMap<>();
        for (GetScenarioOutSubTypeTasksDTO task : listTask) {
            taskMap.put(task.getTaskId(), task);
        }

        List<GetScenarioOutSubTypeTasksDTO> taskTree = new ArrayList<>();
        for (GetScenarioOutSubTypeTasksDTO task : listTask) {
            if (task.getParentId() != null) {
                GetScenarioOutSubTypeTasksDTO pTask = taskMap.get(task.getParentId());
                if (pTask != null) {
                    pTask.getSubTasks().add(task);
                } else {
                    taskTree.add(task);
                }
            } else {
                taskTree.add(task);
            }
        }
        return taskTree;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getDetailDataFromElasticSearch(jp.co.softbrain.esales.customers.service.dto.commons.GetDetailElasticSearchRequest)
     */
    @Override
    public SelectDetailElasticSearchResponse getDetailDataFromElasticSearch(
            GetDetailElasticSearchRequest elasticSearchRequest) {
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (tenantName == null) {
            tenantName = TenantContextHolder.getTenant();
        }
        return restOperationUtils.executeCallApi(PathEnum.COMMONS,
                ConstantsCustomers.API_GET_DETAIL_ELASTIC_SEARCH, HttpMethod.POST, elasticSearchRequest,
                SelectDetailElasticSearchResponse.class, token, tenantName);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersCommonService#getCalculatorFormular(java.lang.Integer)
     */
    @Override
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong) {
        return customersRepositoryCustom.getCalculatorFormular(fieldBelong);
    }

    /**
     * (non-Javadoc)
     * 
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#
     *      getDataByRecordIds(java.util.List, java.util.List)
     */
    @Override
    public GetDataByRecordIdsOutDTO getDataByRecordIds(List<Long> recordIds, List<GetDataByRecordIdsInDTO> fieldInfo) {
        GetDataByRecordIdsOutDTO outDto = new GetDataByRecordIdsOutDTO();

        // 1.Validate parameter
        validateGetDataByRecordIds(recordIds, fieldInfo);

        // 2. Get the record information
        List<GetDataByRecordIdsSubType1DTO> relationData = customersRepositoryCustom
                .getCustomerFieldsByRecordIds(recordIds, fieldInfo);

        // If the item has filed_type = 18
        List<Long> departmentIds = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();
        List<Long> employeeIds = new ArrayList<>();

        // In case the item has filed_type = 17
        List<Long> fieldIdsRelation = new ArrayList<>();
        List<Long> lstRecordIdRelation = new ArrayList<>();

        relationData.forEach(relation -> relation.getDataInfos().forEach(dataInfo -> {
            if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(dataInfo.getFieldType().toString())) {
                // If the item has filed_type = 18, it will be taken No.5
                getEmployeeDepartmentGroup(dataInfo, departmentIds, employeeIds, groupIds);
            } else if (FieldTypeEnum.RELATION.getCode().equals(dataInfo.getFieldType().toString())
                    && dataInfo.getRelationData() != null) {
                // In case the item has filed_type = 17, then implement No.3
                fieldIdsRelation.add(dataInfo.getRelationData().getFieldId());
            }
        }));

        Map<Integer, List<GetDataByRecordIdsInDTO>> mapDataInfo = new HashMap<>();
        List<CustomFieldsItemResponseDTO> lstFieldItem = new ArrayList<>();
        // 3. Get information Relation category to display
        if (!fieldIdsRelation.isEmpty()) {
            getFieldInfoRelation(relationData, fieldIdsRelation, lstRecordIdRelation, mapDataInfo, lstFieldItem);
        }
        List<CustomFieldsInfoOutDTO> fieldsList = getCustomFieldsInfoByFieldIds(
                fieldInfo.stream().map(GetDataByRecordIdsInDTO::getFieldId).collect(Collectors.toList()));
        if (fieldsList != null) {
            fieldsList.forEach(f -> lstFieldItem.addAll(f.getFieldItems()));
        }

        // 4. Get the record relation information
        List<GetDataByRecordIdsOutDTO> lstDataRecordIds = new ArrayList<>();
        for (Map.Entry<Integer, List<GetDataByRecordIdsInDTO>> dataInfo : mapDataInfo.entrySet()) {
            lstDataRecordIds.add(getInfoRelation(dataInfo.getKey(), lstRecordIdRelation, dataInfo.getValue()));
        }

        if (!lstDataRecordIds.isEmpty()) {
            relationData.forEach(relation -> relation.getDataInfos().forEach(dataInfo -> {
                if (FieldTypeEnum.RELATION.getCode().equals(dataInfo.getFieldType().toString())
                        && dataInfo.getRelationData() != null) {
                    // In case the item has filed_type = 17, then implement No.3
                    dataInfo.setChildrenRelationDatas(getRelationChild(lstDataRecordIds, dataInfo));
                }
            }));
        }
        // 5. Get information about employees, organizations, and departments
        getEmployeeDepartmentGroup(outDto, departmentIds, groupIds, employeeIds);

        // 6. Retrieve data items automatically calculated
        // TO DO
        outDto.setRelationData(relationData);
        // fieldItems
        outDto.setFieldItems(commonsInfoMapper.toListFieldItems(lstFieldItem));
        return outDto;
    }

    /**
     * 5. Get information about employees, organizations, and departments
     *
     * @param outDto
     * @param departmentIds
     * @param groupIds
     * @param employeeIds
     */
    private void getEmployeeDepartmentGroup(GetDataByRecordIdsOutDTO outDto, List<Long> departmentIds,
            List<Long> groupIds, List<Long> employeeIds) {
        if (!departmentIds.isEmpty() || !employeeIds.isEmpty() || !groupIds.isEmpty()) {
            String token = SecurityUtils.getTokenValue().orElse(null);
            GetSelectedOrganizationInfoRequest request = new GetSelectedOrganizationInfoRequest();
            request.setEmployeeId(employeeIds);
            request.setDepartmentId(departmentIds);
            request.setGroupId(groupIds);
            try {
                SelectedOrganizationInfoOutDTO organizationResponse = restOperationUtils.executeCallApi(
                        Constants.PathEnum.EMPLOYEES, ConstantsCustomers.API_GET_SELECTED_ORGANIZATION_INFO,
                        HttpMethod.POST, request, SelectedOrganizationInfoOutDTO.class, token,
                        jwtTokenUtil.getTenantIdFromToken());

                if (organizationResponse != null) {
                    outDto.setDepartments(organizationResponse.getDepartments());
                    outDto.setEmployee(organizationResponse.getEmployee());
                    outDto.setEmployees(organizationResponse.getEmployees());
                    outDto.setGroupId(organizationResponse.getGroupId());
                }
            } catch (IllegalStateException e) {
                log.error(e.getMessage());
            }
        }
    }

    /**
     * 4. Get the record relation information
     *
     * @param lstRecordIdRelation
     * @param fieldInfo
     * @return
     */
    private GetDataByRecordIdsOutDTO getInfoRelation(Integer fieldBelong, List<Long> lstRecordIdRelation,
            List<GetDataByRecordIdsInDTO> fieldInfo) {
        GetDataByRecordIdsOutDTO outDto = new GetDataByRecordIdsOutDTO();
        String token = SecurityUtils.getTokenValue().orElse(null);
        if (Constants.FieldBelong.PRODUCT.getValue() == fieldBelong) {
            return this.getDataByRecordIds(lstRecordIdRelation, fieldInfo);
        } else if (Constants.FieldBelong.EMPLOYEE.getValue() == fieldBelong) {
            GetDataByRecordIdsRequest request = new GetDataByRecordIdsRequest();
            request.setFieldInfo(fieldInfo);
            request.setRecordIds(lstRecordIdRelation);
            try {
                return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                        ConstantsCustomers.API_FIELDS_INFO_PERSONALS,
                        HttpMethod.POST, request, GetDataByRecordIdsOutDTO.class, token,
                        jwtTokenUtil.getTenantIdFromToken());
            } catch (IllegalStateException e) {
                log.error(e.getMessage());
            }
            return new GetDataByRecordIdsOutDTO();
        } else if (Constants.FieldBelong.TASK.getValue() == fieldBelong) {
            // TrungBH - comment out
            /**
             * try { ManagedChannel scheduleChannel =
             * grpcStubChannel.getSchedulesChannel(backendInterceptor);
             * TasksRelationDataServiceGrpc.TasksRelationDataServiceBlockingStub
             * oranizationStub = TasksRelationDataServiceGrpc
             * .newBlockingStub(scheduleChannel); GetDataByRecordIdsResponse
             * oranizationResponse = oranizationStub
             * .getDataByRecordIds(GetDataByRecordIdsRequest.newBuilder()
             * .addAllFieldInfo(dataByRecordIdsMapper.toGrpcFieldInfo(fieldInfo))
             * .addAllRecordIds(lstRecordIdRelation).setEmployeeIdLogin(employeeIdLogin).build());
             * if (oranizationResponse != null) { return
             * dataByRecordIdsMapper.toDtoGetDataByRecordIds(oranizationResponse); } } catch
             * (StatusRuntimeException e) { log.error(e.getMessage()); }
             */
        }
        return outDto;
    }

    /**
     * Get relation child
     *
     * @param lstDataRecordIds
     * @param dataInfo
     * @return
     */
    private List<GetDataByRecordIdsSubType1DTO> getRelationChild(List<GetDataByRecordIdsOutDTO> lstDataRecordIds,
            GetDataByRecordIdsSubType2DTO dataInfo) {
        List<Long> lstId = getListLongFromString(dataInfo.getValue());
        List<GetDataByRecordIdsSubType1DTO> childrenRelationDatas = new ArrayList<>();

        lstDataRecordIds.forEach(dataRecord -> dataRecord.getRelationData().forEach(relationChild -> {
            if (lstId.contains(relationChild.getRecordId())) {
                childrenRelationDatas.add(relationChild);
            }
        }));
        return childrenRelationDatas;
    }

    /**
     * Convert String to List<Long>
     *
     * @param dataRelation
     * @return list of Long
     */
    private List<Long> getListLongFromString(String dataRelation) {
        List<Long> lstRelationId = new ArrayList<>();
        if (StringUtil.isEmpty(dataRelation)) {
            return lstRelationId;
        }
        List<Double> datas = new ArrayList<>();
        try {
            TypeReference<List<Double>> listTypeRef = new TypeReference<>() {
            };
            datas = objectMapper.readValue(dataRelation, listTypeRef);
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
        }
        datas.forEach(data -> lstRelationId.add(data.longValue()));
        return lstRelationId;
    }

    /**
     * 1.Validate parameter for api getDataByRecordIds
     *
     * @param recordIds
     * @param fieldInfo
     */
    private void validateGetDataByRecordIds(List<Long> recordIds, List<GetDataByRecordIdsInDTO> fieldInfo) {

        // recordIds required
        if (recordIds == null || recordIds.isEmpty()) {
            throw new CustomRestException(
                    CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
        }

        if (fieldInfo == null || fieldInfo.isEmpty()) {
            throw new CustomRestException(
                    CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
        }

        // fieldInfo required
        fieldInfo.forEach(fieldIn -> {
            if (fieldIn.getFieldId() == null) {
                throw new CustomRestException(
                        CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
            }

            if (fieldIn.getFieldType() == null) {
                throw new CustomRestException(
                        CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
            }

            if (StringUtil.isEmpty(fieldIn.getFieldName())) {
                throw new CustomRestException(
                        CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
            }

            if (fieldIn.getIsDefault() == null) {
                throw new CustomRestException(
                        CommonUtils.putError(jp.co.softbrain.esales.utils.StringUtil.EMPTY, Constants.RIQUIRED_CODE));
            }
        });
    }

    /**
     * Get list employeId, departmentId and groupId
     *
     * @param dataInfo
     */
    private void getEmployeeDepartmentGroup(GetDataByRecordIdsSubType2DTO dataInfo, List<Long> departmentIds,
            List<Long> employeeIds, List<Long> groupIds) {
        String productData = dataInfo.getValue();
        if (!StringUtil.isEmpty(productData)) {
            List<Map<String, Object>> dataList = new ArrayList<>();
            try {
                TypeReference<List<Map<String, Object>>> listTypeRef = new TypeReference<>() {
                };
                dataList = objectMapper.readValue(productData, listTypeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }

            dataList.forEach(data -> {
                Object departmentObj = data.get(ConstantsCustomers.COLUMN_NAME_DEPARTMENT_ID);
                Object employeeObj = data.get(ConstantsCustomers.COLUMN_NAME_EMPLOYEE_ID);
                Object groupObj = data.get(ConstantsCustomers.COLUMN_NAME_GROUP_ID);

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
     * 3. Get information Relation category to display
     *
     * @param relationData
     * @param fieldIdsRelation
     * @param lstRecordIdRelation
     * @param mapDataInfo
     * @param lstFieldItem
     */
    private void getFieldInfoRelation(List<GetDataByRecordIdsSubType1DTO> relationData, List<Long> fieldIdsRelation,
            List<Long> lstRecordIdRelation, Map<Integer, List<GetDataByRecordIdsInDTO>> mapDataInfo,
            List<CustomFieldsItemResponseDTO> lstFieldItem) {
        // 3. Get information Relation category to display
        final List<CustomFieldsInfoOutDTO> fieldsList = this.getCustomFieldsInfoByFieldIds(fieldIdsRelation);
        relationData.forEach(relation -> relation.getDataInfos().forEach(dataInfo -> {
            if (FieldTypeEnum.RELATION.getCode().equals(dataInfo.getFieldType().toString())) {
                CustomFieldsInfoOutDTO field = getFieldInfoFromList(
                        dataInfo.getRelationData().getFieldId(),
                        fieldsList);
                if (field != null) {
                    getRecordIdsDataInfos(lstRecordIdRelation, mapDataInfo, lstFieldItem, dataInfo, field);
                }
            }
        }));
    }

    /**
     * Get the record relation information
     *
     * @param lstRecordIdRelation
     * @param mapDataInfo
     * @param lstFieldItem
     * @param dataInfo
     * @param field
     */
    private void getRecordIdsDataInfos(List<Long> lstRecordIdRelation,
            Map<Integer, List<GetDataByRecordIdsInDTO>> mapDataInfo,
            List<CustomFieldsItemResponseDTO> lstFieldItem,
            GetDataByRecordIdsSubType2DTO dataInfo, CustomFieldsInfoOutDTO field) {
        // RecordIds
        List<Double> datas = new ArrayList<>();
        try {
            TypeReference<List<Double>> listTypeRef = new TypeReference<>() {};
            datas = objectMapper.readValue(dataInfo.getValue(), listTypeRef);
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
        }
        datas.forEach(data -> lstRecordIdRelation.add(data.longValue()));

        GetDataByRecordIdsInDTO dataRecord = new GetDataByRecordIdsInDTO();
        dataRecord.setFieldId(field.getFieldId());
        dataRecord.setFieldName(field.getFieldName());
        dataRecord.setFieldType(field.getFieldType());
        dataRecord.setIsDefault(field.getIsDefault());

        if (!mapDataInfo.containsKey(field.getFieldBelong())) {
            List<GetDataByRecordIdsInDTO> lstDataInfoRelation = new ArrayList<>();
            // dataInfos
            lstDataInfoRelation.add(dataRecord);
            mapDataInfo.put(field.getFieldBelong(), lstDataInfoRelation);
        } else {
            mapDataInfo.get(field.getFieldBelong()).add(dataRecord);
        }
        lstFieldItem.addAll(field.getFieldItems());
    }

    /**
     * Filter field in list
     *
     * @param fieldId
     * @param fieldsList
     * @return
     */
    private CustomFieldsInfoOutDTO getFieldInfoFromList(Long fieldId, List<CustomFieldsInfoOutDTO> fieldsList) {
        for (int i = 0; i < fieldsList.size(); i++) {
            if (fieldId.equals(fieldsList.get(i).getFieldId())) {
                return fieldsList.get(i);
            }
        }
        return null;
    }

    /**
     * @see ProductCommonService#getCustomFieldsInfoByFieldIds(List)
     */
    private List<CustomFieldsInfoOutDTO> getCustomFieldsInfoByFieldIds(List<Long> fieldIds) {
        GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest(fieldIds);
        String token = SecurityUtils.getTokenValue().orElse(null);
        CommonFieldInfoResponse response = new CommonFieldInfoResponse();
        try {
            response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request,
                    CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (IllegalStateException e) {
            log.error(e.getMessage());
        }
        return response.getCustomFieldsInfo();
    }
}
