package jp.co.softbrain.esales.employees.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jodd.util.StringUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.domain.EmployeesHistories;
import jp.co.softbrain.esales.employees.domain.EmployeesPackages;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepositoryTms;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryTms;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepositoryTms;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryTms;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesDepartmentsMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesHistoriesMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesPackagesMapper;
import jp.co.softbrain.esales.employees.tenant.util.EmployeesCommonUtil;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TmsApi;
import jp.co.softbrain.esales.utils.CommonUtils;

@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class TmsServiceImpl implements TmsService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TmsApi tmsApi;

    @Autowired
    private EmployeesMapper employeesMapper;

    @Autowired
    private EmployeesPackagesMapper employeesPackagesMapper;

    @Autowired
    private EmployeesDepartmentsMapper employeesDepartmentsMapper;

    @Autowired
    private EmployeesHistoriesMapper employeesHistoriesMapper;

    @Autowired
    private EmployeesRepositoryTms employeesRepositoryTms;

    @Autowired
    private EmployeesDepartmentsRepositoryTms employeesDepartmentsRepositoryTms;

    @Autowired
    private EmployeesGroupsRepositoryTms employeesGroupsRepositoryTms;

    @Autowired
    private EmployeesPackagesRepositoryTms employeesPackagesRepositoryTms;

    private static ObjectMapper objectMapper = null;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.enable(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS);
        objectMapper.setDateFormat(new StdDateFormat().withColonInTimeZone(true));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#startTransaction()
     */
    @Override
    public String startTransaction() {
        JSONObject resp = tmsApi.startTransaction();
        String transID = resp.optString(Constants.TMS.TRANS_ID);
        if (transID == null || transID.equals("")) {
            return null;
        }
        return transID;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#saveEmployee(EmployeesDTO,String)
     */
    @Override
    public EmployeesDTO saveEmployee(EmployeesDTO employeesDTO, String transID) {

        Employees employees = employeesMapper.toEntity(employeesDTO);
        JSONObject result;

        if (employees.getEmployeeId() == null) { // Insert
            result = tmsApi.insert(transID, jwtTokenUtil.getTenantIdFromToken(), employees);

            if (isSuccess(result)) {
                employees.setEmployeeId(Long.valueOf(result.optString(Constants.TMS.RESULTS)));
                return employeesMapper.toDto(employees);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot insert employee", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }

        } else { // Update
            result = tmsApi.update(transID, jwtTokenUtil.getTenantIdFromToken(), employees);
            if (isSuccess(result)) {
                return employeesMapper.toDto(employees);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot update employee", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }
        }
    }

    /**
     * Check success
     * 
     * @param result
     *            result
     * @return true: successs - false: not success
     */
    private boolean isSuccess(JSONObject result) {
        return result != null && Constants.TMS.CODE_SUCCESS.equals(result.optString(Constants.TMS.CODE));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#saveEmployeePackage(EmployeesPackagesDTO,String)
     */
    @Override
    public EmployeesPackagesDTO saveEmployeePackage(EmployeesPackagesDTO employeesPackagesDTO, String transID) {

        EmployeesPackages employeesPackages = employeesPackagesMapper.toEntity(employeesPackagesDTO);
        JSONObject result;

        if (employeesPackages.getEmployeePackageId() == null) { // Insert
            result = tmsApi.insert(transID, jwtTokenUtil.getTenantIdFromToken(), employeesPackages);

            if (isSuccess(result)) {
                employeesPackages.setEmployeePackageId(Long.valueOf(result.optString(Constants.TMS.RESULTS)));
                return employeesPackagesMapper.toDto(employeesPackages);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot insert employee packages",
                                Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }

        } else { // Update
            result = tmsApi.update(transID, jwtTokenUtil.getTenantIdFromToken(), employeesPackages);
            if (isSuccess(result)) {
                return employeesPackagesMapper.toDto(employeesPackages);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot update employee package", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#saveEmployeeDepartment(EmployeesDepartmentsDTO,String)
     */
    @Override
    public EmployeesDepartmentsDTO saveEmployeeDepartment(EmployeesDepartmentsDTO employeesDepartmentsDTO,
            String transID) {

        EmployeesDepartments employeesDepartments = employeesDepartmentsMapper.toEntity(employeesDepartmentsDTO);
        JSONObject result;

        if (employeesDepartments.getEmployeesDepartmentsId() == null) { // Insert
            result = tmsApi.insert(transID, jwtTokenUtil.getTenantIdFromToken(), employeesDepartments);

            if (isSuccess(result)) {
                employeesDepartments.setEmployeesDepartmentsId(Long.valueOf(result.optString(Constants.TMS.RESULTS)));
                return employeesDepartmentsMapper.toDto(employeesDepartments);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot insert employee department ",
                                Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }

        } else { // Update
            result = tmsApi.update(transID, jwtTokenUtil.getTenantIdFromToken(), employeesDepartments);
            if (isSuccess(result)) {
                return employeesDepartmentsMapper.toDto(employeesDepartments);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot update employee department",
                                Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }
        }

    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#saveAllEmployeeDepartment(List<EmployeesDepartments>,String)
     */
    @Override
    public List<EmployeesDepartments> saveAllEmployeesDepartments(List<EmployeesDepartments> listEmpDep,
            String transID) {
        List<EmployeesDepartments> resultList = new ArrayList<>();
        for (EmployeesDepartments employeesDepartments : listEmpDep) {
            EmployeesDepartmentsDTO empDepDTO = employeesDepartmentsMapper.toDto(employeesDepartments);
            empDepDTO = saveEmployeeDepartment(empDepDTO, transID);
            EmployeesDepartments entity = employeesDepartmentsMapper.toEntity(empDepDTO);
            resultList.add(entity);
        }
        return resultList;

    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#saveEmployeeHistory(EmployeesHistoriesDTO,String)
     */
    @Override
    public EmployeesHistoriesDTO saveEmployeeHistory(EmployeesHistoriesDTO employeesHistoriesDTO, String transID) {

        EmployeesHistories employeesHistories = employeesHistoriesMapper.toEntity(employeesHistoriesDTO);
        JSONObject result;

        if (employeesHistories.getEmployeeHistoryId() == null) { // Insert
            result = tmsApi.insert(transID, jwtTokenUtil.getTenantIdFromToken(), employeesHistories);

            if (isSuccess(result)) {
                employeesHistories.setEmployeeHistoryId(Long.valueOf(result.optString(Constants.TMS.RESULTS)));
                return employeesHistoriesMapper.toDto(employeesHistories);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot save Employee Histories", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }

        } else { // Update
            result = tmsApi.update(transID, jwtTokenUtil.getTenantIdFromToken(), employeesHistories);
            if (isSuccess(result)) {
                return employeesHistoriesMapper.toDto(employeesHistories);
            } else {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError("Cannot save Employee Histories", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#deleteEmployee(Long,String)
     */
    @Override
    public boolean deleteEmployee(Long id, String transID) {
        Employees employee = new Employees();
        employee.setEmployeeId(id);
        JSONObject result = tmsApi.delete(transID, jwtTokenUtil.getTenantIdFromToken(), employee);

        boolean responseResult = isSuccess(result);
        if (!responseResult) {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot delete Employee ", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
        return responseResult;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#deleteEmployeePackageByEmployeeId(java.lang.Long,
     *      java.lang.String)
     */
    @Override
    public boolean deleteEmployeePackageByEmployeeId(Long employeeId, String transID) {
        return employeesPackagesRepositoryTms.deleteEmployeePackageByEmployeeId(employeeId, transID);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findEmployeesPackagesIdsByEmployeeIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<Long> findEmployeesPackagesIdsByEmployeeIds(List<Long> employeesIds, String transID) {
        String jsonResult = employeesPackagesRepositoryTms.findEmployeesPackagesIdsByEmployeeIds(employeesIds, transID);
        List<Long> employeePackagesIds = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return employeePackagesIds;
        }

        employeePackagesIds = getListOfLong(jsonResult, ConstantsEmployees.EMPLOYEES_PACKAGES_ID);

        return employeePackagesIds;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#deleteAllEmployeesDepartments(java.util.List,
     *      java.lang.String)
     */
    @Override
    public boolean deleteAllEmployeesDepartments(List<EmployeesDepartments> listEmpDepDelete, String transID) {
        boolean res = true;
        for (EmployeesDepartments empDep : listEmpDepDelete) {
            JSONObject result = tmsApi.delete(transID, jwtTokenUtil.getTenantIdFromToken(), empDep);

            if (!isSuccess(result)) {
                throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                        CommonUtils.putError(" Cannot delete all employee department ",
                                Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
            }
        }
        return res;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findAllWithEmployeeIds(List<Long>,
     *      String)
     */
    @Override
    public List<Employees> findAllWithEmployeeIds(List<Long> employeeIds, String transID) {
        String jsonResult = employeesRepositoryTms.findAllWithEmployeeIds(employeeIds, transID);
        List<Employees> employeesList = new ArrayList<>();
        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return employeesList;
        }
        try {
            employeesList = objectMapper.readValue(jsonResult, new TypeReference<List<Employees>>() {});
        } catch (IOException e) {
            EmployeesCommonUtil.logAndThrowTmsIOException(e);
        }

        return employeesList;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findDepartmentWithEmployeeId(Long,
     *      String)
     */
    @Override
    public List<DepartmentPositionDTO> findDepartmentWithEmployeeId(Long employeeId, String transID) {
        String jsonResult = employeesDepartmentsRepositoryTms.findDepartmentWithEmployeeId(employeeId, transID);
        List<DepartmentPositionDTO> departmentPositionList = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return departmentPositionList;
        }

        try {
            departmentPositionList = objectMapper.readValue(jsonResult,
                    new TypeReference<List<DepartmentPositionDTO>>() {});
        } catch (IOException e) {
            EmployeesCommonUtil.logAndThrowTmsIOException(e);
        }

        return departmentPositionList;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findGroupWithEmployeeId(Long,
     *      String)
     */
    @Override
    public List<EmployeesGroupNameDTO> findGroupWithEmployeeId(Long employeeId, String transID) {
        String jsonResult = employeesGroupsRepositoryTms.findGroupWithEmployeeId(employeeId, transID);
        List<EmployeesGroupNameDTO> employeesGroupNameList = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return employeesGroupNameList;
        }
        try {
            employeesGroupNameList = objectMapper.readValue(jsonResult, new TypeReference<List<EmployeesGroupNameDTO>>() {});
        } catch (IOException e) {
            EmployeesCommonUtil.logAndThrowTmsIOException(e);
        }

        return employeesGroupNameList;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findStaffWithManagerId(Long,
     *      String)
     */
    @Override
    public List<EmployeeFullNameDTO> findStaffWithManagerId(Long employeeId, String transID) {
        String jsonResult = employeesRepositoryTms.findStaffWithManagerId(employeeId, transID);

        List<EmployeeFullNameDTO> employeeSubordinateList = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return employeeSubordinateList;
        }

        try {
            employeeSubordinateList = objectMapper.readValue(jsonResult, new TypeReference<List<EmployeeFullNameDTO>>() {});
        } catch (IOException e) {
            EmployeesCommonUtil.logAndThrowTmsIOException(e);
        }

        return employeeSubordinateList;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#endTransaction(String)
     */
    @Override
    public boolean endTransaction(String transID) {
        JSONObject result = tmsApi.endTransaction(transID);

        boolean response = isSuccess(result);
        if (!response) {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot end Transaction", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#rollbackTransaction(String)
     */
    @Override
    public boolean rollbackTransaction(String transID) {
        JSONObject result = tmsApi.rollbackTransaction(transID);

        boolean response = isSuccess(result);
        if (!response) {
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot roll back Transaction", Constants.TMS.TMS_UNEXPECTED_EXCEPTION));
        }
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findEmployeeIdsWithDepartmentIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<Long> findEmployeeIdsWithDepartmentIds(List<Long> departmentIds, String transID) {
        String jsonResult = employeesDepartmentsRepositoryTms.findEmployeeIdsWithDepartmentIds(departmentIds, transID);
        List<Long> employeeIdsOfDepartment = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return employeeIdsOfDepartment;
        }

        employeeIdsOfDepartment = getListOfLong(jsonResult, ConstantsEmployees.EMPLOYEE_ID);

        return employeeIdsOfDepartment;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findManagerIdsWithEmployeeIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<Long> findManagerIdsWithEmployeeIds(List<Long> employeeIds, String transID) {
        String jsonResult = employeesDepartmentsRepositoryTms.findManagerIdsWithEmployeeIds(employeeIds, transID);
        List<Long> managerIds = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query return no json result
            return managerIds;
        }

        managerIds = getListOfLong(jsonResult, ConstantsEmployees.MANAGER_ID);

        return managerIds;
    }

    /**
     * GEt list long from json data
     * 
     * @param json
     *            data
     * @param parseField
     *            field
     * @return
     */
    private List<Long> getListOfLong(String json, String parseField) {
        List<Long> list = new ArrayList<>();
        JSONArray array = (JSONArray) new JSONTokener(json).nextValue();
        for (int i = 0; i < array.length(); i++) {
            org.json.JSONObject jsonObject = (JSONObject) array.get(i);
            if (jsonObject.isNull(parseField)) {
                list.add(null);
            } else {
                list.add(jsonObject.getLong(parseField));
            }
        }
        return list;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findEmployeeIdsWithManagerIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<Long> findEmployeeIdsWithManagerIds(List<Long> managerIds, String transID) {
        String jsonResult = employeesDepartmentsRepositoryTms.findEmployeeIdsWithManagerIds(managerIds, transID);
        List<Long> staffIds = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query returns no json result
            return staffIds;
        }

        staffIds = getListOfLong(jsonResult, ConstantsEmployees.EMPLOYEE_ID);

        return staffIds;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#getSumEmployeePackageByIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<EmployeesPackageSumIdsDTO> getSumEmployeePackageByIds(List<Long> employeePackageIds, String transID) {
        String jsonResult = employeesPackagesRepositoryTms.getSumEmployeePackageByIds(employeePackageIds, transID);
        List<EmployeesPackageSumIdsDTO> empPackageIdList = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query returns no json result
            return empPackageIdList;
        }
        try {
            empPackageIdList = objectMapper.readValue(jsonResult, new TypeReference<List<EmployeesPackageSumIdsDTO>>() {});
        } catch (IOException e) {
            EmployeesCommonUtil.logAndThrowTmsIOException(e);
        }

        return empPackageIdList;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.TmsService#findEmployeeIdsWithGroupIds(java.util.List,
     *      java.lang.String)
     */
    @Override
    public List<Long> findEmployeeIdsWithGroupIds(List<Long> groupIds, String transID) {
        String jsonResult = employeesGroupsRepositoryTms.findEmployeeIdsWithGroupIds(groupIds, transID);
        List<Long> staffIds = new ArrayList<>();

        if (StringUtil.isEmpty(jsonResult)) { // Select query returns no json result
            return staffIds;
        }

        staffIds = getListOfLong(jsonResult, ConstantsEmployees.EMPLOYEE_ID);

        return staffIds;
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.TmsService#findOneEmployeeDTO(java.lang.Long, java.lang.String)
     */
    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.TmsServiceRelation#findOneEmployeeDTO(java.lang.Long, java.lang.String)
     */
    @Override
    public EmployeesDTO findOneEmployeeDTO(Long employeeId, String transID) {
        String jsonResult = employeesRepositoryTms.findOneEmployeeDTO(transID, employeeId);
        List<EmployeesDTO> listEmployees = new ArrayList<>();
        if (StringUtil.isEmpty(jsonResult)) {
            return null;
        }
        try {
            listEmployees = objectMapper.readValue(jsonResult, new TypeReference<List<EmployeesDTO>>(){});
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
            throw new CustomRestException(Constants.TMS.TMS_SERVICE_EXCEPTION,
                    CommonUtils.putError("Cannot get Employee Id", Constants.TMS.TMS_IO_EXCEPTION));
        }
        if (listEmployees == null || listEmployees.isEmpty()) {
            return null;
        }
        
        return listEmployees.get(0);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.TmsService#getEmployeeIdsCreatedRelation(java.util.List, java.util.List, java.lang.String)
     */
    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.TmsServiceRelation#getEmployeeIdsCreatedRelation(java.util.List, java.util.List, java.lang.String)
     */
    @Override
    public List<Long> getEmployeeIdsCreatedRelation(List<CustomFieldsInfoOutDTO> asList, List<Long> newRecordIds,
            String transID) {
        String jsonResult = employeesRepositoryTms.getEmployeeIdsCreatedRelation(transID, newRecordIds, asList);
        List<Long> listEmployeeId = new ArrayList<>();
        if (StringUtil.isEmpty(jsonResult)) {
            return listEmployeeId;
        }
        listEmployeeId = getListOfLong(jsonResult, ConstantsEmployees.EMPLOYEE_ID);
        return listEmployeeId;
    }
}
