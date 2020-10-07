package jp.co.softbrain.esales.employees.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.employees.service.dto.CalculatorResultDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsGroupsMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadDepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeBasicDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSummaryDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeSyncQuickSightDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupSelectedOrganizationDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;

@Repository
@XRayEnabled
public interface EmployeesRepositoryCustom {

    /**
     * get calculator formular
     *
     * @param fieldBelong
     * @return
     */
    public List<CalculatorFormularDTO> getCalculatorFormular(Integer fieldBelong);

    /**
     * get total employees
     *
     * @param searchConditions - Array of search criteria
     * @return total employees
     */
    public Long getTotalEmployees(SearchConditionsDTO searchConditions);

    /**
     * get list employees
     *
     * @param searchConditions - Array of search criteria
     * @return list employees information
     */
    public List<SelectEmployeesDTO> getEmployees(SearchConditionsDTO searchConditions);

    /**
     * get department and postion by employeeId
     *
     * @param employeeIds - employee id
     * @param languageCode - language of user login
     * @return department and postion of employeeId
     */
    List<DownloadDepartmentPositionDTO> findDepartmentByEmployeeIds(List<Long> employeeIds, String languageCode);

    /**
     * get manager of employee by employeeId
     *
     * @param employeeIds - employee id
     * @return manager of employee
     */
    public List<DownloadEmployeeNameDTO> findManagerByEmployeeIds(List<Long> employeeIds);

    /**
     * get list staff name by managerId
     *
     * @param managerIds - manager id
     * @return list staff name of managerId
     */
    public List<DownloadEmployeeNameDTO> findEmployeeByManagerIds(List<Long> managerIds);

    /**
     * get data calculator item
     *
     * @param employeeIds - employee ids
     * @param formular - formular string
     * @return list data calculator
     */
    public List<CalculatorResultDTO> getCalculatorResult(List<Long> employeeIds, String formular);

    /**
     * get department and postion by employeeId
     *
     * @param employeeId - employee id
     * @param managerId - id of manager
     * @param languageCode - language of user login
     * @return department and postion of employeeId
     */
    List<DepartmentPositionDTO> findDepartmentByEmployeeId(List<Long> employeeIds, Long managerId);

    /**
     * get manager of employee by employeeId
     *
     * @param employeeId - employee id
     * @return manager of employee
     */
    public List<EmployeeNameDTO> findManagerByEmployeeId(Long employeeId);

    /**
     * get list staff name by managerId
     *
     * @param managerId - manager id
     * @return list staff name of managerId
     */
    public List<EmployeeNameDTO> findEmployeeByManagerId(Long managerId);

    /**
     * Get list employee by employeeIds and order by list orderBy - CommonLogic
     *
     * @param employeeIds - list employee id
     * @param orderBy - Array of fields to order
     * @return list employee information
     */
    public List<SelectEmployeesDTO> getEmployeesByEmployeeIds(List<Long> employeeIds, List<KeyValue> orderBy);

    /**
     * Get list mail of employee
     *
     * @param employeeIds - list employee id
     * @param groupIds - list group id
     * @param departmentIds - list department id
     * @return list email return
     */
    public List<String> getEmployeeMails(List<Long> employeeIds, List<Long> groupIds, List<Long> departmentIds);

    /**
     * Check exsit employee
     *
     * @param keyFieldName - field search
     * @param fieldValue - value search
     * @return number of employee satisfied
     */
    public Long countEmployeeByKey(String keyFieldName, String fieldValue);

    /**
     * Check record existed in DB by condition.
     *
     * @param columnCheckDuplicatedMap column check duplicated map
     * @param csvContentRow CSV content row.
     * @return number data that satisfies the condition.
     */
    public List<Long> getEmployeeIdsByCondition(Map<Integer, String> columnCheckDuplicatedMap,
            List<String> csvContentRow);

    /**
     * Get list employees by keyword
     *
     * @param keyWord - key search
     * @return list employees satisfied
     */
    public List<Employees> getEmployeesByKeyword(String keyWord);

