package jp.co.softbrain.esales.employees.service;

import java.io.IOException;
import java.util.List;

import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;

public interface TmsService {

    /**
     * Start transaction
     * 
     * @return transaction id
     */
    String startTransaction();

    /**
     * End transaction
     * 
     * @param transID
     *            transaction id
     * @return true: success
     */
    boolean endTransaction(String transID);

    /**
     * Rollback transaction
     * 
     * @param transID
     *            transaction id
     * @return true: success
     */
    boolean rollbackTransaction(String transID);

    /**
     * Save a employees.
     *
     * @param employeesDTO
     *            the entity to save.
     * @param transID
     *            transaction id
     * @return the persisted entity.
     */
    EmployeesDTO saveEmployee(EmployeesDTO employeesDTO, String transID);

    /**
     * Save a employees package.
     *
     * @param employeesPackagesDTO
     *            the entity to save.
     * @param transID
     *            transaction id
     * @return the persisted entity.
     */
    EmployeesPackagesDTO saveEmployeePackage(EmployeesPackagesDTO employeesPackagesDTO, String transID);

    /**
     * Save a employees department.
     *
     * @param employeesDepartmentsDTO
     *            the entity to save.
     * @param transID
     *            transaction id
     * @return the persisted entity.
     */
    EmployeesDepartmentsDTO saveEmployeeDepartment(EmployeesDepartmentsDTO employeesDepartmentsDTO, String transID);

    /**
     * Save a employees history.
     *
     * @param employeesHistoriesDTO
     *            the entity to save.
     * @param transID
     *            transaction id
     * @return the persisted entity.
     */
    EmployeesHistoriesDTO saveEmployeeHistory(EmployeesHistoriesDTO employeesHistoriesDTO, String transID);

    /**
     * Delete the "id" employees.
     *
     * @param id
     *            the id of the entity.
     * @param transID
     *            transaction id
     */
    boolean deleteEmployee(Long id, String transID);

    /**
     * Get list of employees
     * 
     * @param employeeIds
     * @param transID
     * @return List of employees
     * @throws IOException
     */
    List<Employees> findAllWithEmployeeIds(List<Long> employeeIds, String transID);

    /**
     * Get department by employee id *
     * 
     * @param employeeId
     *            employeeId
     * @param transID
     *            transID
     * @return list dto response
     * @throws IOException
     */
    List<DepartmentPositionDTO> findDepartmentWithEmployeeId(Long employeeId, String transID);

    /**
     * Get group by employee id
     * 
     * @param employeeId
     *            employeeId
     * @param transID
     *            transID
     * @return list dto data
     * @throws IOException
     */
    List<EmployeesGroupNameDTO> findGroupWithEmployeeId(Long employeeId, String transID);

    /**
     * Get staff info by managerId
     * 
     * @param employeeId
     * @param transID
     * @return
     * @throws IOException
     */
    List<EmployeeFullNameDTO> findStaffWithManagerId(Long employeeId, String transID);

    /**
     * Delete employee package by employee id
     * 
     * @param id
     * @param transID
     * @return
     */
    boolean deleteEmployeePackageByEmployeeId(Long employeeId, String transID);

    /**
     * Save employee departments
     * 
     * @param listEmpDep
     * @param transID
     * @return
     */
    List<EmployeesDepartments> saveAllEmployeesDepartments(List<EmployeesDepartments> listEmpDep, String transID);

    /**
     * Delete employees departments
     * 
     * @param listEmpDepDelete
     * @param transID
     * @return
     */
    boolean deleteAllEmployeesDepartments(List<EmployeesDepartments> listEmpDepDelete, String transID);

    /**
     * Find Employees Ids with department Ids
     * 
     * @param departmentIds
     * @param transID
     * @return list emp id
     * @throws IOException
     */
    List<Long> findEmployeeIdsWithDepartmentIds(List<Long> departmentIds, String transID);

    /**
     * Find Manager Ids With Employee Ids
     * 
     * @param employeeIds
     * @param transID
     * @return
     * @throws IOException
     */
    List<Long> findManagerIdsWithEmployeeIds(List<Long> employeeIds, String transID);

    /**
     * Find employee Ids with manager Ids
     * 
     * @param employeeIds
     * @param transID
     * @return
     * @throws IOException
     */
    List<Long> findEmployeeIdsWithManagerIds(List<Long> employeeIds, String transID);

    /**
     * Find employees packages ids by employees Ids
     * 
     * @param employeesIds
     * @param transID
     * @return
     */
    List<Long> findEmployeesPackagesIdsByEmployeeIds(List<Long> employeesIds, String transID);

    /**
     * get Sum EmployeePackage By Ids
     * 
     * @param employeePackageIds
     * @param transID
     * @return EmployeesPackageSumIdsDTO
     * @throws IOException
     */
    List<EmployeesPackageSumIdsDTO> getSumEmployeePackageByIds(List<Long> employeePackageIds, String transID);

    /**
     * find Employee Ids With GroupIds
     * 
     * @param groupIds
     * @param transID
     * @return
     */
    List<Long> findEmployeeIdsWithGroupIds(List<Long> groupIds, String transID);

    /**
     * @param employeeId
     * @param transID
     * @return
     */
    EmployeesDTO findOneEmployeeDTO(Long employeeId, String transID);

    /**
     * @param asList
     * @param newRecordIds
     * @param transID
     * @return
     */
    List<Long> getEmployeeIdsCreatedRelation(List<CustomFieldsInfoOutDTO> asList, List<Long> newRecordIds,
            String transID);
}
