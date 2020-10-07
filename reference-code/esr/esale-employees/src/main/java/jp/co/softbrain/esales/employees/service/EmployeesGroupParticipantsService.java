package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupParticipantsDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupParticipants}.
 */
@XRayEnabled
public interface EmployeesGroupParticipantsService {

    /**
     * Save a employeesGroupParticipants.
     *
     * @param employeesGroupParticipantsDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesGroupParticipantsDTO save(EmployeesGroupParticipantsDTO employeesGroupParticipantsDTO);

	/**
	 * Save all employees group Participants list.
	 *
	 * @param employeesGroupParticipantsDTOList
	 *            list entity to save.
	 * @return list persisted entity.
	 */
	List<EmployeesGroupParticipantsDTO> saveAll(
			List<EmployeesGroupParticipantsDTO> employeesGroupParticipantsDTOList);

    /**
     * Get all the employeesGroupParticipants.
     *
     * @return the list of entities.
     */
    List<EmployeesGroupParticipantsDTO> findAll();

    /**
     * Get the "id" employeesGroupParticipants.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesGroupParticipantsDTO> findOne(Long id);

    /**
     * Delete the "id" employeesGroupParticipants.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    
    /**
     * Delete employeesGroupParticipants by groupId
     * 
     * @param groupId the id of the entity
     */
    void deleteByGroupId(Long groupId);

    /**
     * get info participants group by groupId
     * 
     * @param groupId the groupId of the entity
     * @return list of the EmployeesGroupParticipantsDTO
     */
    List<EmployeesGroupParticipantsDTO> getGroupParticipants(Long groupId);

    /**
     * Delete record employees group participants by departmentId.
     * 
     * @param departmentId departmentId delete.
     */
    public void deleteByDepartmentId(Long departmentId);
}
