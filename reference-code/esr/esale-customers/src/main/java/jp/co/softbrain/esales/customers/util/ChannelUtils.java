package jp.co.softbrain.esales.customers.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn1DTO;
import jp.co.softbrain.esales.customers.service.dto.SaveScenarioSubIn2DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCompanyInDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCompanyRequest;
import jp.co.softbrain.esales.customers.service.dto.businesscards.UpdateCompanyResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.CreateNotificationResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.DataSyncElasticSearchRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentRequest;
import jp.co.softbrain.esales.customers.service.dto.employees.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.employees.GetGroupAndDepartmentByEmployeeIdsRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingTabRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.sales.GetProductTradingsRequest;
import jp.co.softbrain.esales.customers.service.dto.sales.ProductTradingsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateDataChangeElasticSearchInDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateDataChangeRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateMilestoneRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateUpdateTaskInDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateUpdateTaskRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.CreateUpdateTaskResponse;
import jp.co.softbrain.esales.customers.service.dto.schedules.CustomerInput;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteMilestoneRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.DeleteTasksRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTaskTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetTasksTabRequest;
import jp.co.softbrain.esales.customers.service.dto.schedules.ListTaskIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.TaskIdInput;
import jp.co.softbrain.esales.customers.service.dto.schedules.UpdateMilestoneRequest;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.DataField;
import jp.co.softbrain.esales.utils.dto.DataRow;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.timelines.CreateTimelineAutoRequest;

/**
 * ChannelUtils class for api call
 * 
 * @author phamminhphu
 */
@Component
@XRayEnabled
public class ChannelUtils {
    private final Logger log = LoggerFactory.getLogger(ChannelUtils.class);
    private static final String ERRORS = "errors";
    private static final String ROW_ID_REMAKE = "row_id_remake";
    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Get elastic string row value by key
     * 
     * @param row
     * @param property
     * @return
     */
    public static String esRowValue(DataRow dataRow, String key) {
        if (dataRow == null) {
            return null;
        }
        List<DataField> listDataFeild = dataRow.getRow();
        if (CollectionUtils.isEmpty(listDataFeild)) {
            return null;
        }
        for (DataField field : listDataFeild) {
            if (field.getKey().equals(key)) {
                return field.getValue();
            }
        }
        return null;
    }

    /**
     * Get elastic Long row value by key
     * 
     * @param row
     * @param property
     * @return
     */
    public static Long esLongValue(DataRow dataRow, String key) {
        return CommonUtils.longValue(esRowValue(dataRow, key));
    }

