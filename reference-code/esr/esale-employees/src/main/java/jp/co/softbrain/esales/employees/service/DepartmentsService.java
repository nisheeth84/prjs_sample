package jp.co.softbrain.esales.employees.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeDepartmentModalOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetDepartmentsOfEmployeeDepartment;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupAndDepartmentByNameResponse;
import lombok.NonNull;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.employees.domain.Departments}.
 */
@XRayEnabled
public interface DepartmentsService {

    /**
     * Save a departments.
     *
     * @param departmentsDTO the entity to save.
     * @return the persisted entity.
     */
    DepartmentsDTO save(DepartmentsDTO departmentsDTO);

    /**
     * Get all the departments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DepartmentsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" departments.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DepartmentsDTO> findOne(Long id);

    /**
     * Delete the "id" departments.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * get all departments
     * 
     * @return the list of department dto.
     */
    List<DepartmentsDTO> findAll();

    /**
     * Initialize Department Modal
     * 
     * @param departmentId departmentId
     * @return the entity of InitializeDepartmentModalOutDTO
     */
    public InitializeDepartmentModalOutDTO initializeDepartmentModal(Long departmentId);

    /**
     * create departments
     * 
     * @param departmentName
     * @param managerId the managerId of entity
     * @param parentId the parentId of entity
     * @return the departmentId of the entity inserted
     */
    public Long createDepartment(String departmentName, Long managerId, Long parentId);

    /**
     * Update department
     * 
     * @param departmentId the departmentId of the entity 
     * @param departmentName the departmentName of the entity 
     * @param managerId the managerId of the entity 
     * @param parentId the parentId of the entity 
     * @param updatedDate the updatedDate of the entity 
     * @return departmentId of the entity updated
     */
    public Long updateDepartment(Long departmentId, String departmentName, Long managerId, Long parentId,
            Instant updatedDate);

    /**
     * Change departmentOrder by id
     * 
     * @param departmentParams - info about department which be changed
     * @return list Id department has changed
     */
    public List<Long> changeDepartmentOrder(List<DepartmentsDTO> departmentParams);

    /**
     * Delete department by id
     * 
     * @param departmentId - id department to delete
     * @return the "id" department has been delete if success
     */
    public Long deleteDepartment(Long departmentId);

    /**
     * Get departments by list id
     *
     * @param departmentIds - list id
     * @param employeeId - id of employee
     * @param getEmployeesFlg - flag define get employees
     * @param languageKey - language key from token.
     * @return object contains informations department and employees.
     */
    public GetDepartmentsOutDTO getDepartments(List<Long> departmentIds, Long employeeId, boolean getEmployeesFlg, String languageKey);

    /**
     * get departments of employee
     * @param employeeId the ID of employee
     * @return list of department DTO
     */
    List<GetDepartmentsOfEmployeeDepartment> getDepartmentsOfEmployee(@NonNull Long employeeId);

    /**
     * Get group and department by name
     * 
     * @param searchValue
     *            searchValue
     * @param searchType
     *            searchType
     * @param searchOption
     *            searchOption
     * @return response object
     */
    GetGroupAndDepartmentByNameResponse getGroupAndDepartmentByName(String searchValue, Integer searchType,
            Integer searchOption);
}
