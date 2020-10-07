package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.CheckDeletePositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.MoveToDepartmentResponse;
import jp.co.softbrain.esales.employees.service.dto.SetManagersInDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.employees.domain.EmployeesDepartments}.
 */
@XRayEnabled
public interface EmployeesDepartmentsService {

    /**
     * Save a employeesDepartments.
     *
     * @param employeesDepartmentsDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesDepartmentsDTO save(EmployeesDepartmentsDTO employeesDepartmentsDTO);

    /**
     * Get all the employeesDepartments.
     *
     * @return the list of entities.
     */
    List<EmployeesDepartmentsDTO> findAll();


    /**
     * Get the "id" employeesDepartments.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesDepartmentsDTO> findOne(Long id);

    /**
     * Delete the "id" employeesDepartments.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);


    /**
     * Delete EmployeesDepartments by employeeId
     * @param employeeId
     */
    void deleteByEmployeeId(Long employeeId);

    /**
     * Move employees to department
     * 
     * @param departmentId - destination department
     * @param employeeIds - list employeeId will be moved
     * @param moveType - type dispatch or type concurrently
     * @return list employeeId have been moved
     */
    public MoveToDepartmentResponse moveToDepartment(Long departmentId, List<Long> employeeIds, Integer moveType);

    /**
     * Find by department id
     * 
     * @param departmentId
     * @param employeeIds
     * @return
     */
    public List<EmployeesDepartmentsDTO> findByDepartmentIdAndEmployeeIds(Long departmentId, List<Long> employeeIds);

    /**
     * save manager settings for the list of Employees
     *
     * @param settingParams - Manager setting information array
     * @return list employeesDepartmentId updated
     */
    public List<Long> setManagers(List<SetManagersInDTO> settingParams);

    /**
     * Remove manager settings by employeeIds.
     * 
     * @param employeeIds list employee id remove manager.
     * @return employee id list remove manager.
     */
    public List<Long> removeManager(List<Long> employeeIds);

    /**
     * Get EmployeeId by DepartmentIds
     * 
     * @param departmentIds departmentIds
     * @return the list EmployeeId
     */
    public List<Long> getEmployeeIdByDepartment(List<Long> departmentIds);

    /**
     * check delete positions : check delete position by list position id
     *
     * @param positionIds : list position id
     * @return CheckDeletePositionsOutDTO : list position id
     */
    public CheckDeletePositionsOutDTO getCheckDeletePositions(List<Long> positionIds);

}