    /**
     * Get managers
     *
     * @param employeeId: employee need to get his/her managers
     * @return the employee's managers
     */
    public List<EmployeeSummaryDTO> getEmployeesManagers(Long employeeId);

    /**
     * Get list departmentId and groupId.
     *
     * @param employeeIds - list employeeId
     * @return GetGroupAndDepartmentDTO
     */
    public List<GetGroupAndDepartmentDTO> getListGroupIdAndDepartmentId(List<Long> employeeIds);

    /**
     * get info Employee Selected Organization
     * 
     * @param employeeId data need for get data
     * @param langCode
     * @return data Employee Selected Organization
     */
    public List<EmployeeSelectedOrganizationDTO> getEmployeeSelectedOrganization(List<Long> employeeId,
            String langCode);

    /**
     * get info Group Selected Organization
     * @param groupId data need for get data
     * @return data Group Selected Organization
     */
    public List<GroupSelectedOrganizationDTO> getGroupSelectedOrganization(List<Long> groupId);

    /**
     * get info Department Selected Organization
     * @param departmentId data need for get data
     * @return data Department Selected Organization
     */
    public List<DepartmentSelectedOrganizationDTO> getDepartmentSelectedOrganization(List<Long> departmentId);

    /**
     *
     * @param empIds
     * @param languageCode
     * @return
     */
    List<InitializeGroupModalSubType2DTO> getEmployeesByEmployeesIds(List<Long> empIds, String languageCode);

    /**
     * get List of employees with certain field already had relation with another field
     * @param IdListSearch list of employee_id tp search in
     * @param field field info of the field that need to check
     * @return List of employees that already had relation with param field
     */
    List<Employees> getEmployeesWithRelation(List<Long> idListSearch, CustomFieldsInfoOutDTO field);

    /**
     * Get the ID of the products that created the relation
     *
     * @param fields
     * @param productIds
     * @return productIds
     */
    List<Long> getEmployeeIdsCreatedRelation(List<CustomFieldsInfoOutDTO> fields, List<Long> employeeIds);

    /**
     * find package by employee ids
     *
     * @param employeeIds
     * @return
     */
    List<EmployeesPackagesSubtypeDTO> findPackagesByEmployeeId(List<Long> employeeIds);

    /**
     * get Calculation value
     * @param calculationFormular calculation's formular
     * @param employeeId id of employee to get value
     * @return value of calculation
     */
    String getCalculation(String calculationFormular, Long employeeId);

    /**
     * get calculator formular include one that doesn't display on list
     *
     * @param fieldBelong
     * @return
     */
    List<CalculatorFormularDTO> getAllCalculatorFormular(Integer fieldBelong);

    /**
     * Get employee ids by list employee's name
     *
     * @param list employee's name
     * @return list EmployeeNameDTO
     */
    public List<EmployeeNameDTO> getEmployeesByFullNames(List<String> employeeNames);

    /**
     * Find list of employees that are synchronize quick-sight target
     *
     * @param employeeIds List of employee_id
     * @param packageId packageId
     * @return List of {@link EmployeeSyncQuickSightDTO}
     */
    List<EmployeeSyncQuickSightDTO> findEmployeesSyncQuickSight(List<Long> employeeIds, Long packageId);

    /**
     * get employee by tenant
     *
     * @param email
     * @return List<EmployeeOutDTO>
     */
    EmployeeOutDTO getEmployeeByTenant(String email);

    /**
     * Get list or group with only owner
     * @param fieldName
     * @param fieldValue
     * @return
     */
    List<GetOrganizationGroupDTO> getListOrGroupWithOnlyOneOwner(String fieldName, Long fieldValue);

    /**
     * Get employees basic
     * 
     * @param employeeId condition to get data
     * @return List<EmployeeBasicDTO> data response
     */
    List<EmployeeBasicDTO> getEmployeeBasic(Long employeeId);

    /**
     * @param organizationIdsList - list departmentIDs or groupIDs
     * @param organizationType - 0: department, 1: group
     * @return list member of group or department
     */
    public List<DepartmentsGroupsMembersDTO> getListMemberByOrganizationInfo(List<Long> organizationIdsList,
            int organizationType);
}
