package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupSearchConditionsDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupSearchConditionInfoResponse;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupSearchConditions}.
 */
@XRayEnabled
public interface EmployeesGroupSearchConditionsService {

    /**
     * Save a employeesGroupSearchConditions.
     *
     * @param employeesGroupSearchConditionsDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesGroupSearchConditionsDTO save(EmployeesGroupSearchConditionsDTO employeesGroupSearchConditionsDTO);

	/**
	 * Save all employees group search conditions.
	 *
	 * @param employeesGroupSearchConditionsDTOList
	 *            the entity to save.
	 * @return the persisted entity.
	 */
	List<EmployeesGroupSearchConditionsDTO> saveAll(
			List<EmployeesGroupSearchConditionsDTO> employeesGroupSearchConditionsDTOList);

    /**
     * Get all the employeesGroupSearchConditions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmployeesGroupSearchConditionsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" employeesGroupSearchConditions.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesGroupSearchConditionsDTO> findOne(Long id);

    /**
     * Delete the "id" employeesGroupSearchConditions.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Delete employees group search conditions by groupId.
     * 
     * @param groupId group id delete.
     */
    public void deleteGroupSearchByGroupId(Long groupId);

    /**
     * Get conditional information search group
     * 
     * @param groupId the groupId of the entity
     * @return list of the EmployeesGroupSearchConditionsDTO
     */
    public List<EmployeesGroupSearchConditionsDTO> getGroupSearchConditions(Long groupId);
    
    /**
     * Delete employeesGroupSearchConditions by groupId
     * 
     * @param groupId the id of the entity
     */
    void deleteByGroupId(Long groupId);

    /**
     * Get group search condition info
     * 
     * @param groupId
     *            the groupId of the entity
     * @return response of Employees Group Search Conditions
     */
    public GetGroupSearchConditionInfoResponse getGroupSearchConditionInfo(Long groupId);
}