    /**
     * call Employee.getDepartments from channel service Employee
     * 
     * @param departmentIds
     * @param getEmployeesFlg
     * @return GetDepartmentsResponse
     */
    public GetDepartmentsOutDTO getDepartments(List<Long> departmentIds, boolean getEmployeesFlg) {
        GetDepartmentRequest request = new GetDepartmentRequest();
        request.setDepartmentIds(departmentIds);
        request.setGetEmployeesFlg(getEmployeesFlg);
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES, "get-departments", HttpMethod.POST,
                    request, GetDepartmentsOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error("Error getDepartments", e);
        }
        return null;
    }

    /**
     * call gRPC Employee.getGroupAndDepartmentByEmployeeIds from channel
     * service Employee
     * 
     * @param employeeIds
     * @return GetGroupAndDepartmentByEmployeeIdsResponse
     */
    public GetGroupAndDepartmentByEmployeeIdsOutDTO getGroupAndDepartmentByEmployeeIds(List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            return null;
        }
        GetGroupAndDepartmentByEmployeeIdsRequest req = new GetGroupAndDepartmentByEmployeeIdsRequest();
        req.setEmployeeIds(employeeIds);
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES,
                    "get-group-and-department-by-employee-ids", HttpMethod.POST, req,
                    GetGroupAndDepartmentByEmployeeIdsOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (IllegalStateException e) {
            log.error("Error getGroupAndDepartmentByEmployeeIds", e);
            return null;
        }
    }

    /**
     * call Employee.getEmployees from channel service Employee
     * 
     * @param employeeIdsn
     * @return GetEmployeesByIdsResponse
     */
    public GetEmployeesByIdsResponse getEmployees(List<Long> employeeIds) {
        if (!employeeIds.isEmpty()) {
            DataSyncElasticSearchRequest req = new DataSyncElasticSearchRequest();
            req.setEmployeeIds(employeeIds);
            try {
                return restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES, "get-employees-by-ids",
                        HttpMethod.POST, req, GetEmployeesByIdsResponse.class,
                        SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());
            } catch (Exception e) {
                log.error("Error getEmployees", e);
            }
        }
        return null;
    }

    /**
     * call API Employee.getEmployees from channel service Employee
     * 
     * @param employeeIds
     * @param languageKey
     * @return Map<Long, EmployeeInfoDTO>
     */
    public Map<Long, EmployeeInfoDTO> getMapEmployees(List<Long> employeeIds) {
        Map<Long, EmployeeInfoDTO> returnMap = new HashMap<>();
        if (CollectionUtils.isEmpty(employeeIds)) {
            return returnMap;
        }
        GetEmployeesByIdsResponse res = getEmployees(employeeIds);
        if (res == null || CollectionUtils.isEmpty(res.getEmployees())) {
            return returnMap;
        }
        List<EmployeeInfoDTO> list = res.getEmployees();
        list.forEach(info -> returnMap.put(info.getEmployeeId(), info));
        return returnMap;
    }

    /**
     * Get Employees By Ids
     * 
     * @param employeeIds request body
     * @return List<EmployeeInfoDTO> response
     */
    public List<EmployeeInfoDTO> getEmployeesByIds(List<Long> employeeIds) {
        DataSyncElasticSearchRequest dataSyncElasticSearchRequest = new DataSyncElasticSearchRequest();
        dataSyncElasticSearchRequest.setEmployeeIds(employeeIds);
        try {
            GetEmployeesByIdsResponse employeeRes = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES,
                    "get-employees-by-ids", HttpMethod.POST,
                    dataSyncElasticSearchRequest,
                    GetEmployeesByIdsResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
            return employeeRes.getEmployees();
        } catch (Exception e) {
            log.error("Error getEmployeesByIds", e);
            return new ArrayList<>();
        }
    }

    /**
     * get Product Tradings
     * 
     * @param searchCondition
     * @return GetProductTradingsOutDTO response
     */
    public List<ProductTradingsOutDTO> getProductTradings(SearchItem searchCondition) {
        try {
            searchCondition.setIsDefault("true");
            GetProductTradingsRequest request = new GetProductTradingsRequest();
            request.setIsOnlyData(true);
            request.setOrders(new ArrayList<>());
            request.setIsFirstLoad(true);
            request.setSelectedTargetId(0L);
            request.setSelectedTargetType(0);
            request.getSearchConditions().add(searchCondition);

            GetProductTradingsOutDTO res = restOperationUtils.executeCallApi(Constants.PathEnum.SALES,
                    "get-product-tradings", HttpMethod.POST, request, GetProductTradingsOutDTO.class,
                    SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());
            if (res != null) {
                return res.getProductTradings();
            }
        } catch (Exception e) {
            log.error("Error getProductTradings", e);
            return new ArrayList<>();
        }
        return new ArrayList<>();
    }

    /**
     * create notification
     * 
     * @param request data request create notification
     * @return {@link CreateNotificationResponse}
     */
    public CreateNotificationResponse createNotification(CreateNotificationRequest request) {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "create-notification", HttpMethod.POST,
                    request, CreateNotificationResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.debug(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_CREATE_NOTIFICATION,
                    e.getLocalizedMessage()));
        }
        return null;
    }

    /**
     * Call API createTimelineAuto
     * 
     * @param request
     *            data request create timeline auto
     * @return List id of timelines
     */
    public Long createTimelineAuto(CreateTimelineAutoRequest request) {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.TIMELINES,
                    ConstantsCustomers.API_CREATE_TIMELINES_AUTO,
                    HttpMethod.POST, request, Long.class, SecurityUtils.getTokenValue().orElse(
                            null),
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error("Error Call API createTimelinesAuto", e);
        }
        return null;
    }

    /**
     * Get elastic String row value by key
     * 
     * @param row
     * @param property
     * @return
     */
    public static String esStringValue(DataRow dataRow, String key) {
        return CommonUtils.NVL(esRowValue(dataRow, key));
    }

    /**
     * Create elastic search condition
     * 
     * @param fieldType
     * @param fieldName
     * @param fieldValue
     * @return
     */
    public static SearchConditionDTO esCondition(Integer fieldType, String fieldName, String fieldValue,
            String searchType, String searchOption) {
        SearchConditionDTO conditons = new SearchConditionDTO();
        conditons.setFieldType(fieldType);
        conditons.setFieldName(fieldName);
        conditons.setFieldValue(fieldValue);
        conditons.setSearchOption(searchOption);
        conditons.setSearchType(searchType);
        return conditons;
    }

    /**
     * Update company
     * 
     * @param customerNameList
     *            list customer list name
     */
    public void updateCompany(List<UpdateCompanyInDTO> customerNameList) {
        try {
            UpdateCompanyRequest request = new UpdateCompanyRequest();
            request.setCustomers(customerNameList);
            restOperationUtils.executeCallApi(Constants.PathEnum.BUSINESSCARDS, "update-company", HttpMethod.POST,
                    request, UpdateCompanyResponse.class,
                    SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error("Error call API updateCompany", e);
        }
    }

    /**
     * Create Data change for service task
     * 
     * @param updatedList
     *            list id customer updated
     */
    public void createDataChangeForServiceTask(List<Long> updatedList) {
        try {
            List<CreateDataChangeElasticSearchInDTO> parameterConditions = new ArrayList<>();
            CreateDataChangeElasticSearchInDTO parameterConditionsTask = new CreateDataChangeElasticSearchInDTO();
            parameterConditionsTask.setFieldName(ConstantsCustomers.CUSTOMER_COLUMN_ID);
            parameterConditionsTask.setFieldValue(updatedList);
            parameterConditions.add(parameterConditionsTask);

            CreateDataChangeRequest taskRequest = new CreateDataChangeRequest();
            taskRequest.setParameterConditions(parameterConditions);

            restOperationUtils.executeCallApi(Constants.PathEnum.SCHEDULES,
                    ConstantsCustomers.API_CREATE_DATA_CHANGE_ELASTIC_SEARCH, HttpMethod.POST, taskRequest,
                    Boolean.class, SecurityUtils.getTokenValue().orElse(null), jwtTokenUtil.getTenantIdFromToken());

        } catch (Exception e) {
            log.debug("Indexing elasticsearch failed. Invalid bulk request, error_message: {}",
                    e.getLocalizedMessage());
        }
    }

    /**
     * Call API delete mile stone
     * 
     * @param deleteMilestoneRequest
     *            deleteMilestoneRequest
     * @param tenantName
     *            tenantName
     * @param token
     *            token
     * @param indexMilestone 
     * @return id milestone
     */
    public List<Map<String, Object>> callAPIdeleteMilestone(DeleteMilestoneRequest deleteMilestoneRequest, String token,
            String tenantName, int indexMilestone) {
        List<Map<String, Object>> errorsMap = new ArrayList<>();
        try {
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_DELETE_MILESTONE,
                    HttpMethod.POST, deleteMilestoneRequest, Long.class, token, tenantName);
        } catch (CustomRestException e) {
            errorsMap.addAll(getErrorRowIdMilestone(e, indexMilestone));
        }
        return errorsMap;
    }

    /**
     * callAPIupdateMilestone
     * 
     * @param miles
     *            milestoneName
     * @param customerId
     *            customerId
     * @param token
     *            token
     * @param tenantName
     *            tenantName
     * @param indexMilestone
     */
    public List<Map<String, Object>> callAPIUpdateMilestone(SaveScenarioSubIn1DTO miles, Long customerId,
            String token,
            String tenantName, int indexMilestone) {
        List<Map<String, Object>> errorsMap = new ArrayList<>();
        UpdateMilestoneRequest request = new UpdateMilestoneRequest();
        request.setMilestoneId(miles.getMilestoneId());
        request.setCustomerId(customerId);
        request.setMilestoneName(miles.getMilestoneName());
        request.setIsDone(miles.getIsDone());
        request.setEndDate(miles.getFinishDate());
        request.setMemo(miles.getMemo());
        request.setUpdatedDate(miles.getUpdatedDate());
        try {
            restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_UPDATE_MILESTONE,
                    HttpMethod.POST, request, Long.class, token, tenantName);
        } catch (CustomRestException e) {
            errorsMap.addAll(getErrorRowIdMilestone(e, indexMilestone));
        }
        return errorsMap;
    }

    /**
     * Call api create milestone
     * 
     * @param miles
     *            {@link SaveScenarioSubIn1DTO}
     * @param customerId
     *            Customer ID
     * @param token
     *            The token to authenticate
     * @param tenantName
     *            The tenant name
     * @return ID created
     */
    public List<Map<String, Object>> callAPICreateMilestone(SaveScenarioSubIn1DTO miles, Long customerId,
            String token,
            String tenantName, int indexMilestone) {
        List<Map<String, Object>> errorsMap = new ArrayList<>();
        CreateMilestoneRequest request = new CreateMilestoneRequest();

        request.setMilestoneName(miles.getMilestoneName());
        request.setMemo(miles.getMemo());
        request.setEndDate(miles.getFinishDate());

        Integer isDone = miles.getIsDone();
        if (isDone == null || isDone.intValue() <= 0) {
            isDone = Integer.valueOf(0);
        }
        request.setIsDone(isDone);
        request.setCustomerId(customerId);
        try {
            Long idCreated = restOperationUtils.executeCallApi(
                    PathEnum.SCHEDULES,
                    ConstantsCustomers.API_CREATE_MILESTONE,
                    HttpMethod.POST, request, Long.class, token, tenantName);
            miles.setMilestoneId(idCreated);
        } catch (CustomRestException e) {
            errorsMap.addAll(getErrorRowIdMilestone(e, indexMilestone));
        }
        return errorsMap;
    }

    /**
     * Get error milestones
     * 
     * @param e
     *            exception
     * @param indexMilestone
     *            index row
     * @return error
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> getErrorRowIdMilestone(CustomRestException e, int indexMilestone) {
        Map<String, Object> errorsMap = e.getExtensions();
        List<Map<String, Object>> errorsListMap = (List<Map<String, Object>>) errorsMap.get(ERRORS);
        if (errorsListMap != null) {
            errorsListMap.forEach(mapError -> {
                if (mapError.get(Constants.ERROR_CODE) != null) {
                    mapError.put(ROW_ID_REMAKE, indexMilestone);
                }
            });
        } else {
            errorsListMap = new ArrayList<>();
        }
        return errorsListMap;
    }

    /**
     * Get error Task
     * 
     * @param e
     *            exception
     * @param indexMilestone
     *            indexMilestone
     * @param taskId
     *            taskId
     * @return error
     */
    @SuppressWarnings("unchecked")
    private Collection<? extends Map<String, Object>> getErrorRowIdTask(CustomRestException e, int indexMilestone,
            String taskId) {
        Map<String, Object> errorsMap = e.getExtensions();
        List<Map<String, Object>> errorsListMap = (List<Map<String, Object>>) errorsMap.get(ERRORS);
        errorsListMap.forEach(mapError -> {
            if (mapError.get(Constants.ERROR_CODE) != null) {
                mapError.put(ROW_ID_REMAKE, indexMilestone + "_" + taskId);
            }
        });
        return errorsListMap;
    }

    /**
     * Call API delete task
     * 
     * @param taskIdsDelete
     *            task id delete
     * @return List taskid deleted
     */
    public List<Map<String, Object>> callAPIDeleteTasks(List<Long> taskIdsDelete, String token, String tenantName,
            int indexMilestone) {
        List<Map<String, Object>> errorsList = new ArrayList<>();
        if (taskIdsDelete != null && !taskIdsDelete.isEmpty()) {
            DeleteTasksRequest request = new DeleteTasksRequest();
            List<TaskIdInput> taskIdList = new ArrayList<>();
            taskIdsDelete.forEach(taskId -> {
                TaskIdInput taskIdInput = new TaskIdInput();
                taskIdInput.setTaskId(taskId);
                taskIdList.add(taskIdInput);
            });
            request.setTaskIdList(taskIdList);
            request.setProcessFlg(ConstantsCustomers.PROCESS_FLG_TYPE_2);
            try {
                restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                        ConstantsCustomers.API_DELETE_TASK,
                        HttpMethod.POST, request, ListTaskIdOutDTO.class, token, tenantName);
            } catch (CustomRestException e) {
                StringBuilder taskIdStr = new StringBuilder();
                taskIdsDelete.forEach(id -> taskIdStr.append(id + "_"));
                errorsList.addAll(getErrorRowIdTask(e, indexMilestone, taskIdStr.toString()));
            }
        }
        return errorsList;
    }

    /**
     * Call API update task
     * 
     * @param task
     *            task input
     * @param milestoneId
     *            milestoneIds
     * @param customerId
     *            customerId
     * @param indexMilestone
     *            indexMilestone
     * @throws JsonProcessingException
     */
    public List<Map<String, Object>> callAPIUpdateTask(SaveScenarioSubIn2DTO task, Long milestoneId, Long customerId,
            String token, String tenantName, int indexMilestone) {
        List<Map<String, Object>> errorsList = new ArrayList<>();
        CreateUpdateTaskRequest request = new CreateUpdateTaskRequest();
        CreateUpdateTaskInDTO createDTO = getCreateUpdateTaskRequset(task, milestoneId, customerId);
        request.setTaskId(task.getTaskId());
        try {
            request.setData(objectMapper.writeValueAsString(createDTO));
            restOperationUtils.executeCallApiWithFormData(PathEnum.SCHEDULES, ConstantsCustomers.API_UPDATE_TASK,
                    request, CreateUpdateTaskResponse.class, token, tenantName);
        } catch (CustomRestException e) {
            errorsList.addAll(getErrorRowIdTask(e, indexMilestone, String.valueOf(task.getTaskId())));
        } catch (JsonProcessingException e) {
            log.debug("Parse value Json failed. error_message: {}", e.getLocalizedMessage());
        }
        return errorsList;
    }

    /**
     * Create update task requets
     * 
     * @param task
     *            task
     * @param milestoneId
     *            milestoneId
     * @param customerId
     *            customerId
     * @return dto response
     */
    private CreateUpdateTaskInDTO getCreateUpdateTaskRequset(SaveScenarioSubIn2DTO task, Long milestoneId,
            Long customerId) {
        CreateUpdateTaskInDTO createDTO = new CreateUpdateTaskInDTO();
        List<CustomerInput> customerList = new ArrayList<>();
        CustomerInput customerInput = new CustomerInput();
        customerInput.setCustomerId(customerId);
        customerList.add(customerInput);
        createDTO.setMilestoneId(milestoneId);
        createDTO.setTaskName(task.getTaskName());
        createDTO.setStatusTaskId(task.getStatusTaskId());
        createDTO.setStartDate(task.getStartDate());
        createDTO.setFinishDate(task.getFinishDate());
        createDTO.setMemo(task.getMemo());
        createDTO.setUpdatedDate(task.getUpdatedDate());
        createDTO.setParentTaskId(task.getParentId());
        createDTO.setOperators(task.getOperators());
        createDTO.setCustomers(customerList);
        return createDTO;
    }

    /**
     * call API get Product trading tab
     * 
     * @param employeeIds
     * @return GetGroupAndDepartmentByEmployeeIdsResponse
     */
    public GetProductTradingTabOutDTO callAPIGetProductTradingTab(GetProductTradingTabRequest request, String token,
            String tenantName) {
        GetProductTradingTabOutDTO responseDTO = new GetProductTradingTabOutDTO();
        try {
            responseDTO = restOperationUtils.executeCallApi(PathEnum.SALES,
                    ConstantsCustomers.API_GET_PRODUCT_TRADING_TAB, HttpMethod.POST, request,
                    GetProductTradingTabOutDTO.class, token, tenantName);
        } catch (Exception e) {
            log.error(String.format(ConstantsCustomers.CALL_API_MSG_FAILED,
                    ConstantsCustomers.API_GET_PRODUCT_TRADING_TAB,
                    e.getLocalizedMessage()));
        }
        return responseDTO;
    }

    /**
     * Call API get Task Tab
     * 
     * @param request
     *            GetTasksTabRequest
     * @param token
     *            token
     * @param tenantName
     *            tenantName
     * @return response dto
     */
    public GetTaskTabOutDTO callAPIGetTasksTab(GetTasksTabRequest request, String token, String tenantName) {
        GetTaskTabOutDTO responseDTO = new GetTaskTabOutDTO();
        try {
            responseDTO = restOperationUtils.executeCallApi(PathEnum.SCHEDULES,
                    ConstantsCustomers.API_GET_TASKS_TAB,
                    HttpMethod.POST, request, GetTaskTabOutDTO.class, token, tenantName);
        } catch (Exception e) {
            log.error(String.format(ConstantsCustomers.CALL_API_MSG_FAILED, ConstantsCustomers.API_GET_TASKS_TAB,
                    e.getLocalizedMessage()));
        }
        return responseDTO;
    }
}
