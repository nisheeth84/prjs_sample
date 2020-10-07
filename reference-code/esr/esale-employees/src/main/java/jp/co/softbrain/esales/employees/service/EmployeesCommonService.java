package jp.co.softbrain.esales.employees.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeeElasticsearchInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsInDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsOutDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.SelectedOrganizationInfoOutDTO;

/**
 * Service Interface Common
 */
@XRayEnabled
public interface EmployeesCommonService {

    /**
     * Count the number of Employees in the department
     *
     * @param departmentId - the departmentId of the entity.
     * @return total employees in department
     */
    Long countEmployees(Long departmentId);

    /**
     * Get information of shared groups
     *
     * @param employeeId the employeeId of the entity.
     * @param isOwner the isOwner of the entity.
     * @return information shared groups
     */
    public List<EmployeesGroupsDTO> getSharedGroups(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, boolean isOwner);

    /**
     * Check for duplicate User ID when registering / editing Employees
     *
     * @param employeeId the employeeId of the entity.
     * @param userId the userId of the entity.
     * @return true if duplicate User ID
     */
    Boolean isExistUserID(Long employeeId, String userId);

    /**
     * Check exists relation department
     *
     * @param employeeId the employeeId of the entity.
     * @param departmentId the departmentId of the entity.
     * @return true if exists relation department
     */
    Boolean isExistDepartmentRelation(Long employeeId, Long departmentId);

    /**
     * Check for duplicate departments when registering / editing departments
     *
     * @param departmentId the departmentId of the entity.
     * @param departmentName the departmentName of the entity.
     * @param parentId the parentId of the entity.
     * @return true if duplicate departments
     */
    Boolean isExistDepartment(Long departmentId, String departmentName, Long parentId);

    /**
     * Get all the parts information of the tenant
     *
     * @return list department information
     */
    List<DepartmentsDTO> getDepartments();

    /**
     * Get all the positions information of the tenant
     * 
     * @param langCode - language code of user login
     * @return list position information
     */
    List<PositionsDTO> getPositions();

    /**
     * Get information of my groups
     *
     * @param employeeId the employeeId of the entity.
     * @return list myGroups of employees
     */
    List<EmployeesGroupsDTO> getMyGroups(Long employeeId);

    /**
     * get calculator formular
     * 
     * @param fieldBelong
     * @return
     */
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong);

    /**
     * Get the list of employees by list employeeIds and sort by list orderBy
     *
     * @param employeeIds - list employeeId
     * @param orderBy - array order condition
     * @param langKey - User specified language
     * @return employees information
     */
    List<DownloadEmployeesDTO> getEmployeesForDownload(List<Long> employeeIds, List<KeyValue> orderBy, String langKey);

    /**
     * Get the list of employees by list employeeIds and sort by list orderBy
     * 
     * @param employeeIds - list employeeId
     * @param orderBy - array order condition
     * @param langKey - User specified language
     * @return employees information
     */
    List<EmployeesDTO> getEmployees(List<Long> employeeIds, List<KeyValue> orderBy, String langKey);

    /**
     * Copy file to s3 cloud.
     * 
     * @param fileName file name file upload
     * @param fileExtension file extension file upload
     * @param content content file upload
     * @return path save file.
     */
    public String copyFileToS3(String fileName, String fileExtension, String content);

    /**
     * get manager of department
     * 
     * @param departmentId - department id
     * @return manager of department information
     */
    public DepartmentManagerDTO getDepartment(Long departmentId);

    /**
     * request change data elasticsearch
     * 
     * @param employeeIds
     * @param departmentIds
     * @param groupIds
     * @param action
     * @return
     */
    public Boolean requestChangeDataElasticSearch(List<Long> employeeIds, List<Long> departmentIds, List<Long> groupIds,
            Integer action);

    /**
     * get employees on elasticsearch
     * 
     * @param channel
     * @param responseBuilder
     * @param inDto
     * @return
     */
    public jp.co.softbrain.esales.employees.service.dto.commons.SelectDetailElasticSearchResponse getEmployeesElasticsearch(
            SelectEmployeeElasticsearchInDTO inDto);

    /**
     * Get employee data for elasticsearch
     *
     * @param employeeIds List of employee id
     * @return List of {@link EmployeeElasticsearchDTO}
     */
    public List<EmployeeElasticsearchDTO> getDataSyncElasticSearch(List<Long> employeeIds);

    /**
     * get employee data for elasticsearch
     * 
     * @param employeeIds
     * @return
     */
    public List<EmployeeInfoDTO> getEmployeeByIds(List<Long> employeeIds);

    /**
     * method get Info Selected Organization
     * 
     * @param employeeId data need for get data
     * @param departmentId data need for get data
     * @param groupId data need for get data
     * @return Info Selected Organization
     */
    public SelectedOrganizationInfoOutDTO getSelectedOrganizationInfo(List<Long> employeeId, List<Long> departmentId,
            List<Long> groupId, Long employeeIdLogin);

    /**
     * get data for relation, organization and calculation field
     * @param recordIds id of record
     * @param fieldInfo fields to get
     * @return List data of field
     */
    public GetDataByRecordIdsOutDTO getDataByRecordIds(List<Long> recordIds,
            List<GetDataByRecordIdsInDTO> fieldInfo, Long employeeIdLogin);
    /**
     * Get parent of department
     * 
     * @param departmentIds list department id
     * @return manager of department information
     */
    public List<GetParentDepartmentDTO> getParentDepartment(List<Long> departmentIds);

    /**
     * Get list or group with only owner
     *
     * @param fieldName
     * @param fieldValue
     */
    public List<GetOrganizationGroupDTO> getListOrGroupWithOnlyOneOwner(String fieldName, Long fieldValue);
}
