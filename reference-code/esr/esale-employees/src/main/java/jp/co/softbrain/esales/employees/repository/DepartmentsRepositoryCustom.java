package jp.co.softbrain.esales.employees.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.DepartmentAndEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentEmployeeListDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOfEmployeeQueryResult;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType2;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantDepartmentDTO;

@Repository
@XRayEnabled
public interface DepartmentsRepositoryCustom {

    /**
     * Check for duplicate departments when registering / editing departments
     *
     * @param departmentId - department id
     * @param departmentName - department name
     * @param parentId - parent id of department
     * @return true if duplicate departments
     */
    boolean isExistDepartment(Long departmentId, String departmentName, Long parentId);

    /**
     * get department by keyword
     *
     * @param keyWords Keywords perform the search
     * @param idItemChoiceList idHistoryChoiceList
     * @param idHistoryChoiceList idItemChoiceList
     * @return information of department
     */
    public List<GetEmployeesSuggestionSubType2> getDepartmentsByKeyWord(String keyWords, List<Long> idHistoryChoiceList,
            List<Long> idItemChoiceList);

    /**
     * get department by keyword
     *
     * @param keyWords Keywords perform the search
     * @param idItemChoiceList idHistoryChoiceList
     * @param inviteId inviteId
     * @param idHistoryChoiceList idItemChoiceList
     * @return information of department
     */
    public List<GetEmployeesSuggestionSubType2> getDepartmentsTimelineByKeyWord(String keyWords,
            List<Long> idHistoryChoiceList, List<Long> inviteId, List<Long> idItemChoiceList);

    /**
     * Get employee's Department and position
     *
     * @param employeeId: id of employee
     * @return employee's Department and position
     */
    public List<EmployeeDepartmentsDTO> getEmployeeDepartmentPosition(Long employeeId);

    /**
     * get department by list departmentIds
     *
     * @param depIds list departmentIds
     * @return
     */
    public List<ParticipantDepartmentDTO> getDepartmentsByDepartmentIds(List<Long> depIds);

    /**
     * Get list department and employeeIds.
     *
     * @param departmentIds - IDs to get
     * @param employeeId - id of employee
     * @param getEmployeesFlg - flag define get employees
     * @return department and employeeIds list.
     */
    public List<DepartmentAndEmployeeDTO> getDepartmentAndEmployeeIds(List<Long> departmentIds, Long employeeId,
            boolean getEmployeesFlg);

    /**
     * get manager of department
     *
     * @param departmentId - department id
     * @return manager of department information
     */
    public DepartmentManagerDTO getDepartment(Long departmentId);

    /**
     * Get parent department
     * 
     * @param departmentIds list department id
     * @return the DTO response for get parent department
     */
    public List<GetParentDepartmentDTO> getParentDepartment(List<Long> departmentIds);

    /**
     * get list of department by employee ID
     * @param employeeId the ID of employee
     * @return list of result
     */
    List<GetDepartmentsOfEmployeeQueryResult> getDepartmentsOfEmployee(Long employeeId);

    /**
     * get department and employee for select organization item
     *
     * @param departmentIds
     * @return
     */
    List<DepartmentEmployeeListDTO> getDepartmentsAndEmployeesForOrg(List<Long> departmentIds);

    /**
     * get department by conditions
     * 
     * @param conditions
     *        conditions
     * @param parameters
     *        parameters list
     * @return list of result
     */
    List<GetDepartmentByNameDTO> getDepartmentByConditions(String conditions,  Map<String, Object> parameters);
}
