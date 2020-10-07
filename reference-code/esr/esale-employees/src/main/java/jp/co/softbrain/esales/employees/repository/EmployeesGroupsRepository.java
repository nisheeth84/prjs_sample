package jp.co.softbrain.esales.employees.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;

/**
 * Spring Data repository for the EmployeesGroups entity.
 */
@Repository
@XRayEnabled
public interface EmployeesGroupsRepository
        extends JpaRepository<EmployeesGroups, Long>  {

    public Optional<EmployeesGroups> findFirstByDisplayOrderNotNullOrderByDisplayOrderDesc();

    /**
     * Get list group entity by employeeId
     * 
     * @param employeeId - id employee to find group
     * @return list entity
     */
    @Query(value = "SELECT eGroup.* FROM employees_groups eGroup "
                 + "INNER JOIN  employees_group_participants eGp "
                 + "        ON eGroup.group_id = eGp.group_id "
                 + "WHERE eGroup.group_type = 1 "
                 + "  AND eGp.employee_id = :employeeId "
                 + "  AND eGp.participant_type = 2 "
                 + "ORDER BY eGroup.display_order ASC", nativeQuery = true)
    List<EmployeesGroups> getMyGroups(@Param("employeeId") Long employeeId);

    @Modifying(clearAutomatically = true)
    void deleteByGroupIdAndCreatedUser(Long groupId, Long createdUser);

    /**
     * Get group which owned by employee
     * 
     * @param groupId - id of group
     * @param employeeId - id of employee
     * @return An entity that contains information
     */
    @Query(value = "SELECT * FROM employees_groups eg " 
                 + "INNER JOIN employees_group_participants egp "
                 + "        ON eg.group_id = egp.group_id " 
                 + "WHERE eg.group_id = :groupId "
                 + "  AND egp.employee_id = :employeeId "
                 + "  AND egp.participant_type = 2", nativeQuery = true)
    EmployeesGroups getMyGroup(@Param("groupId") Long groupId, @Param("employeeId") Long employeeId);

    /**
     * get employee group data
     * 
     * @param groupIds - list group id
     * @return list entity
     */
    @Query(value = "SELECT * "
                 + "FROM employees_groups empGroups "
                 + "WHERE empGroups.group_id IN ( :groupIds )", nativeQuery = true)
    List<EmployeesGroups> getGroupByGroupIds(@Param("groupIds") List<Long> groupIds);
    

    /**
     * get Group of Employee
     * 
     * @param employeeId
     * @return
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO("
            + " empg.groupId, empg.groupName)" + 
            " FROM EmployeesGroupMembers egm" + 
            " INNER JOIN EmployeesGroups empg ON empg.groupId = egm.groupId" + 
            " WHERE egm.employeeId = :employeeId")
    List<EmployeesGroupNameDTO> findGroupWithEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * Get EmployeeId by group_id
     * 
     * @param groupIds the list group_id
     * @return the list EmployeeId
     */
    @Query(value = " SELECT egp.employee_id "
                 + " FROM employees_groups eg "
                 + " INNER JOIN employees_group_participants egp "
                 + "        ON eg.group_id = egp.group_id "
                 + " WHERE eg.group_id IN ( :groupIds ) ", nativeQuery = true)
    List<Long> getListEmployeeIdByGroupId(@Param("groupIds") List<Long> groupIds);

    /**
     * Get list groupId by employeeId
     * 
     * @param employeeId - id employee to find group
     * @return list groupId
     */
    @Query(value = "SELECT eGroup.group_id FROM employees_groups eGroup "
                 + "INNER JOIN  employees_group_participants eGp "
                 + "        ON eGroup.group_id = eGp.group_id "
                 + "WHERE eGp.employee_id = :employeeId "
                 + "  AND eGp.participant_type = 2 "
                 + "ORDER BY eGroup.display_order ASC", nativeQuery = true)
    List<Long> getGroupIdByEmployeeId(@Param("employeeId") Long employeeId);

    /**
     * Get EmployeeGroup by group id
     * 
     * @param groupId id group
     * @return the entity of employee group
     */
    EmployeesGroups findByGroupId(Long groupId);

    /**
     * @param employeeId - owner of groups
     * @return
     */
    @Query(value = " SELECT eg.group_id "
                 + " FROM employees_groups eg "
                 + " INNER JOIN employees_group_participants egp "
                 + "     ON eg.group_id = egp.group_id "
                 + " WHERE egp.employee_id =:employeeId "
                 + "     AND egp.participant_type = 2 ", nativeQuery = true)
    List<Long> findGroupsByOwner(@Param("employeeId") Long employeeId);

    /**
     * @param searchValue
     * @return
     */
    public List<EmployeesGroups> findByGroupNameContainingIgnoreCase(String searchValue);

    /**
     * Get last updated date by group id
     * 
     * @param groupId
     *            groupId
     * @return lastUpdatedDate
     */
    @Query(value = "SELECT eGroup.last_updated_date "
                 + " FROM employees_groups eGroup "
                 + " WHERE eGroup.group_id =:groupId ", nativeQuery = true)
    public Instant findLastUpdatedDateByGroupId(@Param("groupId") Long groupId);

    /**
     * get Group of Employee
     * 
     * @param employeeId
     * @return
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO("
            + " groupId, groupName)" + 
            " FROM  EmployeesGroups " + 
            " WHERE groupName = :groupName")
    List<GetOrganizationGroupDTO> findGroupWithName(@Param("groupName") String groupName);

    /**
     * @param departmentIds
     * @return
     */
    public List<EmployeesGroups> findByGroupIdIn(List<Long> groupIds);
}
