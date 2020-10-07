package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupMembersDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesGroupMembers}.
 */
@XRayEnabled
public interface EmployeesGroupMembersService {

    /**
     * Save a employeesGroupMember.
     *
     * @param employeesGroupMembersDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesGroupMembersDTO save(EmployeesGroupMembersDTO employeesGroupMembersDTO);

    /**
     * Get all the employeesGroupMembers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmployeesGroupMembersDTO> findAll(Pageable pageable);

    /**
     * Get the "id" employeesGroupMember.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesGroupMembersDTO> findOne(Long id);

    /**
     * Delete the "id" employeesGroupMember.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Delete group member by groupId.
     * 
     * @param groupId group id delete.
     */
    public void deleteEmployeesGroupByGroupId(Long groupId);

    /**
     * Delete employees group member by groupId and employeeIds.
     * 
     * @param groupId group id remove employees.
     * @param employeeIds employees id remove group.
     * @return list employeeId leaved.
     */
    public List<Long> leaveGroup(Long groupId, List<Long> employeeIds);

    /**
     * Save all employees group member list.
     *
     * @param employeesGroupMemberDTOList list entity to save.
     * @return list persisted entity.
     */
    public List<EmployeesGroupMembersDTO> saveAll(List<EmployeesGroupMembersDTO> employeesGroupMemberDTOList);

    /**
     * move the employee list from the source Group to the dest Group
     * 
     * @param sourceGroupId the groupId of the entity
     * @param destGroupId the groupId of the entity
     * @param employeeIds the list of employeeId
     * @return the list groupMemberId of the entity inserted
     */
    public List<Long> moveGroup(Long sourceGroupId, Long destGroupId, List<Long> employeeIds);

    /**
     * Add the employee list to the group
     * 
     * @param groupId the groupId of the entity.
     * @param employeeIds the employeeId list of the entity.
     * @return add group id list
     */
    public List<Long> addGroup(Long groupId, List<Long> employeeIds);
}
